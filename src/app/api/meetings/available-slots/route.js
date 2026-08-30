import { NextResponse } from "next/server";

const BASE = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const duration = searchParams.get("duration");

  if (!date || !duration) {
    return NextResponse.json(
      { error: "date and duration are required" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(`${BASE}/meetings/available-slots`);
    url.searchParams.set("date", date);
    url.searchParams.set("duration", duration);

    const res = await fetch(url.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[meetings/available-slots] error:", err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
