export default function DashboardLayout({
  children,
  analytics,
  activity,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {children}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {analytics}
        {activity}
      </div>
    </div>
  );
}
