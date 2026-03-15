import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const user = await res.json();
  return NextResponse.json(user);
}
