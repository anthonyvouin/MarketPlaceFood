import SessionWrapper from "@/lib/SessionWrapper";
import Link from "next/link";

export default function AdminLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <div className="flex  h-screen">
            <nav className="flex flex-col width-15  bg-light">
                <Link href="/admin/dashboard" className=" text-lg p-2.5 font-semibold text-primaryColor relative underline-animation">Dashboard</Link>
                <Link href="/admin/category" className="text-lg p-2.5 font-semibold text-primaryColor relative  underline-animation">Categories</Link>
                <Link href="/admin/users" className="text-lg p-2.5 font-semibold text-primaryColor relative  underline-animation">Clients</Link>
                <Link href="/admin/contact" className="text-lg p-2.5 font-semibold text-primaryColor relative  underline-animation">Contacts</Link>

            </nav>

            <div className="width-85 p-2.5">
                <SessionWrapper>{children}</SessionWrapper>
            </div>

        </div>
        </body>
        </html>
    );
}