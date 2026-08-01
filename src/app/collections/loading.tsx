import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-4 w-16" />
        <Skeleton className="mx-auto h-10 w-48" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/5] w-full rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
