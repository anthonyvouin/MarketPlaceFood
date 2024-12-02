import SessionWrapper from "@/lib/SessionWrapper";
import Link from "next/link";
import React from "react";
import { ToastProvider } from "@/app/provider/toastProvider";

const adminLinks = [
    { name: "Dashboard", href: "/admin/", icon: "pi pi-chart-bar" },
    { name: "Categories", href: "/admin/category", icon: "pi pi-tags" },
    { name: "Remises", href: "/admin/discount", icon: "pi pi-percentage" },
    { name: "Produits", href: "/admin/product", icon: "pi pi-box" },
    { name: "Contacts", href: "/admin/contact", icon: "pi pi-envelope" },
    { name: "Graphique", href: "/admin/chart", icon: "pi pi-chart-line" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="flex h-screen">
                    <aside className="w-64 h-screen bg-white p-4">
                        <div className="fixed top-0 h-full">
                            <Link href="/">
                                <div className="flex justify-center items-center mb-8 gap-1">
                                    <img src="/images/logo.svg" alt="Admin Logo" width={60} height={60} />
                                    <h2 className="text-lg font-black font-manrope text-actionColor uppercase">
                                        Admin Panel
                                    </h2>
                                </div>
                            </Link>
                            <nav>
                                <ul>
                                    {adminLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="mb-4 flex items-center gap-4 group font-manrope"
                                        >
                                            <span className={`${link.icon} text-xl group-hover:text-actionColor`} />
                                            <span className="group-hover:text-actionColor">{link.name}</span>
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
