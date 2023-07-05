import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import NextAuth, {
  DefaultSession,
  NextAuthOptions,
  getServerSession,
} from "next-auth";
import { GetServerSidePropsContext } from "next";

import db from "@/lib/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { id: string } & DefaultSession["user"];
  }
}

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  theme: {
    logo: "/logo.svg",
    colorScheme: "light",
  },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/login/verify",
    signOut: "/auth/logout",
  },
  providers: [
    EmailProvider({
      id: "email",
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 60, // 1 hour
    }),
  ],
  callbacks: {
    session(params) {
      params.session.user.id = params.token.sub!;
      return params.session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export { authOptions };

export const getServerAuthSession = (
  req?: GetServerSidePropsContext["req"],
  res?: GetServerSidePropsContext["res"]
) =>
  req && res
    ? getServerSession(req, res, authOptions)
    : getServerSession(authOptions);
