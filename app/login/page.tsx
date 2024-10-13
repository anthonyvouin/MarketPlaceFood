"use client"

import ButtonsProvider from "../components/auth/ButtonsProvider";
import LoginForm from "../components/auth/loginForm";
export default function Login() {
  return (
    <div>
          
    <h1>Page de connexion avec google </h1>
    <ButtonsProvider />

    <LoginForm />


    </div>
  );
}