import { auth } from "@/lib/auth";

const PROTECTED_PREFIXES = ["/discover", "/waves", "/messages", "/profile", "/settings", "/onboarding", "/admin", "/church-admin"];

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth?.user;

  if (isAuthenticated && nextUrl.pathname === "/sign-in") {
    const isAppAdmin = (req.auth?.user as { isAppAdmin?: boolean } | undefined)
      ?.isAppAdmin;
    return Response.redirect(
      new URL(isAppAdmin ? "/admin/churches" : "/discover", nextUrl)
    );
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
