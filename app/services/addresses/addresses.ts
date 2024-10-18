"use server"
import {AddressDto} from "@/app/interface/address/addressDto";
import {prisma} from "@/lib/db";

export async function createAddress(address: AddressDto): Promise<AddressDto> {
    const allAddresses: AddressDto[] = await prisma.address.findMany({
        where: {
            userId: address.userId
        },
    });

    if (allAddresses && allAddresses.length === 0) {
        address.isPrincipal = true
    }


    try {
        return await prisma.address.create({
            data: {
                ...address,
            },
        });
    } catch (error: any) {

        throw new Error(`erreur lors de l'enregistrement de l'adresse`);
    }
}

export async function getAdressById(addressId: string, userId: string): Promise<AddressDto> {
    const address: AddressDto | null = await prisma.address.findFirst({
        where: {
            userId,
            id: addressId
        },
    });

    if (!address) {
        throw new Error(`Aucune addresse trouvée`);
    }

    return address;
}

export async function updateAdress(address: AddressDto): Promise<AddressDto> {
    return prisma.address.update({
        where: {
            id: address.id,
        },

        data: {
            ...address
        },

    });

}

export async function deleteAdress(id: string): Promise<AddressDto> {
    return prisma.address.delete({
        where: {id}
    })
}