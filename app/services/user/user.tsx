'use server';
import {Prisma, PrismaClient} from "@prisma/client";
import {UserDto} from "@/app/interface/user/userDto";

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
