import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginButton } from "./LoginButton";

export const metadata = { title: "Log in — Showcase" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const session = (await cookies()).get("session")?.value;

  // Already logged in — send them where they wanted to go
  if (session) redirect(from ?? "/dashboard");

  return (
    <div className="mx-auto max-w-sm space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-sm text-muted-foreground">
          This is a simulated login. No real credentials needed.
        </p>
      </div>

      <LoginButton redirectTo={from ?? "/dashboard"} />
    </div>
  );
}
