"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  canManageInventory,
  canManagePeople,
  changePassword,
  createSession,
  createUser,
  currentUser,
  destroySession,
  findUserByEmail,
  findUserById,
  isDuplicate,
  verifyPassword,
  type Role,
} from "../lib/auth";
import { ensureReady } from "../lib/bootstrap";
import {
  createCard,
  deleteCard,
  isKind,
  parsePrice,
  parseYear,
  setStatus,
  updateCard,
  type CardDetails,
} from "../lib/cards-db";
import { hold, releaseHold } from "../lib/holds";
import { isVisionConfigured, suggestFromPhoto } from "../lib/vision";

import type { ActionState, SuggestResult } from "../lib/action-state";
export type { ActionState };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badEmail(email: string) {
  return !EMAIL_RE.test(email) || email.length > 254;
}

const text = (form: FormData, key: string, max = 80) =>
  String(form.get(key) ?? "")
    .trim()
    .slice(0, max);

/** Empty strings become null, so an untouched field is absent rather than "". */
const orNull = (value: string) => (value ? value : null);

/**
 * Pulls the card attributes off a form.
 *
 * A homemade card cannot carry sports fields even if a stale input is still
 * sitting in the DOM — the kind is decided first and the rest follows from it,
 * so the shop can never end up claiming Lina's felt-tip unicorn was printed by
 * Topps in 1989.
 */
function readDetails(form: FormData): CardDetails {
  const raw = String(form.get("kind") ?? "homemade");
  const kind = isKind(raw) ? raw : "homemade";
  // Notes belong to both kinds — "she drew this on the train" is worth keeping.
  const notes = orNull(text(form, "notes", 600));
  if (kind === "homemade") return { kind, notes };

  return {
    kind,
    notes,
    player: orNull(text(form, "player")),
    team: orNull(text(form, "team")),
    sport: orNull(text(form, "sport", 40)),
    cardSet: orNull(text(form, "cardSet")),
    year: parseYear(text(form, "year", 10)),
    cardNumber: orNull(text(form, "cardNumber", 20)),
    manufacturer: orNull(text(form, "manufacturer")),
    condition: orNull(text(form, "condition", 40)),
  };
}

export async function signIn(_prev: ActionState, form: FormData): Promise<ActionState> {
  await ensureReady();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const user = await findUserByEmail(email);
  // Same message either way, so this cannot be used to discover which
  // emails have accounts.
  const failed = { error: "That email and password do not match." };
  if (!user) return failed;
  if (!(await verifyPassword(password, user.password_hash))) return failed;

  await createSession(user.id);
  redirect(user.role === "buyer" ? "/" : "/manage");
}

export async function signOut() {
  await destroySession();
  redirect("/");
}

export async function registerBuyer(_prev: ActionState, form: FormData): Promise<ActionState> {
  await ensureReady();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const displayName = String(form.get("displayName") ?? "").trim();

  if (badEmail(email)) return { error: "That does not look like an email address." };
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };
  if (!displayName) return { error: "Enter the name you want to be known by." };

  try {
    // Self-registration is always a buyer. Staff and owner are created by the
    // owner, so this endpoint cannot be used to grant privilege.
    const id = await createUser({ email, password, role: "buyer", displayName });
    await createSession(id);
  } catch (err) {
    if (isDuplicate(err)) return { error: "There is already an account with that email." };
    throw err;
  }
  redirect("/");
}

/** Owner-only: create a shopkeeper or another owner. */
export async function createPerson(_prev: ActionState, form: FormData): Promise<ActionState> {
  await ensureReady();
  const me = await currentUser();
  if (!canManagePeople(me)) return { error: "Only the owner can add people." };

  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const displayName = String(form.get("displayName") ?? "").trim();
  const role = String(form.get("role") ?? "staff") as Role;

  if (!["owner", "staff", "buyer"].includes(role)) return { error: "Pick a valid role." };
  if (badEmail(email)) return { error: "That does not look like an email address." };
  if (password.length < 8) return { error: "Use a password of at least 8 characters." };
  if (!displayName) return { error: "Give them a name." };

  try {
    await createUser({ email, password, role, displayName });
  } catch (err) {
    if (isDuplicate(err)) return { error: "There is already an account with that email." };
    throw err;
  }
  revalidatePath("/manage");
  return { ok: `${displayName} can now sign in.` };
}

export async function addCard(_prev: ActionState, form: FormData): Promise<ActionState> {
  await ensureReady();
  const me = await currentUser();
  if (!canManageInventory(me)) return { error: "Sign in as a shopkeeper to add cards." };

  const photo = form.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return { error: "Take a photo first." };
  if (!photo.type.startsWith("image/")) return { error: "That file is not a picture." };
  if (photo.size > 6_000_000) return { error: "That photo is too big." };

  const name = text(form, "name") || "Card";
  const priceCents = parsePrice(String(form.get("price") ?? ""));

  await createCard({ name, priceCents, photo, userId: me!.id, details: readDetails(form) });
  revalidatePath("/");
  revalidatePath("/manage");
  return { ok: `${name} is in the shop.` };
}

export async function editCard(_prev: ActionState, form: FormData): Promise<ActionState> {
  await ensureReady();
  if (!canManageInventory(await currentUser())) return { error: "Not allowed." };
  const id = String(form.get("id") ?? "");
  const name = text(form, "name") || "Card";
  await updateCard(id, {
    name,
    priceCents: parsePrice(String(form.get("price") ?? "")),
    details: readDetails(form),
  });
  revalidatePath("/");
  revalidatePath("/manage");
  revalidatePath(`/card/${id}`);
  return { ok: "Saved." };
}

export async function changeStatus(form: FormData) {
  await ensureReady();
  if (!canManageInventory(await currentUser())) return;
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!["for_sale", "sold", "hidden"].includes(status)) return;
  await setStatus(id, status as "for_sale" | "sold" | "hidden");
  revalidatePath("/");
  revalidatePath("/manage");
}

export async function removeCard(form: FormData) {
  await ensureReady();
  if (!canManageInventory(await currentUser())) return;
  await deleteCard(String(form.get("id") ?? ""));
  revalidatePath("/");
  revalidatePath("/manage");
}

/**
 * A signed-in buyer asking for a card to be kept for them.
 *
 * Any signed-in account can ask — that is the point of a buyer account. No
 * money moves, so there is nothing here to authorise beyond being a real,
 * named person the shopkeeper can reply to.
 */
export async function askToHold(form: FormData) {
  await ensureReady();
  const me = await currentUser();
  const id = String(form.get("id") ?? "");
  if (!me || !id) return;
  await hold(id, me.id);
  revalidatePath(`/card/${id}`);
  revalidatePath("/manage");
}

export async function releaseMyHold(form: FormData) {
  await ensureReady();
  const me = await currentUser();
  const id = String(form.get("id") ?? "");
  if (!me || !id) return;
  // Scoped to the caller's own id, so this can only ever cancel your own ask.
  await releaseHold(id, me.id);
  revalidatePath(`/card/${id}`);
  revalidatePath("/manage");
}

/**
 * Reads a just-taken photo and returns suggested form values.
 *
 * Deliberately non-fatal: any failure returns an empty suggestion so the
 * shopkeeper simply types the card in herself. Adding a card must never
 * depend on the vision pass succeeding.
 */
export async function suggestCard(form: FormData): Promise<SuggestResult> {
  if (!canManageInventory(await currentUser())) return { suggestion: null };
  if (!isVisionConfigured()) return { suggestion: null };

  const photo = form.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return { suggestion: null };
  if (photo.size > 6_000_000) return { suggestion: null };

  try {
    const suggestion = await suggestFromPhoto(photo);
    if (suggestion && !suggestion.isCard) {
      return { suggestion: null, error: "That does not look like a card. You can still name it yourself." };
    }
    return { suggestion };
  } catch {
    return { suggestion: null, error: "Could not read the photo. Type the name yourself." };
  }
}

/**
 * Changes the signed-in user's own password.
 *
 * The current password is required, so a borrowed session cannot be used to
 * lock the real owner out. This is also how the owner moves off the password
 * that OWNER_PASSWORD seeded them with.
 */
export async function changeOwnPassword(_prev: ActionState, form: FormData): Promise<ActionState> {
  await ensureReady();
  const me = await currentUser();
  if (!me) return { error: "Sign in first." };

  const currentPassword = String(form.get("currentPassword") ?? "");
  const newPassword = String(form.get("newPassword") ?? "");
  const confirm = String(form.get("confirmPassword") ?? "");

  if (newPassword.length < 8) return { error: "Use a new password of at least 8 characters." };
  if (newPassword !== confirm) return { error: "The two new passwords do not match." };

  const row = await findUserById(me.id);
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return { error: "That is not your current password." };
  }
  if (await verifyPassword(newPassword, row.password_hash)) {
    return { error: "That is already your password. Pick a different one." };
  }

  await changePassword(me.id, newPassword);
  return { ok: "Password changed. Any other devices have been signed out." };
}
