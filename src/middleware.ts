// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;

//     if (req.nextUrl.pathname.startsWith("/dashboard")) {
//       if (token?.role !== "admin") {
//         return NextResponse.redirect(new URL("/", req.url));
//       }
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next(); // ผ่านทุก request ไม่ทำอะไร
}


export const config = {
  matcher: [],
};
