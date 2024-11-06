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
            throw new Error("Seuls les utilisateurs classiques peuvent changer leur mot de passe.");
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

    } catch (error: any) {
        throw new Error(error.message || "Erreur lors de la mise à jour du mot de passe.");
    }
}


export async function requestPasswordReset(email: string) {
    try {
      // Vérification de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        throw new Error("Utilisateur non trouvé.");
      }
  
      // Création du token
      const token: string = crypto.randomBytes(32).toString('hex');
      const hashedToken: string = await bcrypt.hash(token, 10);
  
      // Définition de l'expiration du token
      const tokenExpiration: Date = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

      if (!hashedToken || !tokenExpiration) {
        throw new Error("Token ou expiration manquants.");
      }
      
  
      // Mise à jour de l'utilisateur avec le token et son expiration
      await prisma.user.update({
        where: { email },
        data: {
          resetToken: hashedToken,
          resetTokenExpires: tokenExpiration,
        },
      });
  
      // Envoi de l'email de réinitialisation
      await sendPasswordResetEmail(email, token);
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation du mot de passe:", error);
    }
  }


  export async function resetPassword(token: string, newPassword: string) {
    try {
      // Recherche de l'utilisateur par token
      const user = await prisma.user.findFirst({
        where: {
          resetToken: {
            not: null,
          },
          resetTokenExpires: {
            gte: new Date(), // Vérifie que le token n'est pas expiré
          },
        },
      });
  
      if (!user) {
        throw new Error("Token invalide ou expiré.");
      }
  
      // Vérification du token avec bcrypt
      const isTokenValid = await bcrypt.compare(token, user.resetToken!);
      if (!isTokenValid) {
        throw new Error("Token invalide.");
      }
  
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Mettre à jour l'utilisateur avec le nouveau mot de passe
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null, // Nettoyage du token après utilisation
          resetTokenExpires: null,
        },
      });
  
      console.log("Mot de passe réinitialisé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      throw error;
    }
  }