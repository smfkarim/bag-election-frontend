import { withAuth } from "next-auth/middleware";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { RoleEnum } from "./constants/auth.constant";

/**
 * This middleware runs before protected routes.
 * It verifies session token and optionally checks user role.
 */
export default withAuth(
  // Custom callback — runs after NextAuth verifies the token
  async function middleware(req) {
    // customized auth for members
    if (req.nextUrl.pathname.startsWith("/election")) {
      const _cookies = await cookies();
      const isValidVoter = _cookies.get("isVoter")?.value === "1"; // dummy verification [After verifying Secret, and gave me a token and i will verify that]
      if (!isValidVoter) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    // traditional auth for agent
    // authentication
    if (!req.nextauth.token || !req.nextauth.token.role)
      return NextResponse.redirect(new URL("/auth/polling-agent", req.url));

    // authorization
    const { role } = req.nextauth.token;

    let roleBasedRouteMap: Record<RoleEnum, string[]> = {
      "Poll Officer": ["/polling-agent/vote"],
      "Super Admin": [],
      "Election Commission": [],
      "Panel Admin": [],
      Voter: [],
    };

    const route = req.nextUrl.pathname;
    const allowedRoutes = roleBasedRouteMap[role];

    const hasAccess = allowedRoutes.some((routePrefix) => {
      return route.startsWith(routePrefix);
    });

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

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
  },
);

/**
 * Define which routes are protected
 */
export const config = {
  matcher: [
    "/polling-agent/:path*", // protect dashboard and its subroutes
    "/election/:path*", // protect admin routes
  ],
};
