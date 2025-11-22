import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check for our admin auth cookie
  const isAuthenticated = request.cookies.get("admin_auth")?.value === "true";

  // Protect all /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware only to admin pages
export const config = {
  matcher: ["/admin/:path*"],
};
