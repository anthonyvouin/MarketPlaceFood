'use server';
import {PrismaClient} from "@prisma/client";
import {DiscountDto} from "@/app/interface/discount/discountDto";

const prisma = new PrismaClient();

export async function createDiscount(discount: DiscountDto): Promise<DiscountDto> {
    if (!discount.name || discount.name.trim() === '') {
        throw new Error('Le nom de la remise est requis et doit être une chaîne de caractères non vide.');
    }

    try {
        return await prisma.discount.create({
            data: {
                name: discount.name,
                rate: discount.rate,
                visible: true
            },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error('Une remise avec ce nom existe déjà.');
        }
        throw new Error('La création de la remise a échoué');
    }
}

export async function getAllDiscount(): Promise<DiscountDto[]> {
    return prisma.discount.findMany({
        orderBy: {
            name: 'asc',
        }
    });
}
