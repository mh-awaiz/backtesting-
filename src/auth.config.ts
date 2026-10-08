import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no bcrypt/mongoose) — used directly by middleware.
// The full config with the Credentials provider lives in auth.ts and is
// only ever imported by Node-runtime code (API routes, server components).
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Vercel terminates TLS and proxies requests over plain HTTP internally
  // (forwarding the real scheme via x-forwarded-proto). Without trustHost,
  // Auth.js can't verify the host behind that proxy and silently fails to
  // read back a session that's actually valid — this is what was causing
  // "please sign in" to keep reappearing after a successful login.
  trustHost: true,
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = (user as { id?: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "DEVELOPER" | "CLIENT";
      }
      return session;
    },
  },
};
