"use client";

import Link from "next/link";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

export default function SearchableUserList({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
      />
      <ul className="space-y-3">
        {filtered.map((user) => (
          <li key={user.id}>
            <Link
              href={`/users/${user.id}`}
              className="block rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
            >
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.company.name}
              </p>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No users found.
          </p>
        )}
      </ul>
    </div>
  );
}
