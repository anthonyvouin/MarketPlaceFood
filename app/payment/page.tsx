'use client';

import React, { useEffect, useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSession } from 'next-auth/react';
import { createPaymentIntent } from '@/app/services/stripe/stripe';
import PaymentForm from '@/app/components/stripe/PaymentForm';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!);

export default function PaymentPage() {
    const { data: session, status } = useSession();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const renderCount = useRef(0); 

    useEffect(() => {
        renderCount.current += 1; 
            
    
        if (status === 'authenticated' && renderCount.current === 1 && session && session.user && !clientSecret) {
            const fetchClientSecret = async () => {
                try {
                    const secret = await createPaymentIntent(session.user.id);
                    setClientSecret(secret);  
                } catch (err) {
                    setError('Erreur lors de la récupération du secret de paiement.');
                }
            };
    
            fetchClientSecret(); 
        } else if (status === 'unauthenticated') {
            setError("Veuillez vous connecter pour effectuer un paiement.");
        }
    
    }, [status, session, clientSecret]);  

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primaryBackgroundColor">
                <p className="text-lg font-semibold text-red-500">{error}</p>
            </div>
        );
    }

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
                <h2 className="text-2xl font-bold text-darkActionColor mb-6">Récapitulatif de votre paiement</h2>
                <div className="space-y-4">
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm clientSecret={clientSecret} userId={session.user.id} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}
