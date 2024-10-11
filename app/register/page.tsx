"use client";  

import RegisterForm from '../components/auth/registerForm'; 
import { registerUser } from '@/app/services/user/user'; 
import { signIn } from 'next-auth/react'; // Import signIn method

export default function SignUpPage() {
    const handleRegisterUser = async (formData: FormData) => {
        try {
            const newUser = await registerUser(formData);
            
            const result = await signIn("credentials", {
                email: newUser.email,
                password: formData.get('password') as string, 
                redirect: false, 
            });

            if (result?.error) {
                console.error("Erreur lors de la connexion :", result.error);
            } else {
                console.log("Inscription et connexion réussies !");
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    return (
        <div>
            <h1>Créer un compte</h1>
            <RegisterForm onSubmit={handleRegisterUser} />
        </div>
    );
}
