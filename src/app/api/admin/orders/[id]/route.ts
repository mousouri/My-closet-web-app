import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await req.json();
    const paidAt = body.paymentStatus === "paid" ? new Date() : body.paymentStatus ? null : undefined;

    const order = await db.order.update({
      where: { id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        paymentProvider: body.paymentProvider,
        paymentReference: body.paymentReference,
        paidAt,
      },
      include: { items: true, user: true },
    });

    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
