import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { sendWelcomeEmail } from "@/app/services/mail/email";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

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
            emailVerified: user.emailVerified, 
            isGoogleUser: false,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(JWT_SECRET);

          return { ...user, jwt: jwtToken };
        }
        return null;
      },
    }),

    // Fournisseur de connexion avec Google
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
      if (user) {
        if (account?.provider === "google") {
          const googleUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (googleUser) {
            token.id = googleUser.id;
            token.email = googleUser.email;
            token.role = googleUser.role;
            token.emailVerified = true;
            token.isGoogleUser = true; 

            token.jwt = await new SignJWT({
              id: googleUser.id,
              email: googleUser.email,
              role: googleUser.role,
              emailVerified: true, 
              isGoogleUser: true,
            })
              .setProtectedHeader({ alg: "HS256" })
              .setExpirationTime("1h")
              .sign(JWT_SECRET);
          }
        } else {
          token.id = user.id;
          token.email = user.email;
          token.role = user.role;
          token.emailVerified = user.emailVerified; // On garde la valeur de emailVerified
          token.isGoogleUser = false; // Utilisateur classique, donc isGoogleUser = false

          // Générer un nouveau JWT pour l'utilisateur classique
          token.jwt = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified, // Utiliser la vérification d'email de l'utilisateur classique
            isGoogleUser: false, // Utilisateur classique, donc isGoogleUser = false
          })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(JWT_SECRET);
        }
      }

      return token; // Retourne le token mis à jour
    },

    // Gère la session en ajoutant les données du token dans la session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.emailVerified = token.emailVerified; // Inclure emailVerified
      session.user.isGoogleUser = token.isGoogleUser; // Inclure isGoogleUser
      session.user.jwt = token.jwt;  // Ajoute le JWT dans la session
      console.log("Session:", session);
      return session;
    },

    // Gère l'événement de connexion, notamment pour envoyer un email de bienvenue
    async signIn({ user, account }) {
      if (account && account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await sendWelcomeEmail(user.email, user.name, user.token || "Utilisateur");
        }
      }
      return true;
    },
  },
};
