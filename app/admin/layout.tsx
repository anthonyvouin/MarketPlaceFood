import SessionWrapper from "@/lib/SessionWrapper";
import Link from "next/link";
import React from "react";
import Head from "next/head";
import {Theme} from "@radix-ui/themes";
import HeaderClient from "@/app/components/header/client-header/header-client";

export default function AdminLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Theme>
            <div className="flex  h-screen">
              <nav className="flex flex-col width-15  bg-light">
                <Link
                  href="/admin/dashboard"
                  className="nav-title text-lg p-2.5 font-semibold text-primaryColor relative underline-animation"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/category"
                  className="nav-title text-lg p-2.5 font-semibold text-primaryColor relative underline-animation"
                >
                  Categories
                </Link>
                <Link
                  href="/admin/users"
                  className="nav-title text-lg p-2.5 font-semibold text-primaryColor relative underline-animation"
                >
                  Clients
                </Link>
                <Link
                  href="/admin/contact"
                  className="nav-title text-lg p-2.5 font-semibold text-primaryColor relative underline-animation"
                >
                  Contacts
                </Link>
                <Link
                  href="/admin/product"
                  className="nav-title text-lg p-2.5 font-semibold text-primaryColor relative underline-animation"
                >
                  Produits
                </Link>
                <Link
                  href="/admin/chart"
                  className="nav-title text-lg p-2.5 font-semibold text-primaryColor relative underline-animation"
                >
                  Graphique
                </Link>
              </nav>

              <div className="width-85">
                <SessionWrapper>{children}</SessionWrapper>
              </div>
            </div>
          </Theme>
        </body>
      </html>
    );
}