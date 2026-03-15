import { Suspense } from "react";
import AddUserForm from "./AddUserForm";
import UserList from "./UserList";
import UserListSkeleton from "./UserListSkeleton";

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-2xl font-bold">Team Members</h2>
      <div className="mb-4">
        <AddUserForm />
      </div>
      <Suspense fallback={<UserListSkeleton />}>
        <UserList />
      </Suspense>
    </div>
  );
}
