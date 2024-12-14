"use client"
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/auth/logout";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {useCart} from "@/app/provider/cart-provider";
import {useSideBarBasket} from "@/app/provider/sideBar-cart-provider";

export default function HeaderClient(): JSX.Element {
    const [name, setName] = useState('');
    const {data: session, status} = useSession()
    const {totalLengthItems} = useCart();
    const {toggleBasketList} = useSideBarBasket();

    useEffect((): void => {
        if (session && session.user && session.user.name) {
            setName((session.user.name[0]).toUpperCase());
        }
    }, [session]);

    return (
        <header className="flex items-center justify-between px-20 h-[15vh] bg-primaryBackgroundColor fixed full-width z-50">
            <h1 className="font-manrope font-bold">Accueil 🙂</h1>
            <input type='text'
                   placeholder='&#128269; Rechercher un produit'
                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg h-10 w-1/4
                   focus:ring-blue-500 focus:outline-none focus:border-actionColor block p-2.5"/>

            <div className="flex gap-5 items-center">
                {status === 'authenticated' ? (
                    <>
                        <div className="relative">
                            <Button
                                rounded
                                icon="pi pi-shopping-cart"
                                className="bg-actionColor text-white w-8 h-8 text-xs"
                                onClick={toggleBasketList}
                            />
                            <span className="absolute bg-primaryColor px-1 rounded-full ft-10px badge-shop text-white">{totalLengthItems}</span>
                        </div>
                        <Button
                            rounded
                            icon="pi pi-bell"
                            className="bg-actionColor text-white w-8 h-8 text-xs"
                        />

                        <Link href="/profil">
                            <Avatar label={name} shape="circle" className="bg-actionColor text-white"/>
                        </Link>

                        {session?.user["role"] === "ADMIN" ? (
                            <Link href="/admin">
                                <div className="bg-info text-white w-8 h-8 text-xs rounded-full flex items-center justify-center">
                                    <span className="pi pi-folder"></span>
                                </div>
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