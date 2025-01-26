'use client';

import {usePathname} from "next/navigation";
import HeaderClient from "@/app/components/header/client-header/header-client";
import Sidebar from "@/app/components/sidebar/Sidebar";
import ProfilSidebar from "@/app/components/sidebar/profil-sidebar";
import React from "react";
import {CartProvider} from "@/app/provider/cart-provider";
import {SideBarBasketProvider} from "@/app/provider/sideBar-cart-provider";
import {ToastProvider} from "@/app/provider/toastProvider";

export default function LayoutWrapper({children}: { children: React.ReactNode }) {
    const pathname: string = usePathname();

    if (pathname.startsWith("/admin")) {
        return <>
            {children}
        </>;
    }

    
    if (pathname.startsWith("/profil")) {
        return (<>
                <ToastProvider>
                    <CartProvider>
                        <SideBarBasketProvider>
                            <div className="flex">
                                <div className="w-full">
                                    <HeaderClient/>
                                    <div className="bg-primaryBackgroundColor">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </SideBarBasketProvider>
                    </CartProvider>
                </ToastProvider>
            </>
        )
    }

    return (
        <>
            <ToastProvider>
                <CartProvider>
                    <SideBarBasketProvider>
                        <div className="flex">
                            <div className="w-full">
                                <HeaderClient/>
                                <div className=" bg-primaryBackgroundColor">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </SideBarBasketProvider>
                </CartProvider>
            </ToastProvider>
        </>
    );
}