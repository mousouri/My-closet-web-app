import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { DressMark } from "@/components/brand-logo";
import { Check, Package, Mail, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getOrder(number: string) {
  return db.order.findUnique({
    where: { number },
    include: { items: true },
  });
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ number?: string }>;
}) {
  const { number } = await searchParams;
  if (!number) notFound();
  const order = await getOrder(number);
  if (!order) notFound();

  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  const fmt = estimatedDelivery.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <Check className="h-8 w-8 text-primary" />
        </div>
        <DressMark className="mx-auto mt-6 h-8 w-8 text-primary" />
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Thank you</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Your order is confirmed</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Order <span className="font-medium text-foreground">{order.number}</span> · A confirmation has been sent to {order.email}
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-border/60 p-5 text-center">
          <Package className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Estimated delivery</p>
          <p className="mt-1 text-sm font-medium">{fmt}</p>
        </div>
        <div className="rounded-sm border border-border/60 p-5 text-center">
          <Mail className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Confirmation</p>
          <p className="mt-1 text-sm font-medium">Sent to {order.email}</p>
        </div>
        <div className="rounded-sm border border-border/60 p-5 text-center">
          <DressMark className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Order total</p>
          <p className="mt-1 text-sm font-medium">{formatPrice(order.total)}</p>
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-border/60">
        <div className="border-b border-border/60 px-6 py-4">
          <h2 className="font-serif text-xl">Order details</h2>
        </div>
        <ul className="divide-y divide-border/60">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[item.size && `Size ${item.size}`, item.color, `Qty ${item.quantity}`].filter(Boolean).join(" · ")}
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-border/60 px-6 py-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{order.shipping === 0 ? "Complimentary" : formatPrice(order.shipping)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(order.tax)}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-primary"><span>Discount</span><span>−{formatPrice(order.discount)}</span></div>
          )}
          <div className="flex justify-between border-t border-border/60 pt-2 text-base font-medium">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-sm border border-border/60 p-6">
        <h3 className="font-serif text-lg">Shipping to</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {order.shippingName}<br />
          {order.shippingLine1}{order.shippingLine2 ? <><br />{order.shippingLine2}</> : null}<br />
          {order.shippingCity}{order.shippingState ? `, ${order.shippingState}` : null} {order.shippingPostal}<br />
          {order.shippingCountry}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link href="/shop">Continue shopping <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/account">View order history</Link>
        </Button>
      </div>
    </div>
  );
}
