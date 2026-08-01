"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Clock, Instagram } from "lucide-react";

export default function ContactPage() {
  const [pending, setPending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    // simulate
    await new Promise((r) => setTimeout(r, 700));
    setPending(false);
    toast.success("Thank you — we'll be in touch within 24 hours.");
    (e.target as HTMLFormElement).reset();
    void data;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">We&apos;d love to hear from you</p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Contact</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          Questions about sizing, an order, or a piece you love? Our team replies within 24 hours,
          Monday to Friday.
        </p>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-5">
        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4 md:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required rows={6} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Sending…" : "Send message"}
          </Button>
        </form>

        {/* Info */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-sm border border-border/60 bg-secondary/30 p-6">
            <h2 className="font-serif text-xl">The atelier</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Flagship</p>
                  <p className="text-muted-foreground">14 Rue de Sèvres, 75007 Paris</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:hello@yourcloset.com" className="text-muted-foreground hover:text-primary">hello@yourcloset.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+33 1 42 00 00 00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-muted-foreground">Mon–Sat, 10am – 7pm CET</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Instagram</p>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">@yourcloset</a>
                </div>
              </li>
            </ul>
          </div>
          <div className="rounded-sm border border-border/60 p-6">
            <h3 className="font-serif text-lg">Customer care</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For order-specific questions, please have your order number ready. You can also find
              quick answers in our{" "}
              <a href="/faq" className="text-primary hover:underline">Shipping & Returns</a> page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
