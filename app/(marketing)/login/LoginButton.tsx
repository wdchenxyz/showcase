"use client";

import { login } from "./actions";

export function LoginButton({ redirectTo }: { redirectTo: string }) {
  return (
    <button
      onClick={() => login(redirectTo)}
      className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
    >
      Log in as Demo User
    </button>
  );
}
