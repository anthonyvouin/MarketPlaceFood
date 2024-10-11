"use client";  

import { useState } from "react";

export default function RegisterForm({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        try {
            await onSubmit(formData); 
            setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter."); 
        } catch (e) {
            setError((e as Error).message); 
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nom et Prénom</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
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
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Afficher le message d'erreur */}
            {success && <p style={{ color: 'green' }}>{success}</p>} {/* Afficher le message de succès */}
            <button type="submit">S'inscrire</button>
        </form>
    );
}
