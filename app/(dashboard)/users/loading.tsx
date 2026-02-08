import { Skeleton } from "@/components/ui/skeleton";
import UserListSkeleton from "./UserListSkeleton";

export default function UsersLoading() {
  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="mb-4 h-8 w-48" />
      <Skeleton className="mb-4 h-10 w-72" />
      <UserListSkeleton />
    </div>
  );
}
