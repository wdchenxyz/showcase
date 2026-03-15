import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/users?delay=2000"
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 502 }
    );
  }

  const users = await res.json();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 502 }
    );
  }

  const user = await res.json();
  return NextResponse.json(user, { status: 201 });
}
