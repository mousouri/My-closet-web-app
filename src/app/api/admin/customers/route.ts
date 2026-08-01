import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [users, orders] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true, wishlistItems: true, reviews: true } } },
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        email: true,
        shippingName: true,
        shippingCity: true,
        shippingCountry: true,
        total: true,
        createdAt: true,
      },
    }),
  ]);

  const guests = new Map<string, {
    email: string;
    name: string;
    city: string;
    country: string;
    orderCount: number;
    totalSpent: number;
    lastOrderAt: Date;
  }>();

  for (const order of orders) {
    const existing = guests.get(order.email);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.total;
      if (order.createdAt > existing.lastOrderAt) existing.lastOrderAt = order.createdAt;
      continue;
    }
    guests.set(order.email, {
      email: order.email,
      name: order.shippingName,
      city: order.shippingCity,
      country: order.shippingCountry,
      orderCount: 1,
      totalSpent: order.total,
      lastOrderAt: order.createdAt,
    });
  }

  return NextResponse.json({
    customers: [
      ...users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name ?? "Customer",
        role: user.role,
        source: "account",
        orderCount: user._count.orders,
        wishlistCount: user._count.wishlistItems,
        reviewCount: user._count.reviews,
        totalSpent: 0,
        lastOrderAt: user.createdAt,
      })),
      ...Array.from(guests.values()).map((guest) => ({
        ...guest,
        id: `guest-${guest.email}`,
        role: "customer",
        source: "order",
        wishlistCount: 0,
        reviewCount: 0,
      })),
    ],
  });
}
