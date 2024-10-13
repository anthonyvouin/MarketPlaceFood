"use server"

import {jwtVerify} from 'jose';
import {cookies} from "next/headers";
import {decode} from "next-auth/jwt";

class JWTError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JWTError';
    }
}

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'votre_secret_de_test');

export async function verifyAuth() {
    const cookieStore = cookies();
    const token = cookieStore.get('next-auth.session-token')?.value;
    if (token) {
        try {
            const decoded = await decode({
                token: token,
                secret: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : 'votre_secret_de_test'
            });

            if (!decoded) {
                throw new JWTError('Token invalide');
            }

            if (decoded) {
                const {payload} = await jwtVerify(decoded.jwt as string, JWT_SECRET);
                return {message: 'Action successful!', user: payload};

            }

        } catch (e) {
            if (e instanceof JWTError) {
                console.error('Erreur JWT :', 'erreur');
            } else if (e instanceof Error) {
                console.error('Erreur générale :', e.message, e.stack);
            } else {
                throw new Error('Invalid token')
            }
        }

    } else {

        throw new Error(`Vous n'êtes pas authentifié`); // Message d'erreur que l'utilisateur verra
    }

}
