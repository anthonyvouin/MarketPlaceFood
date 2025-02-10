'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmail } from "@/app/services/verify-email/verify";

const VerifyEmailPage = ({ searchParams }) => {
    const { token } = searchParams;
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        hasRun.current = true;

        if (!token) {
            setLoading(false);
            setErrorMessage('Token de vérification manquant.');
            return;
        }

        const verifyEmailToken = async () => {
            try {
                await verifyEmail(token);
                setVerified(true);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrorMessage(`Erreur lors de la vérification de l'email : ${error.message}`);
                } else {
                    setErrorMessage('Erreur inconnue lors de la vérification de l\'email.');
                }
            } finally {
                setLoading(false);
            }
        };

        verifyEmailToken();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-primaryBackgroundColor overflow-hidden">
            <div className="bg-white shadow-lg rounded-lg max-w-md mx-4 p-6">
                <h1 className="text-3xl font-semibold text-darkActionColor mb-6 text-center">
                    Vérification de votre email

                </h1>

                <div className="mb-6">
                    <img
                        src="/images/email.svg"
                        alt="Vérification d'email"
                        className="w-full h-auto"
                    />
                </div>

                {loading ? (
                    <p className="text-xl text-gray-600 text-center">Chargement...</p>
                ) : verified ? (
                    <p className="text-xl text-green-600 text-center">Votre email a été vérifié avec succès !</p>
                ) : (
                    <p className="text-xl text-red-600 text-center">{errorMessage}</p>
                )}

                <button
                    onClick={() => router.push('/login')}
                    className="w-full py-3 bg-actionColor hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150 mt-6"
                >
                   Se connecter
                </button>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
