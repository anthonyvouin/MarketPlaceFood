import Link from 'next/link';
import Image from 'next/image'
import {SidebarLinks} from "@/app/interface/sidebar-links/sidebar-links";

const links: SidebarLinks[] = [
    {name: 'Accueil', href: '/', icon:'pi pi-home'},
    {name: 'Produits', href: '/products', icon: 'pi pi-barcode'},
];

const Sidebar = () => {
    return (
        <aside className="w-64 h-screen p-4 bg-white">
            <div className='fixed top-0 h-full'>
                <Link href="/">
                    <div className="flex justify-center items-center mb-8 gap-1">
                        <Image src="/images/logo.svg" width={60} height={60} alt="DriveFood"/>
                        <h2 className="text-lg font-black font-manrope text-actionColor uppercase">DriveFood</h2>
                    </div>
                </Link>
                <nav>
                    <ul>
                        {links.map((link) => (
                            <Link href={link.href} key={link.href} className="mb-4 flex  justify-start gap-5 group font-manrope">
                                <span className='border-l-4 rounded-full border-actionColor opacity-0 group-hover:opacity-100  transition-all'></span>
                                <div className='flex gap-3 items-center'>
                                    <span className={`${link.icon} group-hover:text-actionColor`}/>
                                    <p className='group-hover:text-actionColor'>{link.name}</p>
                                </div>
                            </Link>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;