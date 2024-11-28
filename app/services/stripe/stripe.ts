'use server'

import Stripe from 'stripe';
import { getClientCart } from '@/app/services/cart/cart';
import { CartDto } from '@/app/interface/cart/cartDto';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    
    apiVersion: '2022-11-15',
});

export async function createPaymentIntent(userId: string) {
    const cart: CartDto | null = await getClientCart(userId);

    if (!cart || cart.cartItems.length === 0) {
        throw new Error('Votre panier est vide.');
    }

    const totalAmount = cart.totalPrice;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount, 
            currency: 'eur', 
            metadata: {
                integration_check: 'accept_a_payment',
            },
        });

        return paymentIntent.client_secret;
    } catch (error) {
        console.error('Erreur lors de la création du PaymentIntent :', error);
        throw new Error('Erreur lors de la création du paiement.');
    }
}
