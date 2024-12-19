import Link from 'next/link';
import Image from 'next/image';
import { SidebarLinks } from "@/app/interface/sidebar-links/sidebar-links";

const links: SidebarLinks[] = [
    { name: 'Compte', href: '/profil', icon: 'pi pi-cog' },
    {
        name: 'Recette', href: '/profil/recipes', icon: 'pi pi-book', 
        subLinks: [
            { name: 'Favoris', href: '/profil/recipes/favorites', icon: 'pi pi-star' },
            { name: 'Générations', href: '/profil/recipes/generation', icon: 'pi pi-pencil' },
        ]
    },
    { name: 'Adresses', href: '/profil/adresses', icon: 'pi pi-home' },
    { name: 'Notifications', href: '/notification', icon: 'pi pi-bell' },
    { name: 'Commandes', href: '/profil/commandes', icon: 'pi pi-file' },
];

const ProfilSidebar = () => {
    return (
        <aside className="w-64 h-screen p-4 bg-white">
            <div className='fixed top-0 h-full'>
                <Link href="/">
                    <div className="flex justify-center items-center mb-8 gap-1">
                        <Image src="/images/logo.svg" width={60} height={60} alt="DriveFood" />
                        <h2 className="text-lg font-black font-manrope text-actionColor uppercase">DriveFood</h2>
                    </div>
                </Link>
                <nav>
                    <ul>
                        {links.map((link) => (
                            <li key={link.href} className="mb-4">
                                <Link href={link.href} className="flex justify-start gap-5 group font-manrope">
                                    <span className='border-l-4 rounded-full border-actionColor opacity-0 group-hover:opacity-100 transition-all'></span>
                                    <div className='flex gap-3 items-center'>
                                        <span className={`${link.icon} group-hover:text-actionColor`} />
                                        <p className='group-hover:text-actionColor'>{link.name}</p>
                                    </div>
                                </Link>
                                {link.subLinks && (
                                    <ul className="ml-4 mt-2">
                                        {link.subLinks.map((subLink) => (
                                            <li key={subLink.href} className="mb-2">
                                                <Link href={subLink.href} className="flex justify-start gap-5 group font-manrope">
                                                    <span className='border-l-4 rounded-full border-actionColor opacity-0 group-hover:opacity-100 transition-all'></span>
                                                    <div className='flex gap-3 items-center'>
                                                        <span className={`${subLink.icon} group-hover:text-actionColor`} />
                                                        <p className='group-hover:text-actionColor'>{subLink.name}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default ProfilSidebar;