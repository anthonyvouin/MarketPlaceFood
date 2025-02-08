import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/images/snap&shop.png" width={40} height={40} alt="Snap&Shop Logo" />
          <h2 className="text-sm md:text-xl font-extrabold text-actionColor tracking-wide uppercase font-manrope">Snap&Shop</h2>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/legal-notices" className="text-actionColor hover:underline">Mentions Légales</Link>
          <Link href="/conditions-of-sale" className="text-actionColor hover:underline">CGV</Link>
          <Link href="/rgpd" className="text-actionColor hover:underline">RGPD</Link>
          <Link href="/politic-cookie" className="text-actionColor hover:underline">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
