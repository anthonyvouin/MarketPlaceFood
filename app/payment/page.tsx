// app/payment/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        if (session?.user?.id) {
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
    }, [session]);

    if (!clientSecret) {
        return <p>Chargement du paiement...</p>;
    }

    return (
        <div className="payment-page">
            {error && <p className="error-message">{error}</p>}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <h2>Paiement</h2>
                <PaymentForm clientSecret={clientSecret} />  {/* Utilisation du composant PaymentForm */}
            </Elements>
        </div>
    );
}
