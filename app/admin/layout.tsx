import SessionWrapper from "@/lib/SessionWrapper";
import Link from "next/link";
import React from "react";
import Image from 'next/image'

import { ToastProvider } from "@/app/provider/toastProvider";

const adminLinks = [
    { name: "Dashboard", href: "/admin/", icon: "pi pi-chart-bar" },
    { name: "Categories", href: "/admin/category", icon: "pi pi-tags" },
    { name: "Remises", href: "/admin/discount", icon: "pi pi-percentage" },
    { name: "Produits", href: "/admin/product", icon: "pi pi-box" },
    { name: "Contacts", href: "/admin/contact", icon: "pi pi-envelope" },
    { name: "Graphique", href: "/admin/chart", icon: "pi pi-chart-line" },
    { name: "Commandes", href: "/admin/order", icon: "pi pi-shopping-bag" },

];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="flex h-screen">
                    <aside className="w-56 h-screen bg-white p-4 shadow-xl shadow-black">
                        <div className='fixed top-0 h-full'>
                            <Link href="/">
                                <div className="flex justify-center items-center mb-8 gap-1">
                                    <Image src="/images/logo.svg" width={60} height={60} alt="DriveFood" />
                                    <h2 className="text-lg font-black font-manrope text-actionColor uppercase">DriveFood</h2>
                                </div>
                            </Link>
                            <nav>
                                <ul>
                                    {adminLinks.map((link) => (
                                        <Link href={link.href} key={link.href} className="mb-4 flex  justify-start gap-5 group font-manrope">
                                            <span className='border-l-4 rounded-full border-actionColor opacity-0 group-hover:opacity-100  transition-all'></span>
                                            <div className='flex gap-3 items-center'>
                                                <span className={`${link.icon} group-hover:text-actionColor`} />
                                                <p className='group-hover: '>{link.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <ToastProvider>
                            <SessionWrapper>{children}</SessionWrapper>
                        </ToastProvider>
                    </div>
                </div>
            </body>
        </html>
    );
}
