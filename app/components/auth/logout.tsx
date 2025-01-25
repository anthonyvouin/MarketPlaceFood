"use client"

import {signOut} from "next-auth/react"
import RoundedButton from "@/app/components/ui/rounded-button";

export default function LogoutButton() {
    return (
        <div className="flex flex-col space-y-4">
            <RoundedButton onClickAction={() => signOut()} positionIcon='right' icon="pi-sign-out" classes="border-redColor text-redColor hover:bg-redColor hover:text-white h-10 w-10"></RoundedButton>
        </div>
    )
}