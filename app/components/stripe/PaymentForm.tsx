'use client';

import React, { useContext, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { useSideBarBasket } from '@/app/provider/sideBar-cart-provider';
import { useCart } from '@/app/provider/cart-provider';
import { PaymentSuccess } from '@/app/services/stripe/stripe';
import { PaymentFormPropsDto } from '@/app/interface/stripe/PaymentFormPropsDto';
import { ToastContext } from '@provider/toastProvider';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';


const PaymentForm: React.FC<PaymentFormPropsDto> = ({ clientSecret, userId, shippingAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router: AppRouterInstance = useRouter();
  const { show } = useContext(ToastContext);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const { setSideBarCart } = useSideBarBasket();
  const { updateProductList } = useCart();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!userId || !stripe || !elements) {
      setError('Erreur : information manquante.');
      setProcessing(false);
      return;
    }

    const cardElement: StripeCardElement | null = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Erreur : Carte non détectée.');
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        show('Paiement', 'Le paiement a échoué ', 'error');
      } else if (paymentIntent?.status === 'succeeded') {
        await PaymentSuccess(userId, shippingAddress);
        show('Paiement', 'Paiement réussi', 'success');
        setSucceeded(true);
        setSideBarCart(null);
        updateProductList(null);
        router.push('/')
      }

    } catch (paymentError) {
      setError('Une erreur inconnue est survenue lors du paiement.');
      console.error(paymentError);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="card-element" className="text-sm font-medium text-gray-700">
            Carte de crédit
          </label>
          <div id="card-element" className="mt-2 p-4 border rounded-md bg-gray-50">
            <CardElement/>
          </div>
        </div>
        <button
          type="submit"
          disabled={processing || succeeded}
          className={`w-full py-2 px-6 rounded-lg shadow-md transition ease-in-out duration-150 ${
            processing || succeeded ? 'bg-gray-300' : 'bg-actionColor hover:bg-darkActionColor'
          } text-white font-semibold`}
        >
          {processing ? 'Traitement...' : 'Payer'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;