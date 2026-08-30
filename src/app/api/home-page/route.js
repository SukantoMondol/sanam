import { NextResponse } from "next/server";
import { fetchLiveHomeData } from "@/services/liveApiService";

export async function GET() {
  try {
    const data = await fetchLiveHomeData();
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
