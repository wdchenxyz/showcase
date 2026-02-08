export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">
          Directory Navigation
        </h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
