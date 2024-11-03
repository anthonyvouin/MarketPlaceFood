'use client';

import {usePathname} from "next/navigation";
import HeaderClient from "@/app/components/header/client-header/header-client";
import Sidebar from "@/app/components/sidebar/Sidebar";
import ProfilSidebar from "@/app/components/sidebar/profil-sidebar";
import React from "react";
import {ToastProvider} from "@/app/provider/toastProvider";
import {DialogProvider} from "@/app/provider/DialogProvider";
import {PrimeReactProvider} from "primereact/api";

export default function LayoutWrapper({children}: { children: React.ReactNode }) {
    const pathname: string = usePathname();

    if (pathname.startsWith("/admin")) {
        return <>
            <PrimeReactProvider>
                {children}
            </PrimeReactProvider>
        </>;
    }

    if (pathname.startsWith("/profil")) {
        return (<>
                <PrimeReactProvider>
                    <ToastProvider>
                        <DialogProvider>
                            <div className="flex">
                                <ProfilSidebar/>
                                <div className="w-full">
                                    <HeaderClient/>
                                    {children}
                                </div>
                            </div>
                        </DialogProvider>
                    </ToastProvider>
                </PrimeReactProvider>
            </>
        )
    }

    return (
        <>
            <PrimeReactProvider>
                <div className="flex">
                    <Sidebar/>
                    <div className="w-full">
                        <HeaderClient/>
                        {children}
                    </div>
                </div>
            </PrimeReactProvider>
        </>
    );
}