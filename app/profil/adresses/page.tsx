'use client';

import React, {useContext, useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {getUserById, UserWithAdress} from "@/app/services/user/user";
import Link from "next/link";
import {AddressDto} from "@/app/interface/address/addressDto";
import {DialogContext} from "@/app/provider/DialogProvider";
import {deleteAdress} from "@/app/services/addresses/addresses";
import {getPageName} from "@/app/utils/utils";
import {Badge} from "primereact/badge";

const Adresses = () => {
    const {data: session, status} = useSession()
    const [user, setUser] = useState<UserWithAdress | null>(null);
    const {showDialog} = useContext(DialogContext);

    useEffect((): void => {
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

    useEffect((): void => {
        getPageName();
    }, []);

    const handleDelete = (address: AddressDto): void => {

        showDialog(
            'Confirmer la suppression',
            `Êtes-vous sûr de vouloir supprimer l'adresse "${address.name}" ?`,
            () => {
                if (address.id) {
                    deleteAdress(address.id).then(() => {

                        setUser((prevUser) => {
                            if (!prevUser) return prevUser;

                            return {
                                ...prevUser,
                                addresses: prevUser.addresses.filter((element) => element.id !== address.id),
                            };
                        });
                    })
                }
            }
        );

    }

    return (
        <div className="bg-primaryBackgroundColor height-full">
            <div className="grid grid-cols-3 gap-4 width-85 mx-auto">
                <div className='bg-white p-2.5 rounded-lg w-96 '>
                    <Link href="adresses/create-update">Ajouter une adresse</Link>
                </div>
                {user && user.addresses.length > 0 ? (
                    user.addresses.map((address: AddressDto) => (
                        <div key={address.id}
                             className='bg-white p-5 rounded-lg w-96 h-56 relative'>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{address.name}</h2>
                                {address.isPrincipal ? (<Badge value="Adresse Principale"></Badge>) : ('')}
                            </div>

                            <div className="flex mt-2">
                                <span className="pi pi-hone"></span>
                                <div>
                                    <p>{address.additionalAddress}</p>
                                    <p>{address.address}</p>
                                    <p>{address.zipCode} {address.city}</p>
                                </div>

                            </div>

                            <div className="flex items-center">
                                <span className="pi pi-mobile"></span>
                                <p>{address.phoneNumber}</p>
                            </div>

                            <div className="flex items-center">
                                {address.note ? (<span className="pi pi-clipboard"></span>) : ''}
                                <p className="italic ">{address.note}</p>
                            </div>

                            <div className="flex absolute bottom-2.5 left-5 items-center">
                                <Link href={`/profil/adresses/create-update?id=${address.id}`} className="text-sm">Modifier</Link>
                                {!address.isPrincipal ? (
                                    <div>
                                        <span className="text-sm">&ensp;| &ensp;</span>
                                        <span className='text-actionColor underline text-sm'>Définir comme addresse principale</span>
                                    </div>) : ('')}
                                <span className="text-sm">&ensp;|&ensp;</span>
                                <span className="pi pi-trash" onClick={() => handleDelete(address)}></span>
                            </div>
                        </div>
                    ))
                ) : ('')}
            </div>
        </div>
    );
};

export default Adresses;