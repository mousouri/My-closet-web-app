"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SIZE_DATA = [
  { size: "XS", bust: '32″–33″', waist: '24″–25″', hips: '34″–35″' },
  { size: "S",  bust: '34″–35″', waist: '26″–27″', hips: '36″–37″' },
  { size: "M",  bust: '36″–37″', waist: '28″–29″', hips: '38″–39″' },
  { size: "L",  bust: '38″–40″', waist: '30″–32″', hips: '40″–42″' },
  { size: "XL", bust: '41″–43″', waist: '33″–35″', hips: '43″–45″' },
];

export function SizeGuideDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Size guide</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          All measurements are in inches. For the best fit, measure yourself and compare with the chart below.
          Our pieces run true to size. Between sizes? We recommend sizing up for a relaxed fit.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-secondary/40">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Size</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Bust</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Waist</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Hips</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_DATA.map((row, i) => (
                <tr key={row.size} className={i < SIZE_DATA.length - 1 ? "border-b border-border/40" : ""}>
                  <td className="px-4 py-3 font-medium">{row.size}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.bust}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.waist}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Still unsure? Reach us at{' '}
          <a href="mailto:hello@yourcloset.com" className="text-primary hover:underline">hello@yourcloset.com</a>
          {' '}and we will help you find your perfect fit.
        </p>
      </DialogContent>
    </Dialog>
  );
}
