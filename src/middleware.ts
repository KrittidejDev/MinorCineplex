import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect auth pages from logged-in users (except reset-password)
    if (pathname.startsWith("/auth") && !pathname.startsWith("/auth/reset-password")) {
      if (token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Protect admin pages
    if (pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Protect profiles pages
    if (pathname.startsWith("/profiles")) {
      if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profiles/:path*", "/auth/:path*"],
};
