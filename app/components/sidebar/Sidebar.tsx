"use client"

import Link from 'next/link';
import Image from 'next/image';
import { SidebarLinks } from "@/app/interface/sidebar-links/sidebar-links";

interface SidebarProps {
    isOpenSidebar: boolean;
    setIsOpenSidebar: (isOpen: boolean) => void;
}

const sidebarLinks: SidebarLinks[] = [
    { name: 'Accueil', href: '/', icon: 'pi pi-home' },
    { name: 'Produits', href: '/products', icon: 'pi pi-barcode' },
    { name: 'Recettes', href: '/recipes', icon: 'pi pi-book' },
    { name: 'Contact', href: '/contact', icon: 'pi pi-envelope' }
];

const SidebarLogo = () => (
    <Link href="/" className="flex items-center mb-8 gap-2">
        <Image src="/images/logo.svg" width={40} height={40} alt="Snap&Shop Logo" />
        <h2 className="text-lg font-black font-manrope text-actionColor uppercase">Snap&Shop</h2>
    </Link>
);

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
            <aside className={`w-64 h-screen bg-primaryBackgroundColor fixed left-0 top-0 z-50 shadow-lg border-r border-gray-200 ${!isOpenSidebar && 'hidden'}`}>
                <div className="flex justify-end p-4">
                    <button 
                        onClick={() => setIsOpenSidebar(false)} 
                        className="text-white h-10 w-full bg-primaryColor rounded-md">
                        <span className="pi pi-times" />
                    </button>
                </div>
                <div className="sticky top-0 flex flex-col h-screen p-4 overflow-y-auto font-manrope">
                    <SidebarLogo />
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
