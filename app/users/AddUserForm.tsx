import { revalidatePath } from "next/cache";

export default function AddUserForm() {
  async function addUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/users`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );

    if (!res.ok) throw new Error("Failed to add user");

    const user = await res.json();
    console.log("Created user:", user);

    revalidatePath("/users");
  }

  return (
    <form action={addUser} className="flex items-center gap-2">
      <input
        name="name"
        type="text"
        placeholder="Enter a name..."
        required
        className="rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Add User
      </button>
    </form>
  );
}
