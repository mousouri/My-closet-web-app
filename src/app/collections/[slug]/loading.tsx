import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionPageLoading() {
  return (
    <div>
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-sm" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
