import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link href="/" className="text-lg font-bold">
          Showcase
        </Link>
        <div className="flex gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/users"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Directory
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
