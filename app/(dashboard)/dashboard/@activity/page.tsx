export default async function ActivitySlot() {
  // Simulate a different, faster data source
  await new Promise((resolve) => setTimeout(resolve, 800));

  const activities = [
    { id: 1, text: "Leanne Graham updated their profile", time: "2m ago" },
    { id: 2, text: "Ervin Howell joined the directory", time: "15m ago" },
    { id: 3, text: "Clementine Bauch changed their email", time: "1h ago" },
    { id: 4, text: "Patricia Lebsack was removed", time: "3h ago" },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
      <ul className="space-y-3">
        {activities.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <p className="text-sm text-foreground">{item.text}</p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
