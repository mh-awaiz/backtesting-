import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    // Reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET from the environment.
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        await connectToDatabase();
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.active) return null;

        // Google-only accounts have no password to check against.
        if (!user.passwordHash) return null;
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    // Google sign-in: find the matching account by email, or create a CLIENT.
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;
      const email = profile?.email?.toLowerCase();
      if (!email || profile?.email_verified === false) return false;

      await connectToDatabase();
      const existing = await User.findOne({ email });
      if (existing) return existing.active;

      await User.create({
        name: profile?.name || email.split("@")[0],
        email,
        role: "CLIENT",
      });
      return true;
    },
    async jwt(params) {
      const { token, account, profile } = params;
      if (account?.provider === "google") {
        const email = profile?.email?.toLowerCase();
        await connectToDatabase();
        const dbUser = email ? await User.findOne({ email }) : null;
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
        return token;
      }
      return authConfig.callbacks!.jwt!(params);
    },
  },
});
