import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Protect admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    if (req.nextUrl.pathname.startsWith("/profiles")) {
      if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (
          req.nextUrl.pathname.startsWith("/admin") ||
          req.nextUrl.pathname.startsWith("/profiles")
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profiles/:path*"],
};
