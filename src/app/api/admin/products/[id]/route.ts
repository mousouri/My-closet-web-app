import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import type { Prisma } from "@prisma/client";

type ProductPatch = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number | string;
  compareAt?: number | string | null;
  image?: string;
  images?: string[] | string;
  categoryId?: string;
  collectionIds?: string[];
  sizes?: string[] | string;
  colors?: { name: string; hex: string }[] | string;
  material?: string | null;
  care?: string | null;
  fit?: string | null;
  stock?: number | string;
  featured?: boolean;
  newArrival?: boolean;
  status?: string;
};

function csv(value: string | string[] | undefined, fallback: string[]) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return fallback;
  return value.split(",").map((x) => x.trim()).filter(Boolean);
}

function colors(value: ProductPatch["colors"]) {
  if (Array.isArray(value)) return value;
  if (!value) return [{ name: "Black", hex: "#000000" }];
  return value
    .split(",")
    .map((part) => {
      const [name, hex] = part.split(":").map((x) => x.trim());
      return { name, hex: hex || "#000000" };
    })
    .filter((x) => x.name);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = (await req.json()) as ProductPatch;
    const image = body.image?.trim();
    const data: Prisma.ProductUpdateInput = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.compareAt !== undefined) data.compareAt = body.compareAt ? Number(body.compareAt) : null;
    if (image !== undefined) data.image = image || "/logo.svg";
    if (body.images !== undefined) data.images = JSON.stringify(csv(body.images, [image || "/logo.svg"]));
    if (body.categoryId !== undefined) data.category = { connect: { id: body.categoryId } };
    if (body.sizes !== undefined) data.sizes = JSON.stringify(csv(body.sizes, ["S", "M", "L"]));
    if (body.colors !== undefined) data.colors = JSON.stringify(colors(body.colors));
    if (body.material !== undefined) data.material = body.material;
    if (body.care !== undefined) data.care = body.care;
    if (body.fit !== undefined) data.fit = body.fit;
    if (body.stock !== undefined) data.stock = Number(body.stock);
    if (body.featured !== undefined) data.featured = body.featured;
    if (body.newArrival !== undefined) data.newArrival = body.newArrival;
    if (body.status !== undefined) data.status = body.status;
    if (body.collectionIds) {
      data.collections = {
        deleteMany: {},
        create: body.collectionIds.map((collectionId) => ({ collectionId })),
      };
    }

    const product = await db.product.update({
      where: { id },
      data,
      include: { category: true, collections: { include: { collection: true } } },
    });

    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
