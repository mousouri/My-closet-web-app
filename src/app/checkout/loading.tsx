import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-4 w-24" />
      <Skeleton className="mb-8 h-10 w-40" />
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Skeleton className="h-48 w-full rounded-sm" />
          <Skeleton className="h-48 w-full rounded-sm" />
          <Skeleton className="h-48 w-full rounded-sm" />
        </div>
        <Skeleton className="h-80 w-full rounded-sm" />
      </div>
    </div>
  );
}
