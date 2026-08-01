"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, cartSubtotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";

export function CartSheet() {
  const isOpen = useCart((s) => s.isOpen);
  const setOpen = useCart((s) => s.setOpen);
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const subtotal = cartSubtotal(items);
  const freeShippingThreshold = 150;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base font-medium tracking-wide">
            <ShoppingBag className="h-4 w-4" /> Your Bag ({items.reduce((n, i) => n + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="rounded-full bg-secondary p-4">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif text-xl">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Find something effortlessly elegant.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border/60 bg-secondary/40 px-5 py-3">
              {remaining > 0 ? (
                <p className="text-xs text-muted-foreground">
                  You&apos;re <span className="font-medium text-primary">{formatPrice(remaining)}</span> away from complimentary shipping.
                </p>
              ) : (
                <p className="text-xs font-medium text-primary">
                  ✦ You&apos;ve unlocked complimentary shipping.
                </p>
              )}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="sc-elegant flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-3">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm font-medium leading-snug hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => remove(item.id, item.size, item.color)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-primary"
                            onClick={() => updateQty(item.id, item.size, item.color, item.quantity - 1)}
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                          <button
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-primary"
                            onClick={() => updateQty(item.id, item.size, item.color, item.quantity + 1)}
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/60 px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
              <Separator className="my-3" />
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/cart">View bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
