import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/orders — create an order from the cart payload
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, email, shipping, subtotal, shippingCost, tax, discount, total } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!email || !shipping?.fullName || !shipping?.line1 || !shipping?.city) {
      return NextResponse.json({ error: "Missing shipping details" }, { status: 400 });
    }

    const number = `YC-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;

    const order = await db.order.create({
      data: {
        number,
        email,
        status: "paid",
        total: Number(total),
        subtotal: Number(subtotal),
        shipping: Number(shippingCost ?? 0),
        tax: Number(tax ?? 0),
        discount: Number(discount ?? 0),
        shippingName: shipping.fullName,
        shippingLine1: shipping.line1,
        shippingLine2: shipping.line2 ?? null,
        shippingCity: shipping.city,
        shippingState: shipping.state ?? null,
        shippingPostal: shipping.postalCode,
        shippingCountry: shipping.country ?? "United States",
        items: {
          create: items.map((it: Record<string, unknown>) => ({
            productId: String(it.productId),
            name: String(it.name),
            slug: String(it.slug),
            image: String(it.image),
            price: Number(it.price),
            quantity: Number(it.quantity),
            size: it.size ? String(it.size) : null,
            color: it.color ? String(it.color) : null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET /api/orders?email=... — fetch order history by email
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const number = searchParams.get("number");
  if (number) {
    const order = await db.order.findUnique({
      where: { number },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  }
  if (!email) return NextResponse.json({ orders: [] });
  const orders = await db.order.findMany({
    where: { email: { contains: email } },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json({ orders });
}
