import { NextResponse } from "next/server";

export async function GET() {
  const result = {
    target: "https://kw.sanamstore.net/api/iosv1/getHome",
    status: null,
    statusText: null,
    headers: {},
    rawResponse: null,
    error: null,
  };

  try {
    const res = await fetch("https://kw.sanamstore.net/api/iosv1/getHome", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    result.status = res.status;
    result.statusText = res.statusText;
    res.headers.forEach((val, key) => {
      result.headers[key] = val;
    });

    const text = await res.text();
    result.rawResponse = text.slice(0, 500);

    return NextResponse.json({
      status_code: 200,
      debug: result,
    });
  } catch (err) {
    result.error = {
      message: err.message,
      stack: err.stack,
    };
    return NextResponse.json(
      { status_code: 500, debug: result },
      { status: 500 }
    );
  }
}
