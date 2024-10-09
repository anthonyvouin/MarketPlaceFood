"use client"
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {Avatar, Box} from "@radix-ui/themes";
import {BellIcon, EnvelopeClosedIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import LogoutButton from "@/app/components/auth/logout";

export default function HeaderClient() {
    const [name, setName] = useState('');
    const {data: session, status} = useSession()

    useEffect(() => {
        if (session && session.user && session.user.name) {
            setName(session.user.name[0]);
        }
    }, [session]);

    return (
        <header className="flex items-center justify-between px-20 h-[15vh] bg-primaryBackgroundColor">
            <h1 className="font-manrope font-bold">Accueil 🙂</h1>
            <input type='text'
                   placeholder='Rechercher un produit'
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg h-10 w-1/4
                   focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>

            <div className="flex gap-5 items-center">
                <Link href="/contact">
                    <Avatar
                        size="2"
                        className="bg-actionColor"
                        fallback={
                            <Box className='flex justify-center items-center' width="15px" height="15px">
                                <EnvelopeClosedIcon className='text-light' width="15" height="15"/>
                            </Box>
                        }
                        radius="full"
                        variant="soft"
                    />
                </Link>
                <Avatar
                    size="2"
                    className="bg-actionColor"
                    fallback={
                        <Box className='flex justify-center items-center' width="15px" height="15px">
                            <BellIcon className="text-light" width="15" height="15"/>
                        </Box>
                    }
                    radius="full"
                    variant="soft"
                />

                {status === 'authenticated' ? (
                    <>
                       <Link href="/profil">
                           <Avatar className="bg-actionColor"
                                   size="2"
                                   fallback={
                                       <Box>
                                           <span className="text-light">{name}</span>
                                       </Box>}
                                   radius="full"/>
                       </Link>

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