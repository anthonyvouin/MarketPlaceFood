'use client';

import {usePathname} from "next/navigation";
import HeaderClient from "@/app/components/header/client-header/header-client";
import Sidebar from "@/app/components/sidebar/Sidebar";
import ProfilSidebar from "@/app/components/sidebar/profil-sidebar";
import React from "react";
import {BasketProvider} from "@/app/provider/basket-provider";
import {SideBarBasketProvider} from "@/app/provider/sideBar-basket-provider";
import {ToastProvider} from "@/app/provider/toastProvider";
import {DialogProvider} from "@/app/provider/DialogProvider";

export default function LayoutWrapper({children}: { children: React.ReactNode }) {
    const pathname: string = usePathname();

    if (pathname.startsWith("/admin")) {
        return <>
                <DialogProvider>
                    {children}
                </DialogProvider>
        </>;
    }

    if (pathname.startsWith("/profil")) {
        return (<>
                <ToastProvider>
                    <DialogProvider>
                        <BasketProvider>
                            <SideBarBasketProvider>
                                <div className="flex">
                                    <ProfilSidebar/>
                                    <div className="w-full">
                                        <HeaderClient/>
                                        <div className="padding-header bg-primaryBackgroundColor">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            </SideBarBasketProvider>
                        </BasketProvider>
                    </DialogProvider>
                </ToastProvider>
            </>
        )
    }

    return (
        <>
            <ToastProvider>
                <DialogProvider>
                    <BasketProvider>
                        <SideBarBasketProvider>
                            <div className="flex">
                                <Sidebar/>
                                <div className="w-full">
                                    <HeaderClient/>
                                    <div className="padding-header bg-primaryBackgroundColor">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </SideBarBasketProvider>
                    </BasketProvider>
                </DialogProvider>
            </ToastProvider>
        </>
    );
}