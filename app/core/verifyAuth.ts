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
            console.error('Invalid token')
            throw new Error('Invalid token');
        }

    } else {
        if (e instanceof JWTError) {
            console.error('Erreur JWT :','lala');
        } else if (e instanceof Error) {
            // Logue les autres erreurs avec leur stack
            console.error('Erreur générale :', e.message, e.stack);
        }

        // Lance une nouvelle erreur avec un message plus générique pour l'utilisateur
        throw new Error('Une erreur est survenue lors du traitement du token.'); // Message d'erreur que l'utilisateur verra
    }

}
