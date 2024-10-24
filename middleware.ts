import { NextResponse, NextRequest } from "next/server";
import { getToken, JWT } from "next-auth/jwt";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET 
);

export async function middleware(req: NextRequest) {
  const token: JWT | null = await getToken({ req });

  if (!token || !token.jwt) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token.jwt, JWT_SECRET);

    const userRole = payload.role.toLowerCase(); 
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isProfilePage = req.nextUrl.pathname.startsWith("/profil");

    if (isAdminPage && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isProfilePage && (userRole === "user" || userRole === "admin")) {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Erreur de vérification du JWT :", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config: { matcher: string[] } = {
  matcher: ["/profil", "/admin"],
};
