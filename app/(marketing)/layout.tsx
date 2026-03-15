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
      </nav>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
