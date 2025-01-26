'use client';

import SessionWrapper from '@/lib/SessionWrapper';

import Link from 'next/link';
import { SidebarLinks } from '../interface/sidebar/sidebar-links';
import { SidebarProps } from '../interface/sidebar/sidebar-props';
import { ToastProvider } from '../provider/toastProvider';
import { useState } from 'react';
import { Button } from 'primereact/button';
import { useSession } from 'next-auth/react';


function AdminSidebarNav() {
  const { data: session } = useSession();

  const adminLinks: SidebarLinks[] = [
    { name: 'Dashboard', href: '/admin/', icon: 'pi pi-chart-bar', roles: ['ADMIN'] },
    { name: 'Categories', href: '/admin/category', icon: 'pi pi-tags', roles: ['ADMIN'] },
    { name: 'Remises', href: '/admin/discount', icon: 'pi pi-percentage', roles: ['ADMIN'] },
    { name: 'Produits', href: '/admin/product', icon: 'pi pi-box', roles: ['ADMIN', 'STOREKEEPER'] },
    { name: 'Contacts', href: '/admin/contact', icon: 'pi pi-envelope', roles: ['ADMIN'] },
    { name: 'Graphique', href: '/admin/chart', icon: 'pi pi-chart-line', roles: ['ADMIN'] },
    { name: 'Commandes', href: '/admin/order', icon: 'pi pi-shopping-bag', roles: ['ADMIN'] },
    { name: 'Préparation Commandes', href: '/admin/prep-order', icon: 'pi pi-shopping-bag', roles: ['ADMIN', 'STOREKEEPER'] },
    { name: 'Notifications', href: '/admin/products-notifications', icon: 'pi pi-bell', roles: ['ADMIN'] },

  ];


  return (
    <nav className="flex-grow">
      <ul className="space-y-4">
        {adminLinks.map((link) => (
          <div key={link.href}>
            {link.roles?.includes(session?.user['role']) ? (
              <li>
                <Link
                  href={link.href || ''}
                  className="flex items-center gap-4 py-2 pl-4 rounded-lg transition-all hover:bg-actionColor hover:text-white"
                >
                  <span className={`${link.icon} text-lg`}/>
                  <p className="text-md">{link.name}</p>
                </Link>
              </li>
            ) : ('')}

          </div>
        ))}
      </ul>
    </nav>
  );
}


;

function AdminSideBar({ isOpenSidebar, setIsOpenSidebar }: SidebarProps) {
  return (
    <>
      <aside className={`
                w-64 h-screen bg-primaryBackgroundColor fixed left-0 top-0 z-50 
                shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out
                ${!isOpenSidebar ? '-translate-x-full' : 'translate-x-0'}
            `}>
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpenSidebar(false)}
            className="text-white h-10 w-full bg-primaryColor rounded-md">
            <span className="pi pi-times"/>
          </button>
        </div>
        <div className="sticky top-0 flex flex-col h-screen p-4 overflow-y-auto font-manrope">
          <AdminSidebarNav/>
        </div>
      </aside>
      <div
        className={`fixed inset-0 bg-black opacity-50 z-40 ${!isOpenSidebar && 'hidden'}`}
        onClick={() => setIsOpenSidebar(false)}
      />
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <html lang="en">
    <body>
    <div className="flex h-screen bg-primaryBackgroundColor">
      <Button
        icon="pi pi-bars"
        className="bg-actionColor text-white w-10 h-10 hover:bg-actionColorHover fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      />
      <AdminSideBar isOpenSidebar={isOpen} setIsOpenSidebar={setIsOpen}/>

      <div className="flex-1">
        <ToastProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </ToastProvider>
      </div>
    </div>
    </body>
    </html>
  );
}
