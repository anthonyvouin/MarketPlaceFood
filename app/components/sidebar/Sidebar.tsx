"use client"

import Link from 'next/link';
import { SidebarLinks } from "@/app/interface/sidebar/sidebar-links";
import { SidebarProps } from '@/app/interface/sidebar/sidebar-props';

const sidebarLinks: SidebarLinks[] = [
    { name: 'Accueil', href: '/', icon: 'pi pi-home' },
    { name: 'Produits', href: '/products', icon: 'pi pi-barcode' },
    { name: 'Recettes', href: '/recipes', icon: 'pi pi-book' },
    { name: 'Contact', href: '/contact', icon: 'pi pi-envelope' }
];

const SidebarNav = () => (
    <nav className="flex-grow">
        <ul className="space-y-4">
            {sidebarLinks.map((link) => (
                <li key={link.href}>
                    <Link
                        href={link.href}
                        className="flex items-center gap-4 py-2 pl-4 rounded-lg transition-all hover:bg-actionColor hover:text-white"
                    >
                        <span className={`${link.icon} text-lg`} />
                        <p className="text-md">{link.name}</p>
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
);

export default function Sidebar({ isOpenSidebar, setIsOpenSidebar }: SidebarProps) {
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
                    <SidebarNav />
                </div>
            </aside>
            <div 
                className={`fixed inset-0 bg-black opacity-50 z-40 ${!isOpenSidebar && 'hidden'}`} 
                onClick={() => setIsOpenSidebar(false)}
            />
        </>
    );
}
