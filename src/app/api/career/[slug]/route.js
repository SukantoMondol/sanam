import { NextResponse } from "next/server";

const BASE = process.env.BASE_URL;

export async function GET(request, { params }) {
  const { slug } = await params;
  if (!BASE) {
    return NextResponse.json(
      { error: "BASE_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${BASE}/career/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Job not found", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[career/${slug}/route] fetch error:`, err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { slug } = await params;

  try {
    // Forward the multipart form data as-is to the external API
    const formData = await request.formData();

    const res = await fetch(`${BASE}/career/${slug}/apply`, {
      method: "POST",
      body: formData,
      // Do NOT set Content-Type — fetch sets the correct multipart boundary automatically
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`[career/${slug}/apply] proxy error:`, err?.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
