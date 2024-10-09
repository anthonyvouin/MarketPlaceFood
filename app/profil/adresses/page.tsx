'use client';

import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {getUserById, updateUser, UserWithAdress} from "@/app/services/user/user";
import Link from "next/link";
import {AddressDto} from "@/app/interface/address/addressDto";
import {Badge} from "@radix-ui/themes";

const Adresses = () => {
    const {data: session, status} = useSession()
    const [user, setUser] = useState<UserWithAdress | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (session) {
            const fetchUser = async () => {
                const getUser: UserWithAdress | null = await getUserById(session.user.id);
                if (getUser) {
                    setUser(getUser);
                }

            }
            fetchUser();

        }
    }, [session]);

    return (
        <div className="bg-primaryBackgroundColor height-full">
            <div className="grid grid-cols-3 gap-4 width-85 mx-auto">
                {user && user.addresses.length > 0 ? (
                    user.addresses.map((address: AddressDto) => (
                        <div key={address.id}
                             className='bg-white p-2.5 rounded-lg w-96 '>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{address.name}</h2>
                                {address.isPrincipal ? ( <Badge color="green">Addresse principale</Badge>): ('')}


                            </div>

                            <p>{address.additionalAddress}</p>
                            <p>{address.address}</p>
                            <p>{address.zipCode} {address.city}</p>

                            <div className="flex">
                                <Link href={`/profil/adresses/create-update?id=${address.id}`}>Modifier</Link>
                                {!address.isPrincipal ? (
                                    <div>
                                        <span>&ensp;|</span> <span className='text-actionColor underline'>Définir comme addresse principale</span>
                                    </div>) : ('')}
                            </div>



                        </div>
                    ))
                ) : (
                    <div>
                        <p>Vous n'avez pas configuré d'adresses</p>

                    </div>
                )}
            </div>

            <Link href="adresses/create-update">Ajouter une adresse</Link>
        </div>

    );
};

export default Adresses;