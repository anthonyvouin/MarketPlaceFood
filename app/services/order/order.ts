'use server';

import { Order, OrderItem, PrismaClient, Product, User } from '@prisma/client';
import { PrepOrderItemsDto } from '@/app/admin/prep-order/[id]/prep-order-item.dto';
import { StatusEnum } from '@interface/order/orderDto';
import { sendEmailSendOrder } from '@services/mail/email';
import { verifyAuth } from '@/app/core/verifyAuth';

const prisma = new PrismaClient();

export async function getAllOrders() {
  await verifyAuth(['ADMIN']);
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
      orderBy:{createdAt:'desc'}
    });

    return orders;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw new Error('Erreur lors de la récupération des commandes');
  }
}

export async function getPayedAndPreparedOrders(): Promise<Order[]> {
  await verifyAuth(['ADMIN', 'STOREKEEPER']);
  return prisma.order.findMany({
    where: {
      OR: [
        { status: StatusEnum.PAYMENT_SUCCEDED },
        { status: StatusEnum.PREPARING }
      ]
    },
    include: {
      orderItems: true
    }
  });
}

export async function getOrderById(id: string): Promise<PrepOrderItemsDto[]> {
  await verifyAuth(['ADMIN', 'STOREKEEPER']);
  return prisma.orderItem.findMany({
    where: {
      orderId: id
    },
    include: {
      product: true
    }
  });
}

export async function changeStatusOrder(id: string, status: StatusEnum): Promise<void> {
  await verifyAuth(['ADMIN', 'STOREKEEPER']);
  const order: (Order & {
    user: User;
    orderItems: (OrderItem & { product: Product })[];
  }) | null = await prisma.order.findFirst({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status, sendAt: new Date() }
    });

    if (status === StatusEnum.SEND && order.user && order.user.email) {
      await sendEmailSendOrder(order.user.email, { orderNumber: order.id, totalAmount: order.totalAmount, products: order.orderItems });
    }
  }
}

export async function changeIsPrep(id: string, orderId: string, isPrep: boolean): Promise<void> {
  await verifyAuth(['ADMIN', 'STOREKEEPER']);
  await prisma.orderItem.update({
    where: { id },
    data: { isPrep }
  });

  const order: Order | null = await prisma.order.findFirst({
    where: { id: orderId }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status === StatusEnum.PAYMENT_SUCCEDED) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: StatusEnum.PREPARING }
    });
  }
}