"use client"

import { signIn } from "next-auth/react"
import Image from "next/image";

export default function ButtonsProvider() {
    return (
        <div>
            <button className="google-button flex items-center justify-center"
                    onClick={() => signIn('google')} type="button">
                <Image src="/images/googleLogo.png" width={40} height={40} alt="logo google" />

                Continuer avec google
            </button>
        </div>
    )
}