import { NextRequest, NextResponse } from "next/server";

// POST /api/newsletter — simple in-memory subscribe (no DB model needed)
const subscribers = new Set<string>();

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  subscribers.add(email.toLowerCase());
  return NextResponse.json({ ok: true, count: subscribers.size });
}
