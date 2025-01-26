"use client"
import Image from "next/image";
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ButtonsProvider() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      const role = session.user["role"];

      // Redirigez en fonction du rôle
      if (role === "ADMIN") {
        // router.push("/admin-dashboard");
      } else if (role === "STOREKEEPER") {
        router.push("/admin/product");
      } else if (role === "USER") {
        router.push("/");
      }
    }
  }, [session, status, router]);

    return (
        <div className="flex justify-center">
            <button className="google-button flex items-center justify-center"
                    onClick={() => signIn('google')} type="button">
                <Image src="/images/googleLogo.png" width={40} height={40} alt="logo google"/>
            </button>
        </div>
    )
}