'use client';

import React, { useState, useContext } from "react";
import { requestPasswordReset } from "@/app/services/user/user"; 
import { useRouter } from "next/navigation";
import { ToastContext } from "@/app/provider/toastProvider"; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const { show } = useContext(ToastContext); 
  const router = useRouter();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await requestPasswordReset(email);
      
      show("Succès", "Un e-mail de réinitialisation a été envoyé. Vérifiez votre boîte de réception.", "success");
      
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        show("Erreur", error.message, "error"); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor overflow-hidden">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-4xl mx-4 p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
        
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-darkActionColor mb-4">Réinitialiser votre mot de passe</h1>
          <p className="text-gray-600 mb-6">
            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.
          </p>
          <img src="/images/forgot_password.svg" alt="Reset Password" className="w-full h-auto max-w-full"/>
        </div>

        <div className="md:w-1/2 bg-gray-50 rounded-md p-6 space-y-6">
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail :</label>
              <input 
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Entrez votre email"
                className="mt-2 px-3 py-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-actionColor hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150"
            >
              {isLoading ? "Envoi en cours..." : "Envoyer l'email de réinitialisation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
