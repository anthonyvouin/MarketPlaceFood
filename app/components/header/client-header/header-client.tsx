"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/app/components/auth/logout";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useCart } from "@/app/provider/cart-provider";
import { useSideBarBasket } from "@/app/provider/sideBar-cart-provider";
import Sidebar from "../../sidebar/Sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ProfilSidebar from "../../sidebar/profil-sidebar";

export default function HeaderClient(): JSX.Element {
    const [name, setName] = useState('');
    const { data: session, status } = useSession();
    const { totalLengthItems } = useCart();
    const { toggleBasketList } = useSideBarBasket();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name[0].toUpperCase());
        }
    }, [session]);

    const pathname: string = usePathname();

    return (
        <header className="flex items-center justify-between w-full h-20 px-8 bg-white shadow-md z-50 border-b border-gray-200">
            <div className="flex items-center gap-4">
                <Button
                    icon="pi pi-bars"
                    className="bg-actionColor text-white w-10 h-10 hover:bg-actionColorHover"
                    onClick={toggleSidebar}
                />
                <Link href="/" className="items-center gap-2 cursor-pointer hidden md:flex">
                    <Image src="/images/logo.svg" width={40} height={40} alt="Snap&Shop Logo" />
                    <h2 className="text-sm md:text-xl font-extrabold text-actionColor tracking-wide uppercase font-manrope">Snap&Shop</h2>
                </Link>
                { pathname.startsWith("/profil") ? 
                <ProfilSidebar isOpenSidebar={isOpen} setIsOpenSidebar={setIsOpen} />
                : <Sidebar isOpenSidebar={isOpen} setIsOpenSidebar={setIsOpen} />

 } 
            </div>
            <div className="flex items-center gap-6">
                {status === 'authenticated' ? (
                    <>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-4">

                                <div className="relative cursor-pointer group">
                                    <Button
                                        rounded
                                        icon="pi pi-shopping-cart"
                                        className="bg-actionColor text-white w-10 h-10 shadow-lg 
                                    transition-all duration-300 ease-in-out hover:scale-105
                                        group-hover:bg-darkActionColor group-hover:rotate-12"
                                        onClick={toggleBasketList}
                                        aria-label="Voir le panier" />

                                    {totalLengthItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transition-all duration-300 ease-in-out">
                                            {totalLengthItems}
                                        </span>
                                    )}
                                </div>


                                {/*<Button*/}
                                {/*    rounded*/}
                                {/*    icon="pi pi-bell"*/}
                                {/*    className="bg-actionColor text-white w-10 h-10 shadow-lg */}
                                {/*    transition-all duration-300 ease-in-out hover:scale-105*/}
                                {/*    hover:bg-darkActionColor hover:rotate-12"*/}
                                {/*    aria-label="Voir les notifications"*/}
                                {/*/>*/}

                                <Link href="/profil">
                                    <Avatar
                                        label={name}
                                        shape="circle"
                                        className="bg-actionColor text-white w-10 h-10 shadow-lg 
                                    transition-all duration-300 ease-in-out hover:scale-105
                                        hover:bg-darkActionColor hover:rotate-12"/>
                                </Link>

                            </div>
                            { session?.user?.['role'] === "ADMIN" && (
                                <Link href="/admin">
                                    <Button
                                        rounded
                                        className="flex justify-center items-center bg-info text-white w-10 h-10 shadow-lg 
                                            transition-all duration-300 ease-in-out hover:scale-105
                                            hover:bg-darkActionColor hover:rotate-12">
                                        <span className="pi pi-folder text-lg"></span>
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <LogoutButton />
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-actionColor font-semibold border-2 border-actionColor flex-row
                            hover:text-white hover:bg-actionColor transition-all duration-300 transform hover:scale-105 px-4 py-2 rounded-md"
                        aria-label="Connexion"
                        role="button"
                    >
                        <span className='text-sm md:text-lg'>Connexion</span>
                        <i className="pi pi-sign-in !hidden md:!inline-block"/>
                    </Link>
                )}
            </div>
        </header>
    )
}