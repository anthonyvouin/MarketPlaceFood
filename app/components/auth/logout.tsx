"use client"

import {signOut} from "next-auth/react"
import ActionButton from "@/app/components/ui/action-button";

export default function LogoutButton() {
    return (
        <div className="flex flex-col space-y-4">

            <ActionButton onClickAction={() => signOut()} message="Se deconnecter" positionIcon='right' icon="logout"></ActionButton>
        </div>
    )
}