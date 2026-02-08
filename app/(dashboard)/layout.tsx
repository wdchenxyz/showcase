import Link from "next/link";

export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-card p-4">
        <Link href="/" className="mb-6 block text-lg font-bold">
          Showcase
        </Link>
        <nav className="space-y-1 text-sm">
          <Link
            href="/demo"
            className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            Demo
          </Link>
          <Link
            href="/dashboard"
            className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/users"
            className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            User Directory
          </Link>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
      {modal}
    </div>
  );
}
