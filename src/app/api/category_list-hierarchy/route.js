import { NextResponse } from "next/server";
import { fetchLiveCategories } from "@/services/liveApiService";

export async function GET() {
  try {
    const categories = await fetchLiveCategories();
    return NextResponse.json({
      status_code: 200,
      data: categories,
    });
  } catch (error) {
    return NextResponse.json(
      { status_code: 500, message: error.message },
      { status: 500 }
    );
  }
}
