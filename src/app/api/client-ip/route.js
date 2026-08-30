import { NextResponse } from "next/server";

export async function GET(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("true-client-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor?.split(",")?.[0]?.trim() ||
    null;

  return NextResponse.json({ client_ip: clientIp });
}
