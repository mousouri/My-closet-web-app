import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DressMark } from "@/components/brand-logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <DressMark className="h-16 w-16 text-primary/30" />
      <h1 className="mt-6 font-serif text-6xl sm:text-8xl">404</h1>
      <p className="mt-2 font-serif text-2xl text-muted-foreground">
        This page doesn&rsquo;t exist — yet.
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The piece you&rsquo;re looking for may have been moved or is no longer available.
        Let&rsquo;s get you back to something beautiful.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-full px-7">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full px-7">
          <Link href="/shop">Browse the edit</Link>
        </Button>
      </div>
    </div>
  );
}
