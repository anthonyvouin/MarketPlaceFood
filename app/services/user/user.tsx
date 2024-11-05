'use server';
import {Prisma, PrismaClient} from "@prisma/client";
import {UserDto} from "@/app/interface/user/userDto";
import bcrypt from 'bcrypt';
import {UserRegisterDto} from "@/app/interface/user/useRegisterDto";
import {verifyAuth} from "@/app/core/verifyAuth";
import {sendWelcomeEmail} from "../mail/email";
import {UpdatePasswordDto} from "@/app/interface/user/userPasswordDto";

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