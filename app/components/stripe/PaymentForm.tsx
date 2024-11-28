// app/payment/components/PaymentForm.tsx
'use client'

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface PaymentFormProps {
    clientSecret: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements) {
            setError("Stripe n'a pas été chargé correctement.");
            setProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setError("L'élément de la carte de crédit est introuvable.");
            setProcessing(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            setError(error.message || 'Une erreur est survenue lors du paiement.');
        } else if (paymentIntent?.status === 'succeeded') {
            setSucceeded(true);
        }

        setProcessing(false);
    };

    return (
        <div>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="card-element">Carte de crédit</label>
                    <div id="card-element">
                        <CardElement />
                    </div>
                </div>
                <button type="submit" disabled={processing || succeeded}>
                    {processing ? 'Traitement...' : 'Payer'}
                </button>

                {succeeded && <p>Paiement réussi !</p>}
            </form>
        </div>
    );
};

export default PaymentForm;
