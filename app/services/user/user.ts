'use server';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { UserDto } from '@/app/interface/user/userDto';
import bcrypt from 'bcrypt';
import { UserRegisterDto } from '@/app/interface/user/useRegisterDto';
import { verifyAuth } from '@/app/core/verifyAuth';
import { sendWelcomeEmail } from '../mail/email';
import { UpdatePasswordDto } from '@/app/interface/user/userPasswordDto';
import { sendPasswordResetEmail } from '@/app/services/mail/email';
import crypto from 'crypto';
import { PasswordResetData } from '@/app/interface/user/passwordResetDataDto';

const prisma = new PrismaClient();
export type UserWithAdress = Prisma.UserGetPayload<{
  include: { addresses: true }
}>;

export async function getUserById(id: string): Promise<UserWithAdress | null> {
  const verify = await verifyAuth(['USER', 'ADMIN', 'STOREKEEPER']);

  if (verify && verify.user.id === id) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          addresses: true,
        },
      });
    } catch (e: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', e);
      throw new Error(`La récupération de l'utilisateur a échoué : ${e.message}`);
    }
  } else {
    throw new Error(`userId and token user are differents`);
  }
}

export async function updateUser(user: UserDto): Promise<UserDto> {
  if (!user.id) {
    throw new Error(`L'ID de l'utilisateur est requis pour la mise à jour.`);
  }

  const verify = await verifyAuth(['USER', 'ADMIN']);

  if (verify && verify.user.id === user.id) {
    try {
      const updatedUser: UserDto = await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          name: user.name,
        },
        include: {
          addresses: true,
        },
      });

      return {
        id: updatedUser.id || undefined,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        addresses: updatedUser.addresses || [],
        role: updatedUser.role,
      };

    } catch (e) {
      throw new Error(`La mise à jour de l'utilisateur a échouée`);
    }
  } else {
    throw new Error(`userId and token user are differents`);
  }
}

export async function createUser(email: string, name: string, password: string): Promise<UserRegisterDto> {
  try {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const token: string = crypto.randomBytes(32).toString('hex');
    const tokenExpiration: Date = new Date(Date.now() + 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'USER',
        verificationTokenEmail: token,
        verificationTokenExpiresEmail: tokenExpiration
      },
    });

    await sendWelcomeEmail(user.email!, user.name!, token, false);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
    };
  } catch (error: unknown) {

    if (error instanceof Error && (error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
      throw new Error('Cet email est déjà utilisé.');

    } else {
      console.error('Erreur lors de la création de l\'utilisateur : ', error);
      throw new Error('Erreur lors de la création de l\'utilisateur. Veuillez réessayer plus tard.');
    }
  }
}

export async function updatePassword({ userId, oldPassword, newPassword }: UpdatePasswordDto) {
  try {
    const verify = await verifyAuth(['USER', 'ADMIN']);

    if (!userId) {
      throw new Error('L\'ID utilisateur est requis pour mettre à jour le mot de passe.');
    }

    if (verify && verify.user.id === userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé.');
      }

      if (!user.password) {
        throw new Error('Ce compte est associé à Google. Veuillez gérer le mot de passe depuis votre compte Google.');
      }

      const isOldPasswordValid: boolean = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new Error('L\'ancien mot de passe est incorrect.');
      }

      const isSameAsOldPassword: boolean = await bcrypt.compare(newPassword, user.password);
      if (isSameAsOldPassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'ancien mot de passe.');
      }

      const hashedPassword: string = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Mot de passe mis à jour avec succès.' };
    } else {
      throw new Error(`userId and token user are differents`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Une erreur est survenue lors de la mise à jour du mot de passe.');
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé.');
    }

    if (!user.password) {
      throw new Error('Ce compte est associé à Google. Veuillez gérer le mot de passe depuis votre compte Google.');
    }

    const token: string = crypto.randomBytes(32).toString('hex');
    const tokenExpiration: Date = new Date(Date.now() + 60 * 60 * 1000);

    const resetData: PasswordResetData = {
      resetToken: token,
      resetTokenExpires: tokenExpiration,
    };

    if (!resetData.resetToken || !resetData.resetTokenExpires) {
      throw new Error('Token ou expiration manquants.');
    }

    await prisma.user.update({
      where: { email },
      data: resetData,
    });

    await sendPasswordResetEmail(email, token);

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Une erreur est survenue lors de la demande de réinitialisation.');
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {
    const user: User | null = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gte: new Date() },
      },
    });

    if (!user) {
      throw new Error('Token invalide ou expiré.');
    }

    console.log('Hachage du nouveau mot de passe...');
    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    console.log('Mise à jour du mot de passe...');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    console.log('Mot de passe réinitialisé avec succès.');

  } catch (error) {
    console.error('Erreur dans la réinitialisation du mot de passe:', error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer.');
  }
}





















