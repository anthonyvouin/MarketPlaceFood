import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'votre_secret_de_test');

export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get('next-auth.session-token') || req.cookies.get('next-auth-token'); // Assurez-vous que le token est bien là

  if (!token) {
    throw new Error('Non autorisé : aucun token trouvé.');
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'], // Spécifiez l'algorithme utilisé
    });

    // Retourne les informations contenues dans le JWT
    return payload; 
  } catch (error) {
    console.error('Erreur de vérification du JWT:', error);
    throw new Error('Non autorisé : token invalide.');
  }
}
