import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';  // Pour générer un ID de session unique

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
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

        if (!user) {
          throw new Error("Aucun utilisateur trouvé");
        }

        const isPasswordValid = await bcrypt.compare(credentials!.password, user.password!);

        if (!isPasswordValid) {
          throw new Error("Mot de passe incorrect");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (credentials) {
       const accountExists = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: 'credentials',
              providerAccountId: user.id,
            },
          },
        });

        if (!accountExists) {
          await prisma.account.create({
            data: {
              userId: user.id,
              type: 'credentials',
              provider: 'credentials',
              providerAccountId: user.id,
              access_token: null,
              refresh_token: null,
              token_type: null,
            },
          });
        }

        const sessionToken = uuidv4(); 
        const expires = new Date();
        expires.setDate(expires.getDate() + 30); 

        await prisma.session.create({
          data: {
            sessionToken: sessionToken,
            userId: user.id,
            expires: expires,
          },
        });

        return { sessionToken }; 
      }

      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;  
      }

      console.log("Session: ", session);

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  
      }
      return token;
    },
  },
};
