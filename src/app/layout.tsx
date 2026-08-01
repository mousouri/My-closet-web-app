import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart-provider";
import { QuickViewProvider } from "@/components/quick-view-provider";
import { BackToTop } from "@/components/back-to-top";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YOUR CLOSET — Effortlessly Elegant",
  description:
    "Curated women's fashion. Silk slips, considered evening wear, and quietly perfect basics. Designed to be lived in.",
  keywords: ["women's fashion", "silk slip dress", "evening wear", "minimalist clothing", "YOUR CLOSET"],
  authors: [{ name: "YOUR CLOSET" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "YOUR CLOSET — Effortlessly Elegant",
    description: "Curated women's fashion. Designed to be lived in.",
    siteName: "YOUR CLOSET",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cormorant.variable} ${dancing.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <QuickViewProvider>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <BackToTop />
            </QuickViewProvider>
          </CartProvider>
        </ThemeProvider>
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
