import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string };
  address: { street: string; suite: string; city: string; zipcode: string };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";
  const res = await fetch(`${baseUrl}/api/users/${id}`);

  if (!res.ok) return { title: "User not found — Directory" };

  const user: User = await res.json();
  return { title: `${user.name} — Directory` };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3002";
  const res = await fetch(`${baseUrl}/api/users/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const user: User = await res.json();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/users"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to directory
      </Link>

      <h2 className="mb-6 text-2xl font-bold">{user.name}</h2>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Contact
          </h3>
          <p className="text-foreground">{user.email}</p>
          <p className="text-foreground">{user.phone}</p>
          <p className="text-foreground">{user.website}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Address
          </h3>
          <p className="text-foreground">
            {user.address.street}, {user.address.suite}
          </p>
          <p className="text-foreground">
            {user.address.city} {user.address.zipcode}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Company
          </h3>
          <p className="text-foreground">{user.company.name}</p>
          <p className="text-sm text-muted-foreground italic">
            &ldquo;{user.company.catchPhrase}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
