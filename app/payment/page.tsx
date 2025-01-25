'use client';

import React, { useEffect, useState, useRef } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createPaymentIntent } from '@/app/services/stripe/stripe';
import PaymentForm from '@/app/components/stripe/PaymentForm';
import { useShippingAddress } from '@/app/provider/shipping-address-provider';
import { PaymentFormPropsDto } from '@/app/interface/stripe/PaymentFormPropsDto';

if (!process.env.STRIPE_PUBLIC_KEY) {
    throw new Error('La clé publique Stripe est manquante');
}

const stripePromise : Promise<Stripe | null> = loadStripe(process.env.STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [clientSecret, setClientSecret] = useState('');
    const { shippingAddress } = useShippingAddress();
    const intentRequestPending = useRef(false);

    useEffect(() => {
        if (!shippingAddress) {
            router.push('/shipping');
            return;
        }

        const createIntent = async () => {
            if (session?.user?.id && !intentRequestPending.current && !clientSecret) {
                intentRequestPending.current = true;
                try {
                    const secret : string | null = await createPaymentIntent(session.user.id);
                    if (secret) {
                        setClientSecret(secret);
                    } else {
                        console.error("Pas de secret retourné");
                        router.push('/recap-cart');
                    }
                } catch (error) {
                    console.error("Erreur lors de la création de l'intention de paiement:", error);
                    router.push('/recap-cart');
                } finally {
                    intentRequestPending.current = false;
                }
            }
        };

        createIntent();
    }, [session, router, shippingAddress]);

    if (!clientSecret || !shippingAddress) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    const paymentFormProps: PaymentFormPropsDto = {
        clientSecret,
        userId: session?.user?.id || '',
        shippingAddress: shippingAddress
    };
    if (!clientSecret) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Chargement du paiement...</p>
            </div>
        );
    }

    if (!session || !session.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Veuillez vous connecter pour effectuer un paiement.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primaryBackgroundColor flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 md:p-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-darkActionColor">Paiement</h1>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h2 className="font-semibold text-gray-700">Adresse de livraison :</h2>
                        <p className="mt-2">{shippingAddress.name}</p>
                        <p>{shippingAddress.address}</p>
                        {shippingAddress.additionalAddress && (
                            <p className="text-sm text-gray-600">{shippingAddress.additionalAddress}</p>
                        )}
                        <p>{shippingAddress.zipCode} {shippingAddress.city}</p>
                        <p className="text-sm text-gray-600">{shippingAddress.phoneNumber}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm {...paymentFormProps} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}