import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import WebAuthn from "next-auth/providers/webauthn";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/db";

// Pin the RP origin explicitly so options generation and callback verification
// always use the same value. In dev this must match the browser's page origin
// (http://localhost:3000), NOT the https:// Next.js sees internally via x-forwarded-proto.
const _authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
const rpOrigin = _authUrl
  ? new URL(_authUrl).origin
  : process.env.NODE_ENV === "production"
    ? (() => { throw new Error("Set AUTH_URL in production") })()
    : "http://localhost:3000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    WebAuthn({
      relayingParty: {
        id: new URL(rpOrigin).hostname,
        name: "SmartCart",
        origin: rpOrigin,
      },
      // "preferred" lets the browser use UV when available but doesn't fail
      // if the authenticator skips it (e.g. Google Password Manager sync passkeys).
      registrationOptions: {
        authenticatorSelection: { userVerification: "preferred" },
      },
      verifyRegistrationOptions: { requireUserVerification: false },
      verifyAuthenticationOptions: { requireUserVerification: false },
    }),
  ],
  session: { strategy: "jwt" },
  experimental: { enableWebAuthn: true },
  logger: {
    error(err) {
      const cause = (err as any).cause;
      console.error("[Auth.js error]", err.name, "-", err.message);
      if (cause) console.error("[Auth.js cause]", cause instanceof Error ? cause.message : cause);
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // On first sign-in the adapter has already persisted the user; look up the DB id + role.
      if (user?.email && account) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role as "USER" | "ADMIN";
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      if (token.role) session.user.role = token.role as "USER" | "ADMIN";
      return session;
    },
  },
});
