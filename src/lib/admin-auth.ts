import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_EMAIL = "hello@yourcloset.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin@2026";
export const ADMIN_COOKIE = "yc_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? "your-closet-local-admin-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function verifyAdminPassword(password: string) {
  const expected = Buffer.from(ADMIN_PASSWORD);
  const received = Buffer.from(password);
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export function createAdminSessionToken() {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${ADMIN_EMAIL}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [local, domain, expiresAt, signature] = parts;
  const payload = `${local}.${domain}.${expiresAt}`;
  if (Number(expiresAt) < Date.now()) return false;

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  if (await isAdminAuthenticated()) return null;
  return Response.json({ error: "Admin login required" }, { status: 401 });
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
