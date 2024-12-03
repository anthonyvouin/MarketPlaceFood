'use server';

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getClientCart } from '@/app/services/cart/cart';
import { CartDto } from '@/app/interface/cart/cartDto';
import { CartItemDto } from '@/app/interface/cart/cart-item.dto';
import { OrderDto } from '@/app/interface/order/orderDto';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15' as any,
});
const prisma = new PrismaClient();

export async function createPaymentIntent(userId: string) {
    const cart: CartDto | null = await getClientCart(userId);

    if (!cart || cart.cartItems.length === 0) {
        throw new Error('Votre panier est vide.');
    }

    try {
        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
            amount: cart.totalPrice, 
            currency: 'eur',
            metadata: {
                integration_check: 'accept_a_payment',
            },
        });

        await saveOrder(userId, cart.totalPrice, cart.cartItems); 

        await deleteCart(userId);


        return paymentIntent.client_secret;
    } catch (error) {
        console.error('Erreur lors de la création du PaymentIntent :', error);
        throw new Error('Erreur lors de la création du paiement.');
    }
}

async function saveOrder(userId: string, totalAmount: number, cartItems: CartItemDto[]) {
    try {
        await prisma.order.create({
            data: {
                userId: userId,
                totalAmount: totalAmount,
                status: 'Payed', 
                orderItems: {
                    create: cartItems.map((item) => ({
                        product: {
                            connect: { id: item.product.id }, 
                        },
                        quantity: item.quantity,
                        unitPrice: item.product.price,
                        totalPrice: item.totalPrice,
                    })),
                },
            },
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la commande :', error);
        throw new Error('Erreur lors de la sauvegarde de la commande.');
    }
}


export async function getOrdersByUser(userId: string): Promise<OrderDto[]> {
    try {
        const orders = await prisma.order.findMany({
            where: { userId }, 
            include: {
                orderItems: {
                    include: {
                        product: true, 
                    },
                },
            },
            orderBy: { createdAt: 'desc' }, 
        });

        return orders;
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
        throw new Error('Erreur lors de la récupération des commandes.');
    }
}


async function deleteCart(userId: string) {
    try {
        await prisma.cartItem.deleteMany({
            where: {
                cartId: {
                    in: await prisma.cart.findMany({
                        where: { userId },
                        select: { id: true }
                    }).then(carts => carts.map(cart => cart.id)),
                }
            }
        });

        await prisma.cart.deleteMany({
            where: {
                userId: userId,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du panier :', error);
        throw new Error('Erreur lors de la suppression du panier.');
    }
}