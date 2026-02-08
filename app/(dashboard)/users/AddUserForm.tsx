"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addUser } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add User"}
    </button>
  );
}

export default function AddUserForm() {
  const [state, formAction] = useActionState(addUser, null);

  return (
    <div className="space-y-2">
      <form action={formAction} className="flex items-center gap-2">
        <input
          name="name"
          type="text"
          placeholder="Enter a name..."
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
        />
        <SubmitButton />
      </form>
      {state && (
        <p
          className={`text-sm ${state.success ? "text-foreground" : "text-destructive"}`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
