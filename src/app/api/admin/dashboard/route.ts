import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const [
    productCount,
    activeProductCount,
    orderCount,
    customerCount,
    revenue,
    lowStock,
    recentOrders,
  ] = await Promise.all([
    db.product.count(),
    db.product.count({ where: { status: "active" } }),
    db.order.count(),
    db.user.count({ where: { role: "customer" } }),
    db.order.aggregate({
      where: { status: { not: "cancelled" } },
      _sum: { total: true },
    }),
    db.product.findMany({
      where: { stock: { lte: 5 }, status: { not: "archived" } },
      orderBy: { stock: "asc" },
      take: 8,
      select: { id: true, name: true, slug: true, stock: true, status: true },
    }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
  ]);

  return NextResponse.json({
    stats: {
      productCount,
      activeProductCount,
      orderCount,
      customerCount,
      revenue: revenue._sum.total ?? 0,
    },
    lowStock,
    recentOrders,
  });
}
