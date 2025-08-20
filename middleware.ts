import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const authRoutes = [
  "/login",
  "/register",
  "/verify-email",
  "/verify-email/success",
  "/forgot-password",
  "/forgot-password/success",
  "/reset-password"
];
const ProtectedRoutes = ["/account", "/orders"];

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const sessionCookie = getSessionCookie(request);

  const res = NextResponse.next();

  const isLoggedIn = !!sessionCookie;
  const isOnAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnProtectedRoute = ProtectedRoutes.includes(nextUrl.pathname);
  const isOnAdminRoute = nextUrl.pathname.startsWith("/admin");

  if ((isOnAdminRoute || isOnProtectedRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
