import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = process.env.BASE_URL;

export async function GET() {
  if (!BASE) {
    return NextResponse.json(
      { error: "BASE_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(`${BASE}/career`, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "User-Agent": "Mozilla/5.0 (compatible; SanamStoreBot/1.0)",
        Referer: process.env.NEXT_PUBLIC_APP_URL || "https://sanamstore.net",
        Origin: process.env.NEXT_PUBLIC_APP_URL || "https://sanamstore.net",
      },
      timeout: 10000,
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("[career/route] fetch error:",
      err?.response?.status,
      err?.response?.statusText,
      err?.response?.data || err?.message
    );

    const status = err?.response?.status || 500;
    const errorData = err?.response?.data || { error: "Server error" };
    return NextResponse.json(errorData, { status });
  }
}
