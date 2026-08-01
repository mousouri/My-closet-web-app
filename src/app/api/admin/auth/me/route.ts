import { NextResponse } from "next/server";
import { ADMIN_EMAIL, isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({
    authenticated,
    admin: authenticated ? { email: ADMIN_EMAIL } : null,
  });
}
