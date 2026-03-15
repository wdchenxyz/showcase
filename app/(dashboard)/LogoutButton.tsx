"use client";

import { logout } from "@/app/(marketing)/login/actions";

export function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="block w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
    >
      Log out
    </button>
  );
}
