// Single-password admin login, kept in an httpOnly cookie.
// Set ADMIN_PASSWORD in Vercel → Project → Settings → Environment Variables.

import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";

const COOKIE = "invite_admin";

const sessionToken = () => createHmac("sha256", process.env.ADMIN_PASSWORD).update("invite-admin-session").digest("hex");

const sameText = (a, b) => {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
};

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value) && sameText(value, sessionToken());
}

export async function signIn(password) {
  if (!adminConfigured() || !sameText(password, process.env.ADMIN_PASSWORD)) return false;
  (await cookies()).set(COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}
