"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(redirectTo: string) {
  (await cookies()).set("session", "demo-user", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  redirect(redirectTo);
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/");
}
