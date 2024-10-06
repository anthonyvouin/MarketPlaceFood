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
        <div className="flex justify-around">
            <input type='text'
                   placeholder='Search'
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
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
                        <Avatar className="bg-actionColor"
                                size="2"
                                fallback={
                                    <Box>
                                        <span className="text-light">{name}</span>
                                    </Box>}
                                radius="full"/>
                        <LogoutButton/>
                    </>
                ) : (
                    <Link href="/login"
                          className="border-b-2 border-actionColor">Se connecter</Link>
                )}


            </div>
        </div>
    )
}