import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { sendWelcomeEmail } from "@/app/services/mail/email";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET 
);

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (
          user &&
          user.password &&
          credentials &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          const jwtToken = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(JWT_SECRET);

          return { ...user, jwt: jwtToken };
        }
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      let newTokenGoogle: string = "";

      if (account && account?.provider === "google" && user) {
        const googleUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (googleUser) {
          newTokenGoogle = await new SignJWT({
            id: googleUser.id,
            email: googleUser.email,
            role: googleUser.role,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(JWT_SECRET);
        }
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; 
        token.jwt =
          account && account?.provider === "google" ? newTokenGoogle : user.jwt;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role; 
      session.user.jwt = token.jwt;
      return session;
    },

    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await sendWelcomeEmail(user.email, user.name || "Utilisateur");
        }
      }

      return true;
    },
  },
};
