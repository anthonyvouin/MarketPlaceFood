'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTotalOrderCount(): Promise<number> {
    try {
        const totalOrderCount: number = await prisma.order.count();

        return totalOrderCount;
    } catch (error) {
        console.error('Erreur lors du comptage total des commandes :', error);
        throw new Error('Erreur lors du comptage des commandes.');
    }
}


export async function getTotalUserCount(): Promise<number> {
    try {
        const totalUserCount: number = await prisma.user.count(); 
        return totalUserCount;
    } catch (error) {
        console.error('Erreur lors du comptage total des utilisateurs :', error);
        throw new Error('Erreur lors du comptage des utilisateurs.');
    }
}


export async function getTotalMoney(): Promise<number> {
    try {
        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                totalAmount: true, 
            },
        });

        return totalRevenue._sum.totalAmount ?? 0; 
    } catch (error) {
        console.error('Erreur lors du calcul du revenu total :', error);
        throw new Error('Erreur lors du calcul du revenu total.');
    }
}
