"use client"

import Link from 'next/link';
import { SidebarLinks } from "@/app/interface/sidebar-links/sidebar-links";
import { useState } from 'react';

interface SidebarProps {
    isOpenSidebar: boolean;
    setIsOpenSidebar: (isOpen: boolean) => void;
}

const profilSidebarLinks: SidebarLinks[] = [
    {
        name: 'Recette', icon: 'pi pi-book',
        subLinks: [
            { name: 'Favoris', href: '/profil/recipes/favorites', icon: 'pi pi-star' },
            { name: 'Générations', href: '/profil/recipes/generation', icon: 'pi pi-pencil' },
        ]
    },
    { name: 'Compte', href: '/profil', icon: 'pi pi-cog' },
    { name: 'Adresses', href: '/profil/adresses', icon: 'pi pi-home' },
    { name: 'Notifications', href: '/profil/notification', icon: 'pi pi-bell' },
    { name: 'Commandes', href: '/profil/commandes', icon: 'pi pi-file' },
];

const ProfilSidebarNav = () => (
    <nav className="flex-grow">
        <ul>
            {profilSidebarLinks.map((link) => (
                <li key={link.name} className="mb-4">
                    {link.href ? (
                        <Link href={link.href} className="flex justify-start gap-5 group font-manrope">
                            <span className='border-l-4 rounded-full border-actionColor opacity-0 group-hover:opacity-100 transition-all'></span>
                            <div className='flex gap-3 items-center'>
                                <span className={`${link.icon} group-hover:text-actionColor`} />
                                <p className='group-hover:text-actionColor'>{link.name}</p>
                            </div>
                        </Link>
                    ) : (
                        <div className="flex justify-start gap-5 group font-manrope">
                            <span className='border-l-4 rounded-full opacity-0 '></span>
                            <div className='flex gap-3 items-center'>
                                <span className={`${link.icon}`} />
                                <p>{link.name}</p>
                            </div>
                        </div>
                    )}
                    {link.subLinks && (
                        <ul className="ml-4 mt-2">
                            {link.subLinks.map((subLink) => (
                                <li key={subLink.href} className="mb-2">
                                    <Link href={subLink.href} className="flex justify-start gap-5 group font-manrope">
                                        <span className='border-l-4 rounded-full border-actionColor opacity-0 group-hover:opacity-100 transition-all'></span>
                                        <div className='flex gap-3 items-center'>
                                            <span className={`${subLink.icon} group-hover:text-actionColor`} />
                                            <p className='group-hover:text-actionColor'>{subLink.name}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    </nav>
);

export default function ProfilSidebar({ isOpenSidebar, setIsOpenSidebar }: SidebarProps) {
    return (
        <>
            <aside className={`
                w-64 h-screen bg-primaryBackgroundColor fixed left-0 top-0 z-50 
                shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out
                ${!isOpenSidebar ? '-translate-x-full' : 'translate-x-0'}
            `}>
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setIsOpenSidebar(false)}
                        className="text-white h-10 w-full bg-primaryColor rounded-md">
                        <span className="pi pi-times" />
                    </button>
                </div>
                <div className="sticky top-0 flex flex-col h-screen p-4 overflow-y-auto font-manrope">
                    <ProfilSidebarNav />
                </div>
            </aside>
            <div
                className={`fixed inset-0 bg-black opacity-50 z-40 ${!isOpenSidebar && 'hidden'}`}
                onClick={() => setIsOpenSidebar(false)}
            />
        </>
    );
}

