'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { signIn } from "next-auth/react";
import {UserLoginDto} from "@/app/interface/user/userLoginDto";



export default function SignInPage() {
  const [email, setEmail] = useState<string>("");  
  const [password, setPassword] = useState<string>("");  
  const router = useRouter();  

  const handleSignIn = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault(); 

    const userLoginData: UserLoginDto = {
      email: email,
      password: password,
    };

    try {
      const result = await signIn("credentials", {
        email: userLoginData.email,  
        password: userLoginData.password, 
        redirect: false,  
      });

      if (result?.error) {
        console.error("Erreur lors de la connexion :", result.error);
      } else {
        router.push("/profil");  
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="form">
      <h2>Connexion</h2> 

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
        required  // Le champ est requis
      />

      <button type="submit">Se connecter</button>
    </form>
  );
}
