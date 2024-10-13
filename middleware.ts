import {NextResponse, NextRequest} from 'next/server';
import {getToken, JWT} from 'next-auth/jwt';
import {jwtVerify} from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'votre_secret_de_test');

export async function middleware(req: NextRequest) {
    const token: JWT | null = await getToken({req});

    if (!token || !token.jwt) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const {payload} = await jwtVerify(token.jwt, JWT_SECRET);

        if (payload) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    } catch (error) {
        console.error('Erreur de vérification du JWT :', error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config: { matcher: string[] } = {
    matcher: ['/profil', '/admin'],
};
