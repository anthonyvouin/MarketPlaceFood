"use server";

import {jwtVerify} from "jose";
import {cookies} from "next/headers";
import {decode, JWT} from "next-auth/jwt";
import {JwtPayload} from "jsonwebtoken";

class JWTError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "JWTError";
    }
}

const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXTAUTH_SECRET || "votre_secret_de_test"
);

export async function verifyAuth(allowedRoles: string[] = []) {
    const cookieStore = cookies();
    const isProduction = process.env.NODE_ENV === "production";
    const variableCookieName = isProduction ? "__Secure-next-auth.session-token" : "next-auth.session-token";
    const token: string | undefined = cookieStore.get(variableCookieName)?.value;
    if (token) {
        try {
            const decoded: JWT | null = await decode({
                token: token,
                secret: process.env.NEXTAUTH_SECRET
                    ? process.env.NEXTAUTH_SECRET
                    : "votre_secret_de_test",
            });

            if (!decoded) {
                throw new JWTError("Token invalide");
            }

            const userJwt: JwtPayload = await jwtVerify(decoded.jwt as string, JWT_SECRET);
            const userRole: string = userJwt["payload"].role;

            if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                throw new JWTError(`Accès refusé. Rôle ${userRole} non autorisé.`);
            }

            return {message: "Action réussie !", user: userJwt["payload"]};
        } catch (e) {
            if (e instanceof JWTError) {
                console.error("Erreur JWT :", e.message);
                throw e;
            } else if (e instanceof Error) {
                console.error("Erreur générale :", e.message, e.stack);
            } else {
                throw new Error("Invalid token");
            }
        }
    } else {
        throw new Error(`Vous n'êtes pas authentifié`);
    }
}
