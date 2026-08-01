"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, cartSubtotal } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Lock, CreditCard, ArrowLeft, Check, X, ShoppingBag, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Australia",
  "Japan",
  "China",
  "South Korea",
  "Brazil",
  "India",
  "Mexico",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "Belgium",
  "Austria",
  "Portugal",
  "Ireland",
  "New Zealand",
  "Singapore",
  "UAE",
  "South Africa",
];

const PROMO_CODES: Record<string, number> = {
  WELCOME10: 10,
  ELEGANT15: 15,
};

type StepNumber = 1 | 2 | 3;

type FieldErrors = Record<string, string>;

const STEP_LABELS: { n: StepNumber; label: string }[] = [
  { n: 1, label: "Information" },
  { n: 2, label: "Shipping" },
  { n: 3, label: "Payment" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [pending, setPending] = React.useState(false);
  const [step, setStep] = React.useState<StepNumber>(1);
  const [validatedSteps, setValidatedSteps] = React.useState<Set<StepNumber>>(new Set());
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [promo, setPromo] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState<{ code: string; percent: number } | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState("United States");

  const subtotal = cartSubtotal(items);
  const discount = appliedPromo ? subtotal * (appliedPromo.percent / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= 150 || afterDiscount === 0 ? 0 : 8;
  const tax = afterDiscount * 0.08;
  const total = afterDiscount + shipping + tax;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMO_CODES[code] !== undefined) {
      setAppliedPromo({ code, percent: PROMO_CODES[code] });
      toast.success(`${PROMO_CODES[code]}% off applied — ${code}`);
    } else {
      toast.error("That code isn't valid");
    }
    setPromo("");
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const canClickStep = (targetStep: StepNumber): boolean => {
    if (targetStep === 1) return true;
    return validatedSteps.has((targetStep - 1) as StepNumber);
  };

  const validateStep1 = (): boolean => {
    const form = document.querySelector("form");
    if (!form) return false;
    const email = (form.querySelector("[name='email']") as HTMLInputElement)?.value?.trim();
    const fullName = (form.querySelector("[name='fullName']") as HTMLInputElement)?.value?.trim();
    const newErrors: FieldErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email";
    if (!fullName) newErrors.fullName = "Full name is required";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const form = document.querySelector("form");
    if (!form) return false;
    const line1 = (form.querySelector("[name='line1']") as HTMLInputElement)?.value?.trim();
    const city = (form.querySelector("[name='city']") as HTMLInputElement)?.value?.trim();
    const postalCode = (form.querySelector("[name='postalCode']") as HTMLInputElement)?.value?.trim();
    const newErrors: FieldErrors = {};
    if (!line1) newErrors.line1 = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!postalCode) newErrors.postalCode = "Postal code is required";
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleStepClick = (targetStep: StepNumber) => {
    if (!canClickStep(targetStep)) return;
    setStep(targetStep);
    // Clear errors for the new step
    if (targetStep === 1) setErrors((prev) => { const { email, fullName, ...rest } = prev; return rest; });
    if (targetStep === 2) setErrors((prev) => { const { line1, city, postalCode, ...rest } = prev; return rest; });
  };

  const continueToStep2 = () => {
    if (validateStep1()) {
      setValidatedSteps((prev) => new Set(prev).add(1));
      setErrors((prev) => { const { email, fullName, ...rest } = prev; return rest; });
      setStep(2);
    }
  };

  const continueToStep3 = () => {
    if (validateStep2()) {
      setValidatedSteps((prev) => new Set(prev).add(2));
      setErrors((prev) => { const { line1, city, postalCode, ...rest } = prev; return rest; });
      setStep(3);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate all steps before submitting
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    setValidatedSteps(new Set([1, 2, 3]));
    setPending(true);

    const form = new FormData(e.currentTarget);
    const shippingData = {
      fullName: form.get("fullName"),
      line1: form.get("line1"),
      line2: form.get("line2"),
      city: form.get("city"),
      state: form.get("state"),
      postalCode: form.get("postalCode"),
      country: selectedCountry,
    };
    const email = form.get("email");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ ...i, productId: i.id })),
          email,
          shipping: shippingData,
          subtotal,
          shippingCost: shipping,
          tax,
          discount,
          total,
        }),
      });
      if (!res.ok) throw new Error("Failed to place order");
      const data = await res.json();
      clear();
      router.push(`/order/success?number=${data.order.number}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setPending(false);
    }
  };

  // ── Empty cart state ────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <div className="rounded-full bg-secondary p-6">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-5 font-serif text-3xl">Your bag is empty</p>
        <p className="mt-2 text-sm text-muted-foreground">Add a piece before checking out.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/shop">Shop the edit</Link>
        </Button>
      </div>
    );
  }

  // ── Summary content (shared between desktop sidebar & mobile sheet) ─
  const summaryContent = (
    <>
      <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto sc-elegant">
        {items.map((item) => (
          <li key={`${item.id}-${item.size ?? ""}-${item.color ?? ""}`} className="flex gap-3">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-muted">
              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col">
              <p className="text-xs font-medium leading-snug text-foreground">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {[item.size, item.color].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-auto text-xs font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Promo Code */}
      <div className="mt-4">
        {appliedPromo ? (
          <div className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2">
            <span className="text-xs font-medium text-primary">
              ✓ {appliedPromo.code} — {appliedPromo.percent}% off
            </span>
            <button
              type="button"
              onClick={removePromo}
              className="ml-2 flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Remove promo code"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              className="text-sm"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
            />
            <Button variant="outline" size="sm" type="button" onClick={applyPromo}>
              Apply
            </Button>
          </div>
        )}
        {!appliedPromo && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">Try WELCOME10 or ELEGANT15</p>
        )}
      </div>

      <Separator className="my-4" />
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="text-foreground">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-primary">
            <dt>Discount</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="text-foreground">{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax</dt>
          <dd className="text-foreground">{formatPrice(tax)}</dd>
        </div>
      </dl>
      <Separator className="my-4" />
      <div className="flex justify-between text-base font-medium">
        <span className="text-foreground">Total</span>
        <span className="text-foreground">{formatPrice(total)}</span>
      </div>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-12 sm:px-6 lg:pb-12 lg:px-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to bag
      </Link>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-foreground">Checkout</h1>

      {/* ── Step indicators ──────────────────────────────────────────── */}
      <div className="mt-6 flex items-center gap-2 text-xs">
        {STEP_LABELS.map((s, idx) => {
          const isClickable = canClickStep(s.n);
          const isActive = step === s.n;
          const isCompleted = validatedSteps.has(s.n) && step !== s.n;
          return (
            <React.Fragment key={s.n}>
              <button
                type="button"
                onClick={() => handleStepClick(s.n)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-all",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-primary text-primary-foreground",
                  !isActive && !isCompleted && isClickable && "bg-secondary text-muted-foreground hover:bg-secondary/80",
                  !isClickable && "bg-secondary/40 text-muted-foreground/40 cursor-not-allowed pointer-events-none"
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full text-[10px]",
                    isActive && "bg-primary-foreground/30",
                    isCompleted && "bg-primary-foreground/30",
                    !isActive && !isCompleted && "bg-background/30",
                    !isClickable && "bg-background/10"
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : s.n}
                </span>
                {s.label}
              </button>
              {idx < STEP_LABELS.length - 1 && (
                <div
                  className={cn(
                    "h-px w-6 transition-colors",
                    validatedSteps.has(s.n) ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Main layout ─────────────────────────────────────────────── */}
      <form onSubmit={onSubmit} className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* ── Step 1 — Information ─────────────────────────────────── */}
          <motion.section
            initial={false}
            animate={{ opacity: 1 }}
            className={cn(
              "rounded-sm border p-6 transition-all",
              step === 1 && "border-l-2 border-l-primary bg-secondary/20 border-border",
              validatedSteps.has(1) && step !== 1 && "border-border/60 opacity-70",
              !validatedSteps.has(1) && step !== 1 && "border-border/60 opacity-40"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl text-foreground">Contact information</h2>
                {validatedSteps.has(1) && step !== 1 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              {step !== 1 && validatedSteps.has(1) && (
                <button type="button" onClick={() => handleStepClick(1)} className="text-xs text-primary hover:underline">
                  Edit
                </button>
              )}
            </div>
            <div className="mt-4 grid gap-4">
              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={cn(
                    "mt-1.5 bg-background text-foreground border-border",
                    errors.email && "border-destructive"
                  )}
                  placeholder="your@email.com"
                  disabled={step !== 1}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-destructive"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName" className="text-foreground">
                    Full name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    className={cn(
                      "mt-1.5 bg-background text-foreground border-border",
                      errors.fullName && "border-destructive"
                    )}
                    disabled={step !== 1}
                  />
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-xs text-destructive"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground">
                    Phone (optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    className="mt-1.5 bg-background text-foreground border-border"
                    disabled={step !== 1}
                  />
                </div>
              </div>
            </div>
            {step === 1 && (
              <Button type="button" className="mt-5" onClick={continueToStep2}>
                Continue to shipping
              </Button>
            )}
          </motion.section>

          {/* ── Step 2 — Shipping ────────────────────────────────────── */}
          <motion.section
            initial={false}
            animate={{ opacity: 1 }}
            className={cn(
              "rounded-sm border p-6 transition-all",
              step === 2 && "border-l-2 border-l-primary bg-secondary/20 border-border",
              validatedSteps.has(2) && step !== 2 && "border-border/60 opacity-70",
              !validatedSteps.has(2) && step !== 2 && !validatedSteps.has(1) && "border-border/60 opacity-40",
              !validatedSteps.has(2) && step !== 2 && validatedSteps.has(1) && "border-border/60 opacity-70"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl text-foreground">Shipping address</h2>
                {validatedSteps.has(2) && step !== 2 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              {step !== 2 && validatedSteps.has(2) && (
                <button type="button" onClick={() => handleStepClick(2)} className="text-xs text-primary hover:underline">
                  Edit
                </button>
              )}
            </div>
            <div className="mt-4 grid gap-4">
              <div>
                <Label htmlFor="line1" className="text-foreground">
                  Address line 1
                </Label>
                <Input
                  id="line1"
                  name="line1"
                  required
                  className={cn(
                    "mt-1.5 bg-background text-foreground border-border",
                    errors.line1 && "border-destructive"
                  )}
                  disabled={step !== 2}
                />
                <AnimatePresence>
                  {errors.line1 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-destructive"
                    >
                      {errors.line1}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <Label htmlFor="line2" className="text-foreground">
                  Address line 2 (optional)
                </Label>
                <Input
                  id="line2"
                  name="line2"
                  className="mt-1.5 bg-background text-foreground border-border"
                  disabled={step !== 2}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="city" className="text-foreground">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    className={cn(
                      "mt-1.5 bg-background text-foreground border-border",
                      errors.city && "border-destructive"
                    )}
                    disabled={step !== 2}
                  />
                  <AnimatePresence>
                    {errors.city && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-xs text-destructive"
                      >
                        {errors.city}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <Label htmlFor="state" className="text-foreground">
                    State / Region
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    className="mt-1.5 bg-background text-foreground border-border"
                    disabled={step !== 2}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-foreground">
                    Postal code
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    className={cn(
                      "mt-1.5 bg-background text-foreground border-border",
                      errors.postalCode && "border-destructive"
                    )}
                    disabled={step !== 2}
                  />
                  <AnimatePresence>
                    {errors.postalCode && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-xs text-destructive"
                      >
                        {errors.postalCode}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div>
                <Label htmlFor="country" className="text-foreground">
                  Country
                </Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={step !== 2}>
                  <SelectTrigger className="mt-1.5 w-full bg-background text-foreground border-border">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground">
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hidden input so form data picks up the country */}
                <input type="hidden" name="country" value={selectedCountry} />
              </div>
            </div>
            {step === 2 && (
              <Button type="button" className="mt-5" onClick={continueToStep3}>
                Continue to payment
              </Button>
            )}
          </motion.section>

          {/* ── Step 3 — Payment ─────────────────────────────────────── */}
          <motion.section
            initial={false}
            animate={{ opacity: 1 }}
            className={cn(
              "rounded-sm border p-6 transition-all",
              step === 3 && "border-l-2 border-l-primary bg-secondary/20 border-border",
              step !== 3 && !validatedSteps.has(2) && "border-border/60 opacity-40",
              step !== 3 && validatedSteps.has(2) && "border-border/60 opacity-70"
            )}
          >
            <h2 className="flex items-center gap-2 font-serif text-xl text-foreground">
              <Lock className="h-4 w-4 text-primary" /> Payment
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              This is a demo store — no real payment will be processed. Use any details.
            </p>
            <div className="mt-4 grid gap-4">
              <div>
                <Label htmlFor="card" className="text-foreground">
                  Card number
                </Label>
                <div className="relative mt-1.5">
                  <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="card"
                    name="card"
                    className="pl-10 bg-background text-foreground border-border"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name on card
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="mt-1.5 bg-background text-foreground border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="exp" className="text-foreground">
                    Expiry
                  </Label>
                  <Input
                    id="exp"
                    name="exp"
                    placeholder="MM/YY"
                    className="mt-1.5 bg-background text-foreground border-border"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="cvc" className="text-foreground">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    className="mt-1.5 bg-background text-foreground border-border"
                  />
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ── Desktop Order Summary ──────────────────────────────────── */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-32 rounded-sm border border-border/60 bg-background p-6">
            <h2 className="font-serif text-xl text-foreground">Order summary</h2>
            {summaryContent}
            <Button
              type="submit"
              disabled={pending || step !== 3}
              className="mt-5 w-full rounded-full"
              size="lg"
            >
              {pending ? "Placing order…" : step !== 3 ? "Complete steps above" : `Pay ${formatPrice(total)}`}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Encrypted · Demo checkout
            </p>
          </div>
        </div>
      </form>

      {/* ── Mobile Sticky Summary Bar ────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold text-foreground">{formatPrice(total)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMobileSummaryOpen(true)}
              className="gap-1"
            >
              <ChevronUp className="h-3 w-3" />
              Details
            </Button>
            <Button
              type="button"
              disabled={step !== 3 || pending}
              className="rounded-full"
              onClick={() => {
                if (step !== 3) {
                  if (!validatedSteps.has(1)) {
                    toast.error("Please complete contact information first");
                  } else if (!validatedSteps.has(2)) {
                    toast.error("Please complete shipping address first");
                  }
                  return;
                }
                // Trigger form submit
                const formEl = document.querySelector("form");
                if (formEl) formEl.requestSubmit();
              }}
            >
              {pending ? "Placing order…" : `Pay ${formatPrice(total)}`}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile Summary Sheet ─────────────────────────────────────── */}
      <Sheet open={mobileSummaryOpen} onOpenChange={setMobileSummaryOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="font-serif text-xl text-foreground">Order summary</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Review your order details before checkout.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-8 pt-2">
            {summaryContent}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
