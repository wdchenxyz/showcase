import { notFound } from "next/navigation";
import { Modal } from "@/components/ui/modal";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string };
}

export default async function InterceptedUserPage({
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
  const titleId = `user-modal-title-${id}`;

  return (
    <Modal titleId={titleId}>
      <h2 id={titleId} className="mb-4 text-xl font-bold">
        {user.name}
      </h2>
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">Email:</span> {user.email}
        </p>
        <p>
          <span className="text-muted-foreground">Phone:</span> {user.phone}
        </p>
        <p>
          <span className="text-muted-foreground">Website:</span>{" "}
          {user.website}
        </p>
        <p>
          <span className="text-muted-foreground">Company:</span>{" "}
          {user.company.name}
        </p>
        <p className="text-sm italic text-muted-foreground">
          &ldquo;{user.company.catchPhrase}&rdquo;
        </p>
      </div>
      <a
        href={`/users/${id}`}
        className="mt-4 inline-block text-sm text-primary hover:underline"
      >
        View full profile &rarr;
      </a>
    </Modal>
  );
}
