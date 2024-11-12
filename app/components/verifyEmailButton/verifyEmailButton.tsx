'use client';

import { useState, startTransition, useContext } from 'react';
import { requestEmailVerification } from '@/app/services/verify-email/verify';
import { ToastContext } from "@/app/provider/toastProvider";

export default function VerifyEmailButton({ userId, email }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { show } = useContext(ToastContext); 

  const handleVerificationRequest = () => {
    setLoading(true);
    setMessage('');

    startTransition(async () => {
      try {
        await requestEmailVerification(userId, email);
        setMessage('Email de vérification envoyé.');
        show("Succès", "Un email de vérification a été envoyé.", "success");
      } catch (error) {
        setMessage("Erreur lors de l'envoi de l'email.");
        show("Erreur", "Erreur lors de l'envoi de l'email de vérification.", "error"); 
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <button
        onClick={handleVerificationRequest}
        disabled={loading}
        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150"
      >
        {loading ? 'Envoi en cours...' : 'Vérifier mon email'}
      </button>
    </div>
  );
}
