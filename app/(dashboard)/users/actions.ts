"use server";

import { revalidatePath } from "next/cache";

import { getRequestOrigin } from "@/lib/get-request-origin";

export type AddUserState = {
  message: string;
  success: boolean;
} | null;

export async function addUser(
  _prevState: AddUserState,
  formData: FormData
): Promise<AddUserState> {
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    return { message: "Name is required.", success: false };
  }

  const origin = await getRequestOrigin();
  const res = await fetch(new URL("/api/users", origin), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    return { message: "Failed to add user.", success: false };
  }

  const user = await res.json();
  console.log("Created user:", user);

  revalidatePath("/users");
  return { message: `Added "${user.name}" successfully!`, success: true };
}
