import { NextResponse } from "next/server";

const BASE = process.env.BASE_URL;

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BASE}/meetings/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[meetings/request] error:", err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
