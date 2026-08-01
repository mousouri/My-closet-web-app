import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

type ProductPayload = {
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

function colors(value: ProductPayload["colors"]) {
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

function productData(body: ProductPayload) {
  const image = body.image?.trim() || "/logo.svg";
  return {
    name: String(body.name ?? "").trim(),
    slug: String(body.slug ?? "").trim(),
    description: String(body.description ?? "").trim(),
    price: Number(body.price ?? 0),
    compareAt: body.compareAt ? Number(body.compareAt) : null,
    image,
    images: JSON.stringify(csv(body.images, [image])),
    categoryId: String(body.categoryId ?? ""),
    sizes: JSON.stringify(csv(body.sizes, ["S", "M", "L"])),
    colors: JSON.stringify(colors(body.colors)),
    material: body.material || null,
    care: body.care || null,
    fit: body.fit || null,
    stock: Number(body.stock ?? 0),
    featured: Boolean(body.featured),
    newArrival: Boolean(body.newArrival),
    status: body.status || "draft",
  };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const products = await db.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      collections: { include: { collection: true } },
    },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = (await req.json()) as ProductPayload;
    const data = productData(body);

    if (!data.name || !data.slug || !data.description || !data.categoryId) {
      return NextResponse.json({ error: "Name, slug, description, and category are required." }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        ...data,
        collections: body.collectionIds?.length
          ? { create: body.collectionIds.map((collectionId) => ({ collectionId })) }
          : undefined,
      },
      include: { category: true, collections: { include: { collection: true } } },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
