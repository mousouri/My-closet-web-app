"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, cartSubtotal } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const [promo, setPromo] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState<{ code: string; percent: number } | null>(null);

  const subtotal = cartSubtotal(items);
  const discount = appliedPromo ? subtotal * (appliedPromo.percent / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= 150 || afterDiscount === 0 ? 0 : 8;
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (code === "WELCOME10") {
      setAppliedPromo({ code, percent: 10 });
      toast.success("10% off applied — welcome to YOUR CLOSET");
    } else if (code === "ELEGANT15") {
      setAppliedPromo({ code, percent: 15 });
      toast.success("15% off applied");
    } else {
      toast.error("That code isn't valid");
    }
    setPromo("");
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <div className="rounded-full bg-secondary p-6">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-5 font-serif text-3xl">Your bag is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Once you add a piece, it&apos;ll show up here.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/shop">Start shopping <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Your bag</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {items.map((item) => (
              <li key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-4 py-5">
                <Link href={`/product/${item.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-muted">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link href={`/product/${item.slug}`} className="font-medium hover:text-primary">{item.name}</Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[item.size && `Size ${item.size}`, item.color].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-border">
                      <button className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-primary" onClick={() => updateQty(item.id, item.size, item.color, item.quantity - 1)} aria-label="Decrease">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                      <button className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-primary" onClick={() => updateQty(item.id, item.size, item.color, item.quantity + 1)} aria-label="Increase">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button onClick={() => remove(item.id, item.size, item.color)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 rounded-sm border border-border/60 bg-background p-6">
            <h2 className="font-serif text-xl">Order summary</h2>

            <div className="mt-4 flex gap-2">
              <Input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Promo code"
                className="text-sm"
              />
              <Button variant="outline" size="sm" onClick={applyPromo}>Apply</Button>
            </div>
            {appliedPromo && (
              <div className="mt-2 flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5">
                <p className="text-xs text-primary">
                  ✓ {appliedPromo.code} applied — {appliedPromo.percent}% off
                </p>
                <button
                  onClick={() => setAppliedPromo(null)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  aria-label="Remove promo code"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground">Try WELCOME10 or ELEGANT15</p>

            <Separator className="my-4" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <dt>Discount</dt>
                  <dd>−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estimated tax</dt>
                <dd>{formatPrice(tax)}</dd>
              </div>
            </dl>
            <Separator className="my-4" />
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button asChild className="mt-5 w-full rounded-full" size="lg">
              <Link href="/checkout">Checkout <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Secure checkout · Encrypted payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
