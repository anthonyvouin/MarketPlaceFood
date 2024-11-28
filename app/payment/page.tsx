'use client';

import React, { useEffect, useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import { createPaymentIntent } from '@/app/services/stripe/stripe';
import PaymentForm from '@/app/components/stripe/PaymentForm';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);

export default function PaymentPage() {
    const { data: session } = useSession();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const renderCount = useRef(0); 

    useEffect(() => {
        renderCount.current += 1; 

        if (session && renderCount.current === 1) {
            const fetchClientSecret = async () => {
                try {
                    const secret = await createPaymentIntent(session.user.id);
                    setClientSecret(secret);
                } catch (err) {
                    setError('Erreur lors de la récupération du secret de paiement.');
                }
            };

            fetchClientSecret();
        }
    }, [session]); // Dépendance sur `session`

    if (!clientSecret) {
        return (
            <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-gray-700">Chargement du paiement...</p>
            </div>
        );
    }

    return (
        <div className="h-[85vh] bg-primaryBackgroundColor flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 md:p-10">
                {error && <p className="text-lg text-red-500 font-semibold">{error}</p>}
                <h2 className="text-2xl font-bold text-darkActionColor mb-6">Récapitulatif de votre paiement</h2>

                <div className="space-y-4">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm clientSecret={clientSecret} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}
