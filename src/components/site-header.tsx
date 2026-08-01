"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Menu, Search, Heart, ShoppingBag, Sun, Moon, User } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { CartSheet } from "@/components/cart-sheet";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SHOP_GROUPS = [
  {
    title: "Dresses",
    links: [
      { label: "Slip Dresses", href: "/shop?category=slip-dresses", desc: "Liquid silk & satin" },
      { label: "Midi & Maxi", href: "/shop?category=midi-maxi", desc: "Day to evening" },
      { label: "Evening", href: "/shop?category=evening", desc: "Gowns & occasion" },
    ],
  },
  {
    title: "Closet",
    links: [
      { label: "The Basics", href: "/shop?category=basics", desc: "Foundation pieces" },
      { label: "Skirts & Trousers", href: "/shop?category=bottoms", desc: "Soft tailoring" },
      { label: "Accessories", href: "/shop?category=accessories", desc: "The finishing touch" },
    ],
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const cartItems = useCart((s) => s.items);
  const setCartOpen = useCart((s) => s.setOpen);
  const wishlist = useWishlist((s) => s.items);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => setMounted(true), []);

  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const isHome = pathname === "/";

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchInputRef.current?.value;
    if (q?.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(q.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "border-b border-border/60 transition-colors duration-300",
          isHome
            ? "bg-background/85 backdrop-blur-md"
            : "bg-background"
        )}
      >
        {/* ── Main nav bar: Logo LEFT | Links CENTER | Actions RIGHT ── */}
        <div className="mx-auto grid min-h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">

          {/* LEFT — Logo */}
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <BrandLogo />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-1">
                  {NAV.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium tracking-wide transition-colors hover:bg-secondary",
                        isActive(n.href) && "bg-secondary text-primary"
                      )}
                    >
                      {n.label}
                    </Link>
                  ))}
                  <div className="my-2 h-px bg-border" />
                  <Link
                    href="/closet"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    My Closet ({wishlist.length})
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    Account
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    Shipping & Returns
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <BrandLogo />
          </div>

          {/* CENTER — Desktop nav links */}
          <nav className="hidden items-center justify-center lg:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-[13px] uppercase tracking-[0.14em]">
                    Shop
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[560px] grid-cols-2 gap-4 p-5">
                      {SHOP_GROUPS.map((g) => (
                        <div key={g.title}>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {g.title}
                          </p>
                          <ul className="space-y-1">
                            {g.links.map((l) => (
                              <li key={l.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={l.href}
                                    className="block rounded-md p-2 transition-colors hover:bg-secondary"
                                  >
                                    <div className="text-sm font-medium text-foreground">{l.label}</div>
                                    <div className="text-xs text-muted-foreground">{l.desc}</div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {NAV.slice(1).map((n) => (
                  <NavigationMenuItem key={n.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-[13px] uppercase tracking-[0.14em]",
                        isActive(n.href) && "text-primary",
                        isActive(n.href) ? "border-b-2 border-primary" : "border-b-2 border-transparent"
                      )}
                    >
                      <Link href={n.href}>{n.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* RIGHT — Action icons */}
          <div className="flex min-w-0 items-center justify-end gap-0.5">
            <motion.div
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
                className="rounded-full"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
            </motion.div>
            <Link href="/closet" className="hidden sm:block" aria-label="My Closet">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Heart className="h-[18px] w-[18px]" />
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </Link>
            <Link href="/account" className="hidden sm:block" aria-label="Account">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-[18px] w-[18px]" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {mounted && theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open cart"
                className="relative rounded-full"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-border/60 bg-background"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  autoFocus
                  placeholder="Search for slips, silk, evening…"
                  className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
                <Button type="submit" variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>
                  Search
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CartSheet />
    </header>
  );
}
