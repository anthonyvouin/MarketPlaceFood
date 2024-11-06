"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/services/user/user"; // Service pour gérer la demande
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Réinitialise le message à chaque tentative

    try {
      await requestPasswordReset(email); // Service pour envoyer le token
      setMessage("Un e-mail de réinitialisation a été envoyé. Vérifiez votre boîte de réception.");
      // Redirige vers la page d'accueil ou de connexion après l'envoi du mail
      router.push("/login"); 
    } catch (error) {
      setMessage("Erreur lors de l'envoi de l'e-mail. Essayez à nouveau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Réinitialiser votre mot de passe</h1>
      <form onSubmit={handleRequestReset}>
        <label>
          Adresse e-mail :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Entrez votre email"
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Envoyer l'email de réinitialisation"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
