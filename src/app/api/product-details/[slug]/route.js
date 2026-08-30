import { NextResponse } from "next/server";
import { fetchLiveProductDetails } from "@/services/liveApiService";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const data = await fetchLiveProductDetails(slug);

    if (!data || !data.product) {
      return NextResponse.json(
        { status_code: 404, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status_code: 200,
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { status_code: 500, message: error.message },
      { status: 500 }
    );
  }
}
