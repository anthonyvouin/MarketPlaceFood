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

            <div className="flex gap-5">
                <Link href="/contact">
                    <Avatar
                        fallback={
                            <Box className='flex justify-center justify-items-center' width="24px" height="24px">
                                <EnvelopeClosedIcon width="24" height="20"/>
                            </Box>
                        }
                        radius="full"
                        color="indigo"
                        variant="solid"
                    />
                </Link>

                <Avatar
                    fallback={
                        <Box className='flex justify-center justify-items-center' width="24px" height="24px">
                            <BellIcon width="24" height="20"/>
                        </Box>
                    }
                    radius="full"
                    color="indigo"
                    variant="solid"
                />

                <Avatar fallback={name} radius="full"/>
                <LogoutButton></LogoutButton>

            </div>
        </div>
    )
}