interface User {
  id: number;
  name: string;
}

export default async function AnalyticsSlot() {
  // Simulate a slow data source
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });
  const users: User[] = await res.json();

  const stats = [
    { label: "Total Users", value: users.length },
    { label: "Active Today", value: Math.floor(users.length * 0.7) },
    { label: "New This Week", value: Math.floor(users.length * 0.3) },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">Analytics</h2>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
