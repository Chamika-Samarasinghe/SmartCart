import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

// This config must stay free of Node.js-only imports (no Prisma) because
// it is imported by middleware which runs in the Edge runtime.
export const authConfig: NextAuthConfig = {
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Facebook({ allowDangerousEmailAccountLinking: true }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/cart") ||
        nextUrl.pathname.startsWith("/admin");
      if (isProtectedRoute && !isLoggedIn) {
        const signInUrl = new URL("/signin", nextUrl);
        signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(signInUrl);
      }
      return true;
    },
  },
};
