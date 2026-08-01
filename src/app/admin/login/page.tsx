"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<LoginShell />}>
      <AdminLoginContent />
    </React.Suspense>
  );
}

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("hello@yourcloset.com");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error ?? "Could not sign in");
      return;
    }

    toast.success("Admin signed in");
    router.replace(searchParams.get("next") || "/admin");
    router.refresh();
  }

  return (
    <LoginShell>
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-sm border border-border/70 bg-background/92 p-6 shadow-2xl backdrop-blur sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Admin access</p>
            <h1 className="mt-3 font-serif text-3xl">Sign in</h1>
          </div>
          <motion.div
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6 }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <LockKeyhole className="h-5 w-5" />
          </motion.div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative mt-1.5">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Welcome back..." : "Login"}
        </Button>

        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Protected operations for products, orders, customers, and payments.</span>
        </div>
      </motion.form>
    </LoginShell>
  );
}

function LoginShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[linear-gradient(135deg,rgba(20,20,20,0.92),rgba(85,37,51,0.78)),url('https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f4e8cb2c9863.jpg')] bg-cover bg-center" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute left-4 top-6 rounded-sm bg-background/90 px-4 py-3 backdrop-blur sm:left-6 lg:left-8">
          <BrandLogo />
        </div>
        {children ?? <div className="h-96 w-full max-w-md rounded-sm border border-border/70 bg-background/90" />}
      </div>
    </div>
  );
}
