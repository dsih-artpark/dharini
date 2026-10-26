import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import {
  LOGIN_ROUTE,
  PUBLIC_ROUTES,
  isTokenExpired,
  sessionExpiredLoginPath,
} from "@/src/utils/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes to pass through
  if (PUBLIC_ROUTES.some((route) => route.test(pathname))) {
    return NextResponse.next();
  }

  // Get the authentication token
  const token = await getCookie("authToken", { req: request });
  // A token past its `exp` is a session that has ended. The cookie outlives
  // the token on purpose (see setToken) so this can be told apart from never
  // having signed in.
  const isExpired = typeof token === "string" && isTokenExpired(token);

  // Handle login route
  if (pathname === LOGIN_ROUTE) {
    return token && !isExpired
      ? NextResponse.redirect(new URL("/home", request.url))
      : NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Send users whose session expired to login, saying so. The cookie is
  // cleared by the login page, not here: background prefetches also pass
  // through here and would clear it before the user's own navigation.
  if (isExpired) {
    return NextResponse.redirect(
      new URL(sessionExpiredLoginPath(pathname), request.url),
    );
  }

  // Allow authenticated users to pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ routes and /runtime-config (served to the browser before sign-in)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (e.g. /favicon.ico, /images/*, /fonts/*)
     */
    "/((?!api|_next|_static|_vercel|runtime-config|images|fonts|maps|favicon.ico).*)",
  ],
};
