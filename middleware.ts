import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the Prisma-free authConfig so this runs safely in the Edge runtime.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/cart/:path*", "/admin/:path*"],
};
