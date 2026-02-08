import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-2xl font-bold">User not found</h2>
      <p className="text-muted-foreground">
        This person doesn&apos;t exist in the directory.
      </p>
      <Link
        href="/users"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Back to directory
      </Link>
    </div>
  );
}
