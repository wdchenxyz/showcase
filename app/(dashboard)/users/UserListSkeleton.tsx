import { Skeleton } from "@/components/ui/skeleton";

export default function UserListSkeleton() {
  return (
    <ul className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="rounded-lg border border-border bg-card p-4 space-y-2"
        >
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-32" />
        </li>
      ))}
    </ul>
  );
}
