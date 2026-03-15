import { getRequestOrigin } from "@/lib/get-request-origin";
import SearchableUserList from "./SearchableUserList";

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

export default async function UserList() {
  // Uncomment the next line to test the error state:
  // if (Math.random() > 0.5) throw new Error("Failed to load users");

  const origin = await getRequestOrigin();
  const res = await fetch(new URL("/api/users", origin), { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch users");

  const users: User[] = await res.json();

  return <SearchableUserList users={users} />;
}
