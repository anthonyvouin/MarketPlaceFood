"use client"
import { useSession } from "next-auth/react";
import ButtonsProvider from "./components/ButtonsProvider";

export default function Home() {

  const { data: session } = useSession();
  console.log(session);
  return (
    
      <ButtonsProvider />
      
  );
}