import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add public routes that don't require wallet connection
const publicRoutes = ["/", "/api"];
const groupsRoutes = ["/groups"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to home page and API routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Only allow the main groups listing page without wallet
  if (pathname === "/groups") {
    return NextResponse.next();
  }

  // Get wallet from cookie
  const hasWallet = request.cookies.get("wallet")?.value;

  // If no wallet is connected and trying to access protected routes
  if (!hasWallet) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\..*|api/wallet).*)",
  ],
}; 