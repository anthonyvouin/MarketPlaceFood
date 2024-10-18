import Link from 'next/link';
import Image from 'next/image'
import {Flex} from '@radix-ui/themes';
import {GearIcon, BellIcon, FileTextIcon, HomeIcon} from "@radix-ui/react-icons"
import {SidebarLinks} from "@/app/interface/sidebar-links/sidebar-links";


const links: SidebarLinks[] = [
    {name: 'Générale', href: '/profil', icon: GearIcon},
    {name: 'Adresses', href: '/profil/adresses', icon: HomeIcon},
    {name: 'Notifications', href: '/notification', icon: BellIcon},
    {name: 'Commandes', href: '/commandes', icon: FileTextIcon},
];

const ProfilSidebar = () => {
    return (
        <aside className="w-64 h-screen p-4 bg-white">
            <div className='fixed top-0 h-full'>
                <Link href="/">
                    <Flex className="flex justify-center items-center mb-8 gap-1">
                        <Image src="/images/logo.svg" width={60} height={60} alt="DriveFood"/>
                        <h2 className="text-lg font-black font-manrope text-actionColor uppercase">DriveFood</h2>
                    </Flex>
                </Link>
                <nav>
                    <ul>
                        {links.map((link) => (
                            <Link href={link.href} key={link.href} className="mb-4 flex  justify-start gap-5 group font-manrope">
                                <span className='border-l-4 rounded-full border-actionColor opacity-0 group-hover:opacity-100  transition-all'></span>
                                <div className='flex gap-3 items-center'>
                                    <link.icon className='group-hover:text-actionColor'/>
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

export default ProfilSidebar;