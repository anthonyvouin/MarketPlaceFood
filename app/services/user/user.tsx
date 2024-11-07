'use server';
import {Prisma, PrismaClient} from "@prisma/client";
import {UserDto} from "@/app/interface/user/userDto";
import bcrypt from 'bcrypt';
import {UserRegisterDto} from "@/app/interface/user/useRegisterDto";
import {verifyAuth} from "@/app/core/verifyAuth";
import {sendWelcomeEmail} from "../mail/email";
import {UpdatePasswordDto} from "@/app/interface/user/userPasswordDto";
import {sendPasswordResetEmail} from "@/app/services/mail/email";
import crypto from 'crypto';
import { UserWithResetToken } from "@/app/interface/user/resetPasswordDto";
import { PasswordResetData } from "@/app/interface/user/passwordResetDataDto";

const prisma = new PrismaClient();
export type UserWithAdress = Prisma.UserGetPayload<{
    include: { addresses: true }
}>;


export async function getUserById(id: string): Promise<UserWithAdress | null> {

    try {
        await verifyAuth();
        return await prisma.user.findUnique({
            where: {id},
            include: {addresses: true}
        });

    } catch (e) {
        throw new Error(`La récupération de l'utilisateur a échoué`);
    }

}

export async function updateUser(user: UserDto): Promise<UserDto> {
    if (!user.id) {
        throw new Error(`L'ID de l'utilisateur est requis pour la mise à jour.`);
    }

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


}

export async function createUser(email: string, name: string, password: string): Promise<UserRegisterDto> {
    try {
        const hashedPassword: string = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "USER"
            },
        });


        await sendWelcomeEmail(user.email!, user.name!);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            emailVerified: user.emailVerified,
            image: user.image,
            role: user.role,
        };

    } catch (error) {
        throw new Error("Erreur lors de la création de l'utilisateur.");
    }
}

export async function updatePassword({userId, oldPassword, newPassword}: UpdatePasswordDto) {
  try {
      await verifyAuth(["USER", "ADMIN"]);

      if (!userId) {
          throw new Error("L'ID utilisateur est requis pour mettre à jour le mot de passe.");
      }

      const user = await prisma.user.findUnique({
          where: {id: userId},
      });

      if (!user || !user.password) {
          throw new Error("");
      }

      const isOldPasswordValid: boolean = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
          throw new Error("L'ancien mot de passe est incorrect.");
      }

      const isSameAsOldPassword: boolean = await bcrypt.compare(newPassword, user.password);
      if (isSameAsOldPassword) {
          throw new Error("Le nouveau mot de passe doit être différent de l'ancien mot de passe.");
      }

      const hashedPassword: string = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
          where: {id: userId},
          data: {password: hashedPassword},
      });

      return {message: "Mot de passe mis à jour avec succès."};

  } catch (error: unknown) {
      if (error instanceof Error) {
          throw new Error(error.message);
      }
      throw new Error("Une erreur est survenue lors de la mise à jour du mot de passe.");
  }
}



export async function requestPasswordReset(email: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    const token: string = crypto.randomBytes(32).toString('hex');
    const hashedToken: string = await bcrypt.hash(token, 10);

    const tokenExpiration: Date = new Date(Date.now() + 60 * 60 * 1000); 
    if (!hashedToken || !tokenExpiration) {
      throw new Error("Token ou expiration manquants.");
    }

    const resetData: PasswordResetData = {
      resetToken: hashedToken,
      resetTokenExpires: tokenExpiration,
    };

    await prisma.user.update({
      where: { email },
      data: resetData,
    });

    await sendPasswordResetEmail(email, token);
  } catch (error) {
    throw error; 
  } 
}





export async function resetPassword(token: string, newPassword: string): Promise<void> {
  try {   

    const user: UserWithResetToken | null = await prisma.user.findFirst({
      
      where: {
        resetToken: {
          not: null,  
        },
        resetTokenExpires: {
          gte: new Date(),  
        },
      },
    });

    if (!user) {
      throw new Error("Token invalide ou expiré.");
    }

    const isTokenValid = await bcrypt.compare(token, user.resetToken);
    if (!isTokenValid) {
      throw new Error("Token invalide.");
    }

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,  
        resetToken: null,  
        resetTokenExpires: null,  
      },
    });

  } catch (error) {
    throw error;  
  }
}