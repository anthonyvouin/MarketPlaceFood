"use client"

import { signIn } from "next-auth/react"

export default function ButtonsProvider() {
    return (
        <div className="flex flex-col space-y-4">
            <button onClick={()=>signIn('google')} type="button">Continuer avec google</button>
        </div>
    )
}