"use client";

export default function UsersError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-2xl font-bold text-destructive">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground">
        We couldn&apos;t load the user directory.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}
