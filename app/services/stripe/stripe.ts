'use server';

import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getClientCart } from '@/app/services/cart/cart';
import { CartDto, CartItemDto } from '@/app/interface/cart/cartDto';

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
        const paymentIntent = await stripe.paymentIntents.create({
            amount: cart.totalPrice, 
            currency: 'eur',
            metadata: {
                integration_check: 'accept_a_payment',
            },
        });

        await saveOrder(userId, cart.totalPrice, cart.cartItems); 

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
                status: 'completed', 
                orderItems: {
                    create: cartItems.map((item) => ({
                        productId: item.product.id,
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