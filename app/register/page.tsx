'use client';

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation"; 
import { createUser } from "@/app/services/user/user"; 
import { signIn } from "next-auth/react"; 
import { UserRegisterDto } from "../interface/user/useRegisterDto";
import {getPageName} from "@/app/utils/utils";
export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

    useEffect(() => {
        getPageName();
    }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user: UserRegisterDto = await createUser(email, name, password);
      const result = await signIn("credentials", {
        email: user.email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Erreur lors de la connexion :", result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="form">
      <h2>Incription</h2>

      <label htmlFor="name">Nom</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Mot de passe</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Sauvegarder</button>
    </form>
  );
}
