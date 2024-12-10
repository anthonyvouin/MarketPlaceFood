"use server";

import { OrderDto } from '@/app/interface/order/orderDto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllOrders(): Promise<OrderDto[]> {
    try {
        const orders: OrderDto[] = await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true, 
                    },
                },
                user: true, 
            },
        });

        console.log("Orders fetched from DB:", orders); 
        return orders;
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        throw new Error('Erreur lors de la récupération des commandes');
    }
}
