"use server";

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendVerificationEmail } from '../mail/email';
const prisma = new PrismaClient();




export async function requestEmailVerification(userId: string, email: string): Promise<void> {

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        emailVerified: true, 
        verificationTokenEmail: true, 
        verificationTokenExpiresEmail: true 
      },
    }).catch((error) => {
      console.error("Erreur lors de la recherche de l'utilisateur : ", error);
      throw new Error("Une erreur est survenue lors de la recherche de l'utilisateur.");
    })

    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    if (user.emailVerified !== null) {
      throw new Error("Cet email est déjà vérifié.");
    }

    const currentTime = new Date();
    if (user.verificationTokenEmail && user.verificationTokenExpiresEmail && user.verificationTokenExpiresEmail > currentTime) {
      throw new Error("Une demande de vérification est déjà en cours, veuillez attendre avant de redemander.");
    }

    const token: string = crypto.randomBytes(32).toString('hex');
    const tokenExpiration: Date = new Date(Date.now() + 60 * 60 * 1000); 

    const verificationData = {
      verificationTokenEmail: token,
      verificationTokenExpiresEmail: tokenExpiration,
    };

    await prisma.user.update({
      where: { id: userId },
      data: verificationData,
    });

    await sendVerificationEmail(email, token);

  } 







export async function verifyEmail(token: string): Promise<void> {
  try {
      console.log("Recherche de l'utilisateur avec le token de vérification d'email:", token);

      const user = await prisma.user.findFirst({
          where: {
              verificationTokenEmail: token,
              verificationTokenExpiresEmail: {
                  gte: new Date(),  
              }
          }
      });

      if (!user) {
          throw new Error("Token invalide ou expiré.");
      }

      await prisma.user.update({
          where: { id: user.id },
          data: {
              emailVerified: new Date(),
              verificationTokenEmail: null,         
              verificationTokenExpiresEmail: null, 
          }
      });

      console.log("Email vérifié avec succès pour l'utilisateur:", user.email);

  } catch (error: unknown) {
      console.error("Erreur dans la vérification de l'email:", error);

      if (error instanceof Error) {
          throw new Error(error.message);
      }
      throw new Error("Une erreur est survenue lors de la vérification de l'email. Veuillez réessayer.");
  }
}

