import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt'; 
import { jwtVerify } from 'jose'; // Importer jwtVerify de jose

// Clé secrète pour JWT
const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'votre_secret_de_test');

export async function middleware(req: NextRequest) {
    // Récupère le token de session
    const token = await getToken({ req });

    console.log('Token récupéré :', token); // Log du token récupéré

    // Vérifiez que le token existe et contient le JWT
    if (!token || !token.jwt) { 
        return NextResponse.redirect(new URL('/login', req.url)); 
    }

    try {
        // Vérifie et décode le JWT avec la clé secrète
        const { payload } = await jwtVerify(token.jwt, JWT_SECRET); 

        // Si le token est bien décodé, autoriser l'accès à la route
        if (payload) {
            return NextResponse.next(); 
        } else {
            return NextResponse.redirect(new URL('/login', req.url)); 
        }
    } catch (error) {
        console.error('Erreur de vérification du JWT :', error); // Log de l'erreur
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// Configuration des routes à protéger
export const config = {
    matcher: ['/profil', '/admin'], 
};
