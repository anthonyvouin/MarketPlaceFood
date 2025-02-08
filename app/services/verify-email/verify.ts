'use server';

import { PrismaClient, User } from '@prisma/client';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../mail/email';

const prisma = new PrismaClient();

export async function verifyEmail(token: string): Promise<void> {

  const user: User | null = await prisma.user.findFirst({
      where: {
        verificationTokenEmail: token,
        verificationTokenExpiresEmail: {
          gte: new Date(),
        }
      }
    }).catch((error) => {
      console.error('Erreur lors de la recherche de l\'utilisateur : ', error);
      throw new Error('Une erreur est survenue lors de la recherche de l\'utilisateur.');
    })
  ;

  console.log('Utilisateur trouvé :', user);

  if (!user) {
    throw new Error('Token invalide ou expiré.');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationTokenEmail: null,
      verificationTokenExpiresEmail: null,
    }
  });

  console.log('Email vérifié avec succès pour l\'utilisateur:', user.email);

}

export async function resendVerificationEmail(email: string): Promise<void> {
  const user: User | null = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé.');
  }

  const token: string = crypto.randomBytes(32).toString('hex');
  const tokenExpiration: Date = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      verificationTokenEmail: token,
      verificationTokenExpiresEmail: tokenExpiration,
    },
  });

  await sendWelcomeEmail(email, user.name || 'Utilisateur', token, false);

  console.log(`Email de vérification envoyé à ${email}`);
}