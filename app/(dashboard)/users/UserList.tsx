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

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002"}/api/users`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch users");

  const users: User[] = await res.json();

  return <SearchableUserList users={users} />;
}
