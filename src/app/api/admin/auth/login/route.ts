import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_EMAIL,
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (email !== ADMIN_EMAIL || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createAdminSessionToken(), adminCookieOptions());
  return res;
}
