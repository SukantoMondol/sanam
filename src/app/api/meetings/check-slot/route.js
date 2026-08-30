import { NextResponse } from "next/server";

const BASE = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const start_time = searchParams.get("start_time");
  const duration = searchParams.get("duration");

  if (!date || !start_time || !duration) {
    return NextResponse.json(
      { error: "date, start_time, and duration are required" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(`${BASE}/meetings/check-slot`);
    url.searchParams.set("date", date);
    url.searchParams.set("start_time", start_time);
    url.searchParams.set("duration", duration);

    const res = await fetch(url.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[meetings/check-slot] error:", err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
