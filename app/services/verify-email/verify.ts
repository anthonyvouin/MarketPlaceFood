"use server";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function verifyEmail(token: string): Promise<void> {

      const user = await prisma.user.findFirst({
          where: {
              verificationTokenEmail: token,
              verificationTokenExpiresEmail: {
                  gte: new Date(),  
              }
          }
      }).catch((error) => {
        console.error("Erreur lors de la recherche de l'utilisateur : ", error);
        throw new Error("Une erreur est survenue lors de la recherche de l'utilisateur.");
      })
  ;

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

  } 