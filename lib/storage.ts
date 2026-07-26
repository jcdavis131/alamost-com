import "server-only";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { put, del } from "@vercel/blob";

/**
 * Photo storage.
 *
 * Production uses Vercel Blob. Without a Blob token — local development —
 * photos are written under public/uploads instead, so the whole flow can be
 * exercised without cloud credentials. The local branch is deliberately not
 * used in production: serverless filesystems are ephemeral and per-instance,
 * so a photo written on one invocation would vanish from the next.
 */
export type StoredPhoto = { url: string; key: string };

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

const LOCAL_DIR = path.join(process.cwd(), "public", "uploads");

export async function putPhoto(id: string, photo: Blob): Promise<StoredPhoto> {
  if (useBlob()) {
    // addRandomSuffix keeps two cards photographed a second apart from colliding.
    const stored = await put(`cards/${id}.jpg`, photo, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: true,
    });
    return { url: stored.url, key: stored.url };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Add a Blob store to the project so card photos have somewhere to live.",
    );
  }

  await mkdir(LOCAL_DIR, { recursive: true });
  const name = `${id}.jpg`;
  await writeFile(path.join(LOCAL_DIR, name), Buffer.from(await photo.arrayBuffer()));
  return { url: `/uploads/${name}`, key: `local:${name}` };
}

export async function deletePhoto(key: string) {
  try {
    if (key.startsWith("local:")) {
      await unlink(path.join(LOCAL_DIR, key.slice("local:".length)));
      return;
    }
    if (useBlob()) await del(key);
  } catch {
    // A photo that is already gone is the desired end state.
  }
}
