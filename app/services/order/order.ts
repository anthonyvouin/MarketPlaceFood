'use server';

import { Order, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw new Error('Erreur lors de la récupération des commandes');
  }
}

export async function getPayedAllOrders(): Promise<Order[]> {

  return prisma.order.findMany({
    where: { status: 'PAYMENT_SUCCEDED' },
    include: {
      orderItems: true
    }
  });
}

