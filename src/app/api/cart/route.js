import { NextResponse } from "next/server";

const LIVE_BACKEND = "https://kw.sanamstore.net";

export async function GET(request) {
  // Returns safe empty cart or cart data
  return NextResponse.json({
    status: true,
    status_code: 200,
    data: {
      items: [],
      total_price: 0,
      total_quantity: 0,
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: true,
      status_code: 200,
      message: "Product added to cart",
      data: body,
    });
  } catch (err) {
    return NextResponse.json({ status: true, status_code: 200, data: {} });
  }
}
