'use client';

import React, { useState, useContext } from 'react';
import { resendVerificationEmail } from '@/app/services/verify-email/verify'; 
import { ToastContext } from '@/app/provider/toastProvider'; 

const ResendVerificationEmailPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { show } = useContext(ToastContext); 

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setErrorMessage('');
    setMessage('');

    try {
      await resendVerificationEmail(email);
      show('Succès', "Un email de vérification a été renvoyé avec succès. Veuillez vérifier votre boîte de réception.", 'success');
    } catch (error) {
      show('Erreur', "Une erreur est survenue. Veuillez réessayer plus tard.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryBackgroundColor overflow-hidden">
      <div className="bg-white shadow-lg rounded-lg max-w-md mx-4 p-6">
        <h1 className="text-3xl font-semibold text-darkActionColor mb-6 text-center">
          Renvoi de l'email de vérification

        </h1>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Entrez votre email pour recevoir le lien de vérification :
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-2 p-2 w-full border border-gray-300 rounded-md"
            placeholder="email@example.com"
            required
          />
        </div>

    

        <button
          onClick={handleResendEmail}
          className="w-full py-3 bg-actionColor hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150 mt-6"
          disabled={loading}
        >
          {loading ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
        </button>
      </div>
    </div>
  );
};

export default ResendVerificationEmailPage;
