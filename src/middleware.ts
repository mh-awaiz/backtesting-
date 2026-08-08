import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const roleHome: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  DEVELOPER: "/developer/dashboard",
  CLIENT: "/client/dashboard",
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isClientArea = pathname.startsWith("/client");
  const isDeveloperArea = pathname.startsWith("/developer");
  const isAdminArea = pathname.startsWith("/admin");

  if (!isClientArea && !isDeveloperArea && !isAdminArea) {
    return NextResponse.next();
  }

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role;

  if (isClientArea && role !== "CLIENT") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
  }
  if (isDeveloperArea && role !== "DEVELOPER") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
  }
  if (isAdminArea && role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/client/:path*", "/developer/:path*", "/admin/:path*"],
};
