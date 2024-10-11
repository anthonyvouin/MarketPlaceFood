"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; 

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); 
        setSuccess(''); 

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, 
        });

        if (result?.error) {
            setError(result.error); 
        } else {
            setSuccess("Connexion réussie !");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <button type="submit">Se connecter</button>
        </form>
    );
}
