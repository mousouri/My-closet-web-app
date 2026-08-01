import Link from "next/link";
import { cn } from "@/lib/utils";

// Stylised slip-dress silhouette (matches the brand mark from the brief)
export function DressMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 96"
      className={cn("h-10 w-10", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* thin straps */}
      <rect x="24" y="2" width="2.4" height="20" rx="1.2" />
      <rect x="37.6" y="2" width="2.4" height="20" rx="1.2" />
      {/* bodice V */}
      <path d="M22 22 L31 36 L42 22 L46 26 C40 30 38 34 38 40 L26 40 C26 34 24 30 18 26 Z" />
      {/* flared skirt */}
      <path d="M26 40 L38 40 L48 86 C49 90 47 93 43 93 L21 93 C17 93 15 90 16 86 Z" />
    </svg>
  );
}

export function BrandLogo({
  className,
  withText = true,
  href = "/",
}: {
  className?: string;
  withText?: boolean;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 text-primary transition-opacity hover:opacity-80",
        className
      )}
      aria-label="YOUR CLOSET — home"
    >
      <DressMark className="h-9 w-9 transition-transform group-hover:-translate-y-0.5" />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="font-script text-2xl font-semibold tracking-tight">
            your closet
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            effortlessly elegant
          </span>
        </span>
      )}
    </Link>
  );
}
