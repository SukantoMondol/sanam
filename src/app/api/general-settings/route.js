import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status_code: 200,
    data: {
      default_page_title: "Sanam Store - Online Shopping Kuwait",
      default_meta_description: "Shop quality tools, home appliances, adhesives, and everyday essentials at Sanam Store in Kuwait.",
      logo: "/assets/images/logo.png",
      hotline_number: "+965 99330508",
      default_currency: "KWD",
      currency_symbol: "KWD",
    },
  });
}
