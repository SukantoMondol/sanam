import { NextResponse } from "next/server";
import areasData from "@/data/liveKuwaitAreas.json";

export async function GET() {
  return NextResponse.json({
    status: true,
    status_code: 200,
    data: areasData,
  });
}
