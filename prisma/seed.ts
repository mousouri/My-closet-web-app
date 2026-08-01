import { db } from "../src/lib/db";
import { images } from "../src/lib/images";

// YOUR CLOSET — seed data
// Curated women's fashion catalogue matching "effortlessly elegant" aesthetic

const SIZES_DRESS = JSON.stringify(["XS", "S", "M", "L", "XL"]);
const SIZES_BASIC = JSON.stringify(["XS", "S", "M", "L"]);
const SIZES_ACC = JSON.stringify(["One Size"]);

const NEUTRALS = JSON.stringify([
  { name: "Blush", hex: "#E8B4BC" },
  { name: "Champagne", hex: "#E8D5C4" },
  { name: "Ivory", hex: "#F5F0E8" },
  { name: "Plum", hex: "#6B1B3C" },
  { name: "Charcoal", hex: "#3A3A3A" },
]);

async function main() {
  console.log("🌱 Seeding YOUR CLOSET...");

  // Clean
  await db.wishlistItem.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.productCollection.deleteMany();
  await db.product.deleteMany();
  await db.collection.deleteMany();
  await db.category.deleteMany();
  await db.address.deleteMany();
  await db.user.deleteMany();

  // Categories
  const categories = await Promise.all([
    db.category.create({ data: { name: "Slip Dresses", slug: "slip-dresses", description: "Liquid silk and satin slips that move with you.", image: images.products.slipDresses[0] } }),
    db.category.create({ data: { name: "Midi & Maxi", slug: "midi-maxi", description: "Floor-skimming silhouettes for day to evening.", image: images.products.midiDresses[0] } }),
    db.category.create({ data: { name: "Evening", slug: "evening", description: "Considered gowns for the occasions that matter.", image: images.products.evening[0] } }),
    db.category.create({ data: { name: "The Basics", slug: "basics", description: "The quietly perfect foundation pieces.", image: images.products.basics[0] } }),
    db.category.create({ data: { name: "Skirts & Trousers", slug: "bottoms", description: "Soft tailoring and fluid bottoms.", image: images.products.bottoms[0] } }),
    db.category.create({ data: { name: "Accessories", slug: "accessories", description: "The finishing touch — bags, scarves, gold.", image: images.products.accessories[0] } }),
  ]);
  const [slipCat, midiCat, eveningCat, basicsCat, bottomsCat, accCat] = categories;

  // Collections
  const collections = await Promise.all([
    db.collection.create({ data: { name: "The Essentials", slug: "the-essentials", description: "Twelve pieces. One quietly perfect wardrobe. Designed to layer, mix, and travel.", image: images.lookbook[0], season: "All Season" } }),
    db.collection.create({ data: { name: "Evening Edit", slug: "evening-edit", description: "Slips, silk, and candlelight. For dinners that run late.", image: images.lookbook[1], season: "AW25" } }),
    db.collection.create({ data: { name: "Resort", slug: "resort", description: "Lighter weights, softer palettes. Made for slow afternoons.", image: images.lookbook[2], season: "SS25" } }),
  ]);
  const [essentialsCol, eveningCol, resortCol] = collections;

  // Helper to build product
  type P = {
    name: string; slug: string; description: string; price: number; compareAt?: number;
    image: string; images: string[]; categoryId: string; collectionIds?: string[];
    sizes?: string; colors?: string; material?: string; care?: string; fit?: string;
    featured?: boolean; newArrival?: boolean; stock?: number;
  };
  async function createProduct(p: P) {
    return db.product.create({
      data: {
        name: p.name, slug: p.slug, description: p.description, price: p.price,
        compareAt: p.compareAt, image: p.image, images: JSON.stringify(p.images),
        categoryId: p.categoryId, sizes: p.sizes ?? SIZES_DRESS, colors: p.colors ?? NEUTRALS,
        material: p.material, care: p.care, fit: p.fit,
        featured: p.featured ?? false, newArrival: p.newArrival ?? false, stock: p.stock ?? 25,
        collections: p.collectionIds?.length
          ? { create: p.collectionIds.map(cid => ({ collectionId: cid })) }
          : undefined,
      },
    });
  }

  // --- SLIP DRESSES ---
  await createProduct({
    name: "The Aurora Silk Slip", slug: "aurora-silk-slip",
    description: "A bias-cut slip dress in 19mm sandwashed silk that drapes like water. Adjustable spaghetti straps, a deep-but-considered V, and a hem that skims the ankle. The piece we built the brand around.",
    price: 285, compareAt: 340, image: images.products.slipDresses[0],
    images: [images.products.slipDresses[0], images.products.slipDresses[1], images.lookbook[0]],
    categoryId: slipCat.id, collectionIds: [essentialsCol.id, eveningCol.id],
    material: "100% Sandwashed Mulberry Silk", care: "Dry clean or hand wash cold, lay flat to dry.",
    fit: "True to size. Model is 5'9\" wearing size S.", featured: true, newArrival: true,
  });
  await createProduct({
    name: "Margaux Satin Midi Slip", slug: "margaux-satin-midi-slip",
    description: "A satin-finish midi with a cowl neckline and delicate lace trim at the straps. Quietly feminine — equally right with strappy sandals or a chunky knit.",
    price: 245, image: images.products.slipDresses[1],
    images: [images.products.slipDresses[1], images.products.slipDresses[2], images.editorial[0]],
    categoryId: slipCat.id, collectionIds: [essentialsCol.id],
    material: "Recycled polyester satin", care: "Machine wash cold on delicate, hang dry.",
    fit: "True to size.", newArrival: true,
  });
  await createProduct({
    name: "Lila Bias-Cut Slip", slug: "lila-bias-cut-slip",
    description: "Ankle-length bias slip in plum charmeuse. The diagonal cut moves with you — made for slow walks and late dinners.",
    price: 265, image: images.products.slipDresses[2],
    images: [images.products.slipDresses[2], images.products.slipDresses[3]],
    categoryId: slipCat.id, collectionIds: [eveningCol.id],
    material: "Silk charmeuse", care: "Dry clean only.", fit: "True to size.",
  });
  await createProduct({
    name: "Noor Strappy Slip", slug: "noor-strappy-slip",
    description: "A shorter, easier slip in ivory. Thin double straps, a straight back, and a hem that hits mid-thigh. Made for layering.",
    price: 195, image: images.products.slipDresses[3],
    images: [images.products.slipDresses[3], images.products.slipDresses[0]],
    categoryId: slipCat.id, collectionIds: [resortCol.id, essentialsCol.id],
    material: "Tencel lyocell", care: "Machine wash cold.", fit: "True to size.", featured: true,
  });

  // --- MIDI & MAXI ---
  await createProduct({
    name: "The Eloise Wrap Midi", slug: "eloise-wrap-midi",
    description: "A wrap-front midi in fluid crepe. Ties at the waist, falls to a soft A-line. The dress you reach for when you don't know what to wear.",
    price: 295, image: images.products.midiDresses[0],
    images: [images.products.midiDresses[0], images.products.midiDresses[1], images.lookbook[2]],
    categoryId: midiCat.id, collectionIds: [essentialsCol.id, resortCol.id],
    material: "Viscose crepe", care: "Dry clean recommended.", fit: "True to size.",
    featured: true, newArrival: true,
  });
  await createProduct({
    name: "Sloane Pleated Maxi", slug: "sloane-pleated-maxi",
    description: "A high-neck, sleeveless maxi with knife pleats from waist to floor. Champagne tones that catch the light. Quietly dramatic.",
    price: 320, image: images.products.midiDresses[1],
    images: [images.products.midiDresses[1], images.products.midiDresses[2]],
    categoryId: midiCat.id, collectionIds: [eveningCol.id],
    material: "Recycled polyester pleat", care: "Machine wash cold, hang dry.", fit: "True to size.",
  });
  await createProduct({
    name: "Cecile Shirt Dress", slug: "cecile-shirt-dress",
    description: "A midi shirt dress in washed cotton-poplin. Mother-of-pearl buttons, a self-tie belt, side pockets. For mornings that turn into afternoons.",
    price: 215, image: images.products.midiDresses[2],
    images: [images.products.midiDresses[2], images.products.midiDresses[3]],
    categoryId: midiCat.id, collectionIds: [resortCol.id, essentialsCol.id],
    material: "Organic cotton poplin", care: "Machine wash cold.", fit: "True to size.", newArrival: true,
  });
  await createProduct({
    name: "Romy Fluid Maxi", slug: "romy-fluid-maxi",
    description: "A sleeveless maxi with a gathered waist and a skirt that moves. Designed for warm evenings and bare feet.",
    price: 275, image: images.products.midiDresses[3],
    images: [images.products.midiDresses[3], images.products.midiDresses[0]],
    categoryId: midiCat.id, collectionIds: [resortCol.id],
    material: "Tencel lyocell", care: "Machine wash cold.", fit: "True to size.",
  });

  // --- EVENING ---
  await createProduct({
    name: "The Vivienne Gown", slug: "vivienne-gown",
    description: "A floor-length gown in deep plum silk with a draped cowl back and a thigh-high slit. The piece for the occasions you'll remember.",
    price: 480, image: images.products.evening[0],
    images: [images.products.evening[0], images.products.evening[1], images.editorial[1]],
    categoryId: eveningCat.id, collectionIds: [eveningCol.id],
    material: "Silk jersey", care: "Dry clean only.", fit: "True to size.",
    featured: true, stock: 12,
  });
  await createProduct({
    name: "Audrey Column Dress", slug: "audrey-column-dress",
    description: "A slim column dress in ivory crepe with a sculpted neckline. Restrained, architectural, and quietly confident.",
    price: 395, image: images.products.evening[1],
    images: [images.products.evening[1], images.products.evening[2]],
    categoryId: eveningCat.id, collectionIds: [eveningCol.id],
    material: "Wool-blend crepe", care: "Dry clean only.", fit: "True to size.",
  });
  await createProduct({
    name: "Isolde Sequin Slip", slug: "isolde-sequin-slip",
    description: "A sequined slip dress in champagne. Cut on the bias, fully lined, with a low back. Catches every light in the room.",
    price: 420, compareAt: 510, image: images.products.evening[2],
    images: [images.products.evening[2], images.products.evening[0]],
    categoryId: eveningCat.id, collectionIds: [eveningCol.id],
    material: "Sequined mesh, silk lining", care: "Dry clean only.", fit: "True to size.",
  });

  // --- BASICS ---
  await createProduct({
    name: "The Silk Camisole", slug: "silk-camisole",
    description: "A 19mm silk cami with a slight cowl and adjustable straps. Tuck it into trousers, layer it under blazers. The most-worn piece in your closet.",
    price: 125, image: images.products.basics[0],
    images: [images.products.basics[0], images.products.basics[1]],
    categoryId: basicsCat.id, collectionIds: [essentialsCol.id],
    sizes: SIZES_BASIC, material: "100% Mulberry silk", care: "Hand wash cold.", fit: "True to size.",
    featured: true, newArrival: true,
  });
  await createProduct({
    name: "Margot Cotton Shirt", slug: "margot-cotton-shirt",
    description: "An oversized poplin shirt in optic white. Dropped shoulder, mother-of-pearl buttons, a longer back hem. Borrowed-from-him, made for you.",
    price: 145, image: images.products.basics[1],
    images: [images.products.basics[1], images.products.basics[2]],
    categoryId: basicsCat.id, collectionIds: [essentialsCol.id],
    sizes: SIZES_BASIC, material: "Organic cotton poplin", care: "Machine wash cold.", fit: "Oversized.",
  });
  await createProduct({
    name: "The Cashmere Knit", slug: "cashmere-knit",
    description: "A crew-neck cashmere knit in a relaxed fit. Ribbed cuffs, a slightly cropped length. The definition of effortless.",
    price: 195, image: images.products.basics[2],
    images: [images.products.basics[2], images.products.basics[3]],
    categoryId: basicsCat.id, collectionIds: [essentialsCol.id],
    sizes: SIZES_BASIC, material: "100% Grade-A Mongolian cashmere", care: "Hand wash cold or dry clean.", fit: "Relaxed.",
    featured: true,
  });
  await createProduct({
    name: "Talia Ribbed Top", slug: "talia-ribbed-top",
    description: "A fine ribbed top with a square neckline. Form-skimming but not tight. Layering made simple.",
    price: 85, image: images.products.basics[3],
    images: [images.products.basics[3], images.products.basics[0]],
    categoryId: basicsCat.id, collectionIds: [essentialsCol.id, resortCol.id],
    sizes: SIZES_BASIC, material: "Organic cotton rib", care: "Machine wash cold.", fit: "True to size.", newArrival: true,
  });

  // --- BOTTOMS ---
  await createProduct({
    name: "The Pleated Midi Skirt", slug: "pleated-midi-skirt",
    description: "A knife-pleated midi skirt in champagne with an elasticated waist. Moves beautifully, layers easily.",
    price: 165, image: images.products.bottoms[0],
    images: [images.products.bottoms[0], images.products.bottoms[1]],
    categoryId: bottomsCat.id, collectionIds: [essentialsCol.id, resortCol.id],
    sizes: SIZES_BASIC, material: "Recycled polyester pleat", care: "Machine wash cold.", fit: "True to size.",
    newArrival: true,
  });
  await createProduct({
    name: "Wide-Leg Trouser", slug: "wide-leg-trouser",
    description: "High-waisted wide-leg trousers in fluid crepe. A clean front, a long leg. Tailoring, softened.",
    price: 185, image: images.products.bottoms[1],
    images: [images.products.bottoms[1], images.products.bottoms[2]],
    categoryId: bottomsCat.id, collectionIds: [essentialsCol.id],
    sizes: SIZES_BASIC, material: "Viscose crepe", care: "Dry clean recommended.", fit: "True to size.",
  });
  await createProduct({
    name: "Linen-Blend Midi Skirt", slug: "linen-blend-midi-skirt",
    description: "A bias-cut midi skirt in a linen-cotton blend. Easy, warm-weather, and made for bare legs.",
    price: 145, image: images.products.bottoms[2],
    images: [images.products.bottoms[2], images.products.bottoms[0]],
    categoryId: bottomsCat.id, collectionIds: [resortCol.id],
    sizes: SIZES_BASIC, material: "55% Linen, 45% Cotton", care: "Machine wash cold.", fit: "True to size.",
  });

  // --- ACCESSORIES ---
  await createProduct({
    name: "The Soft Leather Tote", slug: "soft-leather-tote",
    description: "An unstructured leather tote in cognac. Roomy enough for everything, soft enough to fold under your arm. Ages beautifully.",
    price: 245, image: images.products.accessories[0],
    images: [images.products.accessories[0], images.products.accessories[1]],
    categoryId: accCat.id, sizes: SIZES_ACC, material: "Full-grain Italian leather", care: "Wipe with a dry cloth.", fit: undefined,
    featured: true,
  });
  await createProduct({
    name: "Silk Twill Scarf", slug: "silk-twill-scarf",
    description: "A 90cm silk twill scarf in a hand-illustrated floral. Wear it at the neck, in the hair, on a bag handle.",
    price: 95, image: images.products.accessories[1],
    images: [images.products.accessories[1], images.products.accessories[2]],
    categoryId: accCat.id, sizes: SIZES_ACC, material: "100% silk twill", care: "Dry clean only.", newArrival: true,
  });
  await createProduct({
    name: "Gold Vermeil Hoops", slug: "gold-vermeil-hoops",
    description: "Medium thick gold-vermeil hoops. The pair you never take off.",
    price: 120, image: images.products.accessories[2],
    images: [images.products.accessories[2], images.products.accessories[0]],
    categoryId: accCat.id, sizes: SIZES_ACC, material: "18k gold vermeil over sterling silver", care: "Keep dry, store in pouch.",
  });

  // Reviews
  const allProducts = await db.product.findMany();
  const reviewSeeds = [
    { slug: "aurora-silk-slip", authorName: "Sophie L.", rating: 5, title: "My new uniform", body: "I've worn this three times this week. The silk is heavy in the best way and the bias cut is genuinely flattering. Worth every penny." },
    { slug: "aurora-silk-slip", authorName: "Mira K.", rating: 5, title: "Evening perfection", body: "Wore it to a gallery opening and got stopped twice. The plum is richer in person." },
    { slug: "eloise-wrap-midi", authorName: "Charlotte W.", rating: 5, title: "The wrap is perfect", body: "I was worried about the wrap opening but it stays put. Drapes beautifully." },
    { slug: "silk-camisole", authorName: "Elena R.", rating: 4, title: "Lovely silk", body: "Great weight, true to size. Wish it came in more colors." },
    { slug: "cashmere-knit", authorName: "Priya M.", rating: 5, title: "Incredible softness", body: "Not itchy at all, holds its shape after washing. The cropped length is perfect with high-waisted trousers." },
    { slug: "vivienne-gown", authorName: "Annabel T.", rating: 5, title: "Wedding-ready", body: "Wore this as the mother of the bride. Felt like myself and got endless compliments." },
    { slug: "soft-leather-tote", authorName: "Joanna B.", rating: 5, title: "Everyday hero", body: "Fits my laptop, water bottle, and a change of shoes without looking stuffed. Leather is buttery." },
    { slug: "pleated-midi-skirt", authorName: "Ines D.", rating: 4, title: "Beautiful movement", body: "The pleats are crisp and the waist is comfortable. Runs slightly large." },
  ];
  for (const r of reviewSeeds) {
    const product = allProducts.find(p => p.slug === r.slug);
    if (!product) continue;
    await db.review.create({
      data: {
        productId: product.id, authorName: r.authorName, rating: r.rating,
        title: r.title, body: r.body, verified: true,
      },
    });
  }

  // Recalculate ratings
  for (const p of allProducts) {
    const reviews = await db.review.findMany({ where: { productId: p.id } });
    if (reviews.length) {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      await db.product.update({ where: { id: p.id }, data: { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length } });
    }
  }

  // Demo admin + customer
  await db.user.create({
    data: {
      email: "hello@yourcloset.com", name: "Your Closet", role: "admin",
      password: "$2a$10$placeholder",
    },
  });

  console.log("✅ Seeded complete.");
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Collections: ${collections.length}`);
  console.log(`   Products: ${allProducts.length}`);
  const reviews = await db.review.count();
  console.log(`   Reviews: ${reviews}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
