import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="mb-8 h-10 w-48" />
      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="space-y-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        </aside>
        <div className="flex-1">
          <div className="mb-6 flex justify-between">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
