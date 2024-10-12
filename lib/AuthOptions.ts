import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";
import bcrypt from "bcrypt";
import { SignJWT } from 'jose'; // Importation de SignJWT

// Clé secrète pour JWT
const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'votre_secret_de_test');

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && user.password && credentials && await bcrypt.compare(credentials.password, user.password)) {
          const jwtToken = await new SignJWT({ id: user.id, email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(JWT_SECRET);
          
          return { ...user, jwt: jwtToken };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          // Si l'utilisateur n'existe pas, le créer
          user = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
            },
          });
        }

        // Créer un token JWT pour l'utilisateur Google
        const jwtToken = await new SignJWT({ id: user.id, email: user.email })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('1h')
          .sign(JWT_SECRET);

        // Log de la création du token pour Google
        console.log('JWT Token créé pour le compte Google:', jwtToken);
        return { ...user, jwt: jwtToken };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.jwt = user.jwt;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.jwt = token.jwt;
      return session;
    },
    
  },
};
