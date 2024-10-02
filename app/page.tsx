"use client"
import { useSession } from "next-auth/react";

export default function Home() {

  const { data: session } = useSession();
  console.log(session);
  return (
    
      <h1>Page d'accueil</h1>
  );
}
