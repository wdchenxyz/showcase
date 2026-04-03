import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Showcase Home
        </h1>
        <p className="text-muted-foreground">
          Jump to any dashboard route from here.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/demo"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          Demo
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          Dashboard
        </Link>
        <Link
          href="/users"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          User Directory
        </Link>
        <Link
          href="/demo/json-render"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          Json Render
        </Link>
        <Link
          href="/demo/story-flow"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
        >
          Story Flow
        </Link>
      </div>
    </div>
  );
}
