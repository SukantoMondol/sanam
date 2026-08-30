import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const backendUrl = new URL(
    `${process.env.BASE_URL}/get-all-products`
  );

  // Forward all allowed query params
  const allowedParams = ["sort", "per_page", "page", "search", "min_price", "max_price"];
  allowedParams.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null && value !== "") {
      backendUrl.searchParams.set(key, value);
    }
  });

  try {
    const res = await fetch(backendUrl.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { status: false, status_message: "Failed to fetch products" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("all-products proxy error:", error);
    return NextResponse.json(
      { status: false, status_message: "Server error" },
      { status: 500 }
    );
  }
}
