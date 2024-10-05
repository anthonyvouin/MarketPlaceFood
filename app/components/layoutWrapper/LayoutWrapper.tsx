'use client';

import {usePathname} from "next/navigation";
import HeaderClient from "@/app/components/header/client-header/header-client";
import Sidebar from "@/app/components/Sidebar";
import {Theme} from "@radix-ui/themes";

export default function LayoutWrapper({children}: { children: React.ReactNode }) {
    const pathname: string = usePathname();

    if (pathname.startsWith("/admin")) {
        return <>{children}</>;
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