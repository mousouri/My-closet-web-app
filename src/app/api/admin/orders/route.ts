import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
  });

  return NextResponse.json({ orders });
}
