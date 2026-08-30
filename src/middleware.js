import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (!token) {
    const response = NextResponse.redirect(new URL("/sign-in", req.url));
    response.cookies.set("lastVisitedPath", pathname);
    return response;
  }

  // If token exists, proceed to the requested route
  return NextResponse.next();
}

// Apply the middleware to all paths
export const config = {
  matcher: [
    "/my-profile",
    "/edit-profile",
    "/order-details/:path*",
  ],
  // matcher: ["/:path*"],
  // matcher: ["/company/:path*"],
};
