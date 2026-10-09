import { NextRequest, NextResponse } from "next/server";

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "api",
  "admin",
  "teacher",
  "dashboard",
  "auth",
  "mail",
  "static",
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // 1. Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Extract hostname without port
  const hostname = host.split(":")[0].toLowerCase();

  let subdomain: string | null = null;

  // Case A: Localhost development testing (e.g., "ahmed-saad.localhost")
  if (hostname.endsWith(".localhost")) {
    subdomain = hostname.replace(".localhost", "");
  } else if (hostname.endsWith(".lvh.me")) {
    subdomain = hostname.replace(".lvh.me", "");
  }
  // Case B: Production domains (e.g., "ahmed-saad.droos.app")
  else if (hostname.includes(".")) {
    const parts = hostname.split(".");
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
  }

  // 3. Rewrite to /p/[slug]
  if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain)) {
    if (!pathname.startsWith(`/p/${subdomain}`)) {
      const targetPath = `/p/${subdomain}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(new URL(targetPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|[\\w-]+\\.\\w+).*)",
  ],
};
