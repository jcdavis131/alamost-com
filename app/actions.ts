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
import { createCard, deleteCard, parsePrice, setStatus, updateCard } from "../lib/cards-db";
import { isVisionConfigured, suggestFromPhoto } from "../lib/vision";

import type { ActionState, SuggestResult } from "../lib/action-state";
export type { ActionState };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badEmail(email: string) {
  return !EMAIL_RE.test(email) || email.length > 254;
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

  const name = String(form.get("name") ?? "").trim().slice(0, 80) || "Card";
  const priceCents = parsePrice(String(form.get("price") ?? ""));

  await createCard({ name, priceCents, photo, userId: me!.id });
  revalidatePath("/");
  revalidatePath("/manage");
  return { ok: `${name} is in the shop.` };
}

export async function editCard(_prev: ActionState, form: FormData): Promise<ActionState> {
  await ensureReady();
  if (!canManageInventory(await currentUser())) return { error: "Not allowed." };
  const id = String(form.get("id") ?? "");
  const name = String(form.get("name") ?? "").trim().slice(0, 80) || "Card";
  await updateCard(id, { name, priceCents: parsePrice(String(form.get("price") ?? "")) });
  revalidatePath("/");
  revalidatePath("/manage");
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
