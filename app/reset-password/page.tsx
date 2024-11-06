'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/user/user"; 

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token manquant. Veuillez vérifier le lien.");
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!token) {
      setMessage("Token invalide.");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setMessage("Mot de passe réinitialisé avec succès.");
      router.push("/login");
    } catch (error) {
      setMessage("Erreur lors de la réinitialisation du mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[85vh] flex items-center justify-center bg-primaryBackgroundColor overflow-hidden">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg max-w-4xl mx-4 p-6 md:p-10 space-y-6 md:space-y-0 md:space-x-10">
        
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-darkActionColor mb-4">Réinitialisation du mot de passe</h1>
          <p className="text-gray-600 mb-6">
            Entrez un nouveau mot de passe pour réinitialiser votre compte.
          </p>
          <img src="/images/reset_password.svg" alt="Reset Password" className="w-full h-auto max-w-full"/>
        </div>

        <div className="md:w-1/2 bg-gray-50 rounded-md p-6 space-y-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau mot de passe :</label>
              <input 
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Entrez votre nouveau mot de passe"
                className="mt-2 px-3 py-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-actionColor hover:bg-darkActionColor text-white font-semibold rounded-md shadow-md transition ease-in-out duration-150"
            >
              {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
          
          {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
}
