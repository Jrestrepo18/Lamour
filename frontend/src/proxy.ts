import { NextResponse, type NextRequest } from "next/server";

/**
 * Spanish keeps the site's original, unprefixed URLs; English lives under /en.
 * Unprefixed requests are served from the [lang]=es routes (a rewrite, so the
 * address bar and Google keep seeing /servicios), and a stray /es/… is
 * redirected to its canonical unprefixed URL so no page exists twice.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  const url = request.nextUrl.clone();
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  url.pathname = `/es${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except the API, the admin panel, Next internals and files (anything with a dot).
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
