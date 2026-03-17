import { auth } from "@/lib/auth";

const PROTECTED_PREFIXES = ["/discover", "/waves", "/messages", "/profile", "/settings", "/onboarding"];

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth?.user;

  if (isAuthenticated && nextUrl.pathname === "/sign-in") {
    return Response.redirect(new URL("/discover", nextUrl));
  }

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    nextUrl.pathname.startsWith(p)
  );
  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
