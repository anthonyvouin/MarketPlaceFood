"use client"

import LogoutButton from "@/app/components/auth/logout";

export default function HeaderClient() {
    return (
        <div className="flex bg-actionColor">
            header
            <LogoutButton></LogoutButton>
        </div>
    )
}