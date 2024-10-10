'use client';

import {usePathname} from "next/navigation";
import HeaderClient from "@/app/components/header/client-header/header-client";
import Sidebar from "@/app/components/sidebar/Sidebar";
import {Theme} from "@radix-ui/themes";
import ProfilSidebar from "@/app/components/sidebar/profil-sidebar";
import React from "react";
import { ToastProvider } from "@/app/provider/toastProvider";
import {DialogProvider} from "@/app/provider/DialogProvider";

export default function LayoutWrapper({children}: { children: React.ReactNode }) {
    const pathname: string = usePathname();

    if (pathname.startsWith("/admin")) {
        return <>{children}</>;
    }

    if (pathname.startsWith("/profil")) {
        return (<>
                <Theme>
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
                </Theme>
            </>
        )
    }

    return (
        <>
            <Theme>
                <div className="flex">
                    <Sidebar/>
                    <div className="w-full">
                        <HeaderClient/>
                        {children}
                    </div>
                </div>
            </Theme>
        </>
    );
}