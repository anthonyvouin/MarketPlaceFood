"use client"
import Image from "next/image";
import {signIn} from "next-auth/react";

export default function ButtonsProvider() {

    return (
        <div className="flex justify-center">
            <button className="google-button flex items-center justify-center"
                    onClick={() => signIn('google')} type="button">
                <Image src="/images/googleLogo.png" width={40} height={40} alt="logo google"/>
            </button>
        </div>
    )
}