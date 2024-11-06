"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/user/user"; // Service pour gérer la réinitialisation

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
      await resetPassword(token, newPassword); // Service pour réinitialiser le mot de passe
      setMessage("Mot de passe réinitialisé avec succès.");
      router.push("/login"); // Redirection vers la page de connexion
    } catch (error) {
      setMessage("Erreur lors de la réinitialisation du mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Réinitialisation du mot de passe</h1>
      <form onSubmit={handleResetPassword}>
        <label>
          Nouveau mot de passe :
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Entrez votre nouveau mot de passe"
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
