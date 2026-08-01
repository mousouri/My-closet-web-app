"use client";

import * as React from "react";
import Link from "next/link";
import { BrandLogo, DressMark } from "@/components/brand-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const FOOTER = [
  {
    title: "Shop",
    links: [
      { label: "Slip Dresses", href: "/shop?category=slip-dresses" },
      { label: "Midi & Maxi", href: "/shop?category=midi-maxi" },
      { label: "Evening", href: "/shop?category=evening" },
      { label: "The Basics", href: "/shop?category=basics" },
      { label: "Accessories", href: "/shop?category=accessories" },
    ],
  },
  {
    title: "Closet",
    links: [
      { label: "Collections", href: "/collections" },
      { label: "My Wishlist", href: "/closet" },
      { label: "Account", href: "/account" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "House",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Shipping & Returns", href: "/faq" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.993 3.995-.282 1.193.599 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.084.345-.091.375-.293 1.199-.334 1.363-.053.225-.177.271-.407.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.79a4.84 4.84 0 01-1-.1z" />
    </svg>
  );
}

export function SiteFooter() {
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setPending(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubscribed(true);
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      {/* Newsletter */}
      <div className="border-b border-border/60">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="font-serif text-2xl text-primary">Join the list</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Early access to new pieces, private edits, and 10% off your first order.
            </p>
          </div>
          {subscribed ? (
            <div className="flex w-full max-w-md items-center gap-3 md:ml-auto">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-medium">You&apos;re in! Check your inbox for 10% off.</p>
            </div>
          ) : (
            <form onSubmit={onSubscribe} className="flex w-full max-w-md gap-2 md:ml-auto">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-background"
                aria-label="Email address"
              />
              <Button type="submit" disabled={pending}>
                {pending ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <BrandLogo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Curated women&apos;s fashion. Silk slips, considered evening wear, and quietly
            perfect basics — designed to be lived in.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Pinterest"
            >
              <PinterestIcon />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
            <a
              href="mailto:hello@yourcloset.com"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        {FOOTER.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={`${col.title}-${l.label}`}>
                  <Link
                    href={l.href}
                    className="footer-link text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} YOUR CLOSET. Effortlessly elegant.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="footer-link hover:text-primary">Privacy</Link>
            <Link href="/terms" className="footer-link hover:text-primary">Terms</Link>
            <span className="flex items-center gap-1.5">
              <DressMark className="h-3.5 w-3.5 text-primary" /> Made with care
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
