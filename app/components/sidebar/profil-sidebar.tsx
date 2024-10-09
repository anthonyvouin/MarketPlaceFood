import Link from 'next/link';
import Image from 'next/image'
import {Flex} from '@radix-ui/themes';
import {GearIcon, BellIcon, FileTextIcon, HomeIcon} from "@radix-ui/react-icons"


const links = [
    {name: 'Générale', href: '/', icon: GearIcon},
    {name: 'Adresses', href: '/profil/adresses', icon: HomeIcon},
    {name: 'Notifications', href: '/products', icon: BellIcon},
    {name: 'Commandes', href: '/products', icon: FileTextIcon},
];

const ProfilSidebar = () => {
    return (
        <aside className="w-64 h-screen p-4 bg-white">
            <Flex className="flex justify-center items-center mb-8 gap-1">
                <Image src="/images/logo.svg" width={60} height={60} alt="DriveFood"/>
                <h2 className="text-lg font-black font-manrope text-actionColor uppercase">DriveFood</h2>
            </Flex>
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
        </aside>
    );
};

export default ProfilSidebar;