'use client';

import { useState, useEffect, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/user/user"; 
import { Password } from "primereact/password";
import { ToastContext } from "@/app/provider/toastProvider";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { show } = useContext(ToastContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      show("Erreur", "Token manquant. Veuillez vérifier le lien.", "error");
    }
  }, [token, show]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      show("Erreur", "Les mots de passe ne correspondent pas.", "error");
      setIsLoading(false);
      return;
    }

    if (!token) {
      show("Erreur", "Token invalide.", "error");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, newPassword);
      show("Succès", "Mot de passe réinitialisé avec succès.", "success");
      router.push("/login");
    } catch (error) {
      show("Erreur", "Une erreur est survenue lors de la réinitialisation du mot de passe.", "error");
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
              <Password 
                id="newPassword" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                minLength={8}
                promptLabel="Changer de mot de passe"
                weakLabel="Mot de passe simple"
                mediumLabel="Mot de passe moyen"
                strongLabel="Mot de passe fort"
                toggleMask
                pt={{
                  input: { className: "px-3 py-2 w-full border border-gray-300 rounded-md" }
                }}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe :</label>
              <Password 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                minLength={8}
                promptLabel="Changer de mot de passe"
                weakLabel="Mot de passe simple"
                mediumLabel="Mot de passe moyen"
                strongLabel="Mot de passe fort"
                toggleMask
                pt={{
                  input: { className: "px-3 py-2 w-full border border-gray-300 rounded-md" }
                }}
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
        </div>
      </div>
    </div>
  );
}
