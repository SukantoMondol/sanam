import { NextResponse } from "next/server";

const BASE = process.env.BASE_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const duration = searchParams.get("duration");

  if (!year || !month || !duration) {
    return NextResponse.json(
      { error: "year, month, and duration are required" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(`${BASE}/meetings/available-dates`);
    url.searchParams.set("year", year);
    url.searchParams.set("month", month);
    url.searchParams.set("duration", duration);

    const res = await fetch(url.toString(), { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[meetings/available-dates] error:", err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
