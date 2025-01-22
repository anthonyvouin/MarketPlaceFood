'use server';

import Stripe from 'stripe';
import { PrismaClient, StatusOrder } from '@prisma/client';
import {getClientCart} from '@/app/services/cart/cart';
import {CartDto} from '@/app/interface/cart/cartDto';
import {CartItemDto} from '@/app/interface/cart/cart-item.dto';
import {OrderDto} from '@/app/interface/order/orderDto';
import {AddressDto} from '@/app/interface/address/addressDto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15' as any,
});
const prisma = new PrismaClient();

export async function createPaymentIntent(userId: string) {

    const cart : CartDto  | null = await getClientCart(userId);

    if (!cart || cart.cartItems.length === 0) {
        throw new Error('Votre panier est vide.');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Utilisateur introuvable.');
        }

        let stripeCustomerId = user.stripeCustomerId;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
            } as Stripe.CustomerCreateParams);

            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId },
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: cart.totalPrice,
            currency: 'eur',
            customer: stripeCustomerId,
            metadata: {
                integration_check: 'accept_a_payment',
            },
        });

        return paymentIntent.client_secret;

    } catch (error: unknown) {
        console.error('Erreur lors de la création du PaymentIntent :', error);
        throw new Error('Erreur lors de la création du paiement.');
    }
}

export const PaymentSuccess = async (userId: string, shippingAddress: AddressDto) => {
    try {
        const cart = await getClientCart(userId);
        if (!cart) throw new Error('Panier non trouvé');
        if (!cart.id) throw new Error('ID du panier non trouvé');

        await saveOrder(userId, cart.totalPrice, cart.cartItems, shippingAddress);
        await convertCart(cart.id);
        
        return true;
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
    }
};

async function saveOrder(
    userId: string, 
    totalAmount: number, 
    cartItems: CartItemDto[], 
    shippingAddress: AddressDto
) {
    if (!userId) {
        console.error('Erreur : L\'ID utilisateur est manquant.');
        throw new Error('Erreur : L\'ID utilisateur est requis.');
    }

    try {
        await prisma.order.create({
            data: {
                userId: userId,
                totalAmount: totalAmount,
                status: StatusOrder.PAYMENT_PENDING,
                shippingName: shippingAddress.name,
                shippingAddress: shippingAddress.address,
                shippingAddressAdd: shippingAddress.additionalAddress,
                shippingZipCode: shippingAddress.zipCode,
                shippingCity: shippingAddress.city,
                shippingPhoneNumber: shippingAddress.phoneNumber,
                shippingNote: shippingAddress.note,
                orderItems: {
                    create: cartItems.map((item) => ({
                        product: {
                            connect: {id: item.product.id},
                        },
                        quantity: item.quantity,
                        unitPrice: item.product.price,
                        totalPrice: item.totalPrice,
                    })),
                },
            },
        });
    } catch (error: unknown) {
        console.error('Erreur lors de la sauvegarde de la commande :', error);
        throw new Error('Erreur lors de la sauvegarde de la commande.');
    }
}

export async function getOrdersByUser(userId: string): Promise<OrderDto[]> {
    try {
        const orders = await prisma.order.findMany({
            where: {userId},
            select: {
                id: true,
                totalAmount: true,
                status: true,
                createdAt: true,
                shippingName: true,
                shippingAddress: true,
                shippingAddressAdd: true,
                shippingZipCode: true,
                shippingCity: true,
                shippingPhoneNumber: true,
                shippingNote: true,
                orderItems: {
                    select: {
                        quantity: true,
                        unitPrice: true,
                        totalPrice: true,
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {createdAt: 'desc'},
        });

        return orders as unknown as OrderDto[];
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes :', error);
        throw new Error('Erreur lors de la récupération des commandes.');
    }
}

async function convertCart(cartId: string) {
    try {
        await prisma.cart.update({
            where: {
                id: cartId,
            },

            data: {
                isConvertedToOrder: true,
            },
        });

    } catch (error: unknown) {
        console.error('Erreur lors de la suppression du panier :', error);
        throw new Error('Erreur lors de la suppression du panier.');
    }
}