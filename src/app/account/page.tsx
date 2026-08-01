"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/format";
import { User, Package, LogOut, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type Order = {
  id: string;
  number: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; name: string; image: string; quantity: number; price: number; size?: string | null; color?: string | null }[];
};

export default function AccountPage() {
  const [email, setEmail] = React.useState("");
  const [signedIn, setSignedIn] = React.useState(false);
  const [lookupEmail, setLookupEmail] = React.useState("");

  React.useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("yc-user") : null;
    if (saved) {
      setEmail(saved);
      setSignedIn(true);
      setLookupEmail(saved);
    }
  }, []);

  const { data: orders } = useQuery({
    queryKey: ["orders", lookupEmail],
    enabled: !!lookupEmail,
    queryFn: async () => {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(lookupEmail)}`);
      const data = await res.json();
      return data.orders as Order[];
    },
  });

  const onSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    localStorage.setItem("yc-user", email);
    setSignedIn(true);
    setLookupEmail(email);
    toast.success(`Welcome back`);
  };

  const onSignOut = () => {
    localStorage.removeItem("yc-user");
    setSignedIn(false);
    setLookupEmail("");
    toast("Signed out");
  };

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-4 font-serif text-3xl">Welcome</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to track orders and manage your closet.</p>
        </div>
        <Tabs defaultValue="signin" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="register">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-6">
            <form onSubmit={onSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required className="mt-1.5" />
              </div>
              <Button type="submit" className="w-full">Sign in</Button>
              <p className="text-center text-xs text-muted-foreground">
                Demo only — no real credentials required. Use any email.
              </p>
            </form>
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <form onSubmit={onSignIn} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="remail">Email</Label>
                <Input id="remail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="rpassword">Password</Label>
                <Input id="rpassword" type="password" required className="mt-1.5" />
              </div>
              <Button type="submit" className="w-full">Create account</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Account</p>
          <h1 className="mt-2 font-serif text-4xl">Hello{email ? `, ${email.split("@")[0]}` : ""}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-sm border border-border/60 p-6">
          <User className="h-5 w-5 text-primary" />
          <p className="mt-3 font-serif text-lg">Profile</p>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          <Link href="/closet" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
            My wishlist <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="rounded-sm border border-border/60 p-6 md:col-span-2">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <p className="font-serif text-lg">Order history</p>
          </div>
          {!orders ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">No orders yet.</p>
              <Button asChild className="mt-3" size="sm">
                <Link href="/shop">Start shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border/60">
              {orders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-medium">{o.number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {o.items.length} item{o.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize text-primary">{o.status}</span>
                    <span className="text-sm font-medium">{formatPrice(o.total)}</span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/order/success?number=${o.number}`}>View</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
