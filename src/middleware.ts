import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * This middleware runs before protected routes.
 * It verifies session token and optionally checks user role.
 */
export default withAuth(
    // Custom callback — runs after NextAuth verifies the token
    function middleware(req) {
        const token = req.nextauth?.token;

        // Example: restrict access to admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
            if (token?.role !== "admin") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

        // Example: optional additional checks
        // if (req.nextUrl.pathname.startsWith("/dashboard")) {
        //   if (!token?.permissions?.includes("VIEW_DASHBOARD")) {
        //     return NextResponse.redirect(new URL("/forbidden", req.url));
        //   }
        // }

        // Allow request
        return NextResponse.next();
    },
    {
        /**
         * NextAuth middleware options
         * This ensures JWT validation and session parsing
         */
        callbacks: {
            authorized: ({ token }) => !!token, // require login for all matched routes
        },
    }
);

/**
 * Define which routes are protected
 */
export const config = {
    matcher: [
        "/dashboard/:path*", // protect dashboard and its subroutes
        "/admin/:path*", // protect admin routes
    ],
};
