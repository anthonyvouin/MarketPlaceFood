'use server';
import {Prisma, PrismaClient} from "@prisma/client";
import {UserDto} from "@/app/interface/user/userDto";
import bcrypt from 'bcrypt';
import { UserRegisterDto } from "@/app/interface/user/useRegisterDto";

const prisma = new PrismaClient();
export type UserWithAdress = Prisma.UserGetPayload<{
    include: { addresses: true }
}>;


export async function getUserById(id: string): Promise<UserWithAdress | null> {
    try {
        return await prisma.user.findUnique({
            where: {id},
            include: {addresses: true}
        });

    } catch (e) {
        throw new Error(`La récupération de l'utilisateur a échoué`);
    }

}

export async function updateUser(user: UserDto) {
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

        const userDto: UserDto = {
            id: updatedUser.id || undefined,
            name: updatedUser.name,
            email: updatedUser.email,   
            emailVerified: updatedUser.emailVerified,
            image: updatedUser.image,   
            addresses: updatedUser.addresses || [],
        };
        return userDto

    } catch (e) {
        throw new Error(`La mise à jour de l'utilisateur a échouée`);
    }


}



export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        throw new Error("Tous les champs sont obligatoires.");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error('Cet utilisateur existe déjà.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UserRegisterDto = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            emailVerified: null,
            image: null,
        },
    });

    return newUser; 
}