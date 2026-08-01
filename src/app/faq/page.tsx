"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const FAQ = [
  {
    category: "Shipping",
    items: [
      { q: "How long does shipping take?", a: "Standard delivery is 3–5 business days within the US and EU. Express delivery (1–2 business days) is available at checkout for an additional fee. International orders may take 5–10 business days depending on destination." },
      { q: "Do you offer complimentary shipping?", a: "Yes — complimentary standard shipping is included on all orders over $150. Orders below that threshold are charged a flat $8 for standard delivery." },
      { q: "Do you ship internationally?", a: "We ship to over 40 countries worldwide. Duties and taxes are calculated at checkout for most destinations, so there are no surprises on delivery." },
      { q: "Can I track my order?", a: "Absolutely. You'll receive a shipping confirmation email with a tracking link as soon as your order leaves our atelier. Orders typically ship within 1–2 business days." },
    ],
  },
  {
    category: "Returns & exchanges",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 30 days of delivery, on us. Items must be unworn, unwashed, with tags attached. Returns are refunded to your original payment method within 5–7 business days of receipt." },
      { q: "How do I start a return?", a: "Head to your account, find the order, and click 'Start a return'. You'll receive a prepaid return label by email. Drop it at any carrier — no box hunting required." },
      { q: "Can I exchange for a different size?", a: "Yes. Start an exchange from your order page and we'll hold the new size for you while your return is in transit. Exchanges ship free." },
      { q: "Are sale items returnable?", a: "Items marked Final Sale (over 40% off) are not eligible for return or exchange. All other sale items follow our standard 30-day policy." },
    ],
  },
  {
    category: "Sizing & fit",
    items: [
      { q: "How do I find my size?", a: "Each product page has a size guide with measurements in inches and centimeters. If you're between sizes, we recommend sizing up for slips and sizing down for oversized pieces. You can also chat with our styling team for a personal recommendation." },
      { q: "Do your clothes run true to size?", a: "Most pieces are true to size, with the fit noted on each product page (relaxed, oversized, or fitted). Model measurements are listed in the product description for reference." },
      { q: "Can I get alterations?", a: "We offer complimentary hemming on all full-price dresses and trousers. Contact customer care after placing your order to arrange it." },
    ],
  },
  {
    category: "Product & care",
    items: [
      { q: "What fabrics do you use?", a: "We work primarily with natural fibres: mulberry silk, cashmere, organic cotton, linen, and wool. Some pieces include recycled polyester for structure (pleating, linings). Full fibre content is listed on each product page." },
      { q: "How should I care for my pieces?", a: "Care instructions are on each product page and sewn into every garment. Most silks are dry-clean only; cottons and knits can be hand-washed cold. We recommend storing slips on padded hangers and knits folded." },
      { q: "Do you offer repairs?", a: "Yes — we offer complimentary repairs for the lifetime of your piece, including re-stitching, button replacement, and minor seam repairs. Contact us to arrange it." },
    ],
  },
  {
    category: "Account & orders",
    items: [
      { q: "Do I need an account to order?", a: "No — you can check out as a guest. But creating an account lets you track orders, save your closet, and earn rewards on every purchase." },
      { q: "How do I find my order number?", a: "Your order number (e.g. YC-XXXX-123) is in your confirmation email and on your account page. Have it ready when contacting us about an order." },
      { q: "Can I change or cancel my order?", a: "We can change or cancel an order within 2 hours of placement. Contact us immediately at hello@yourcloset.com with your order number." },
    ],
  },
];

export default function FAQPage() {
  const [query, setQuery] = React.useState("");
  const filtered = React.useMemo(() => {
    if (!query.trim()) return FAQ;
    const q = query.toLowerCase();
    return FAQ.map((g) => ({
      ...g,
      items: g.items.filter(
        (it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
      ),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Help centre</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Shipping & Returns</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Everything you need to know about shipping, returns, sizing and care. Can&apos;t find an
          answer? <a href="/contact" className="text-primary hover:underline">Get in touch</a>.
        </p>
      </div>

      <div className="relative mt-8">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an answer…"
          className="rounded-full pl-11"
        />
      </div>

      <div className="mt-10 space-y-10">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No results for &ldquo;{query}&rdquo;. Try a different search.
          </p>
        ) : (
          filtered.map((group) => (
            <section key={group.category}>
              <h2 className="mb-3 font-serif text-2xl">{group.category}</h2>
              <Accordion type="single" collapsible className="rounded-sm border border-border/60 bg-background">
                {group.items.map((item, i) => (
                  <AccordionItem key={i} value={`${group.category}-${i}`} className="border-b border-border/60 last:border-b-0">
                    <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-sm text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))
        )}
      </div>

      <div className="mt-16 rounded-sm bg-secondary/40 p-8 text-center">
        <h3 className="font-serif text-2xl">Still need help?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our customer care team replies within 24 hours, Monday to Friday.
        </p>
        <Button asChild className="mt-5 rounded-full">
          <a href="/contact">Contact us</a>
        </Button>
      </div>
    </div>
  );
}
