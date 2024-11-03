"use client"
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/auth/logout";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";

export default function HeaderClient() {
    const [name, setName] = useState('');
    const {data: session, status} = useSession()

    console.log(session)
    useEffect(() => {
        if (session && session.user && session.user.name) {
            setName((session.user.name[0]).toUpperCase());
        }
    }, [session]);

    return (
        <header className="flex items-center justify-between px-20 h-[15vh] bg-primaryBackgroundColor">
            <h1 className="font-manrope font-bold">Accueil 🙂</h1>
            <input type='text'
                   placeholder='&#128269; Rechercher un produit'
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg h-10 w-1/4
                   focus:ring-blue-500 focus:outline-none focus:border-actionColor block p-2.5"/>

            <div className="flex gap-5 items-center">
                <Link href="/contact">
                    <Button
                        rounded
                        icon="pi pi-envelope"
                        className="bg-actionColor text-white w-8 h-8 text-xs"
                    />
                </Link>
                <Button
                    rounded
                    icon="pi pi-bell"
                    className="bg-actionColor text-white w-8 h-8 text-xs"
                />
                {status === 'authenticated' ? (
                    <>
                        <Link href="/profil">
                            <Avatar label={name} shape="circle" className="bg-actionColor text-white"/>
                        </Link>


                        {session?.user["role"] === "ADMIN" ? (
                            <Link href="/admin">
                                <Button
                                    rounded
                                    icon="pi pi-folder"
                                    className="bg-info text-white w-8 h-8 text-xs"
                                >
                                </Button>
                            </Link>
                        ) : ("")}

                        <LogoutButton/>
                    </>
                ) : (
                    <Link href="/login"
                          className="border-b-2 border-actionColor">Se connecter</Link>
                )}


            </div>
        </header>
    )
}