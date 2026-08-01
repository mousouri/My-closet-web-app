import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="flex gap-3">
          <div className="hidden flex-col gap-3 sm:flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-16 rounded-sm" />
            ))}
          </div>
          <Skeleton className="aspect-[3/4] w-full rounded-sm" />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-14 rounded-sm" />
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 flex-1 rounded-full" />
            <Skeleton className="h-11 w-11 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
