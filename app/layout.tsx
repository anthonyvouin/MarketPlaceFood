import localFont from "next/font/local";
import SessionWrapper from "@/lib/SessionWrapper";
import "./globals.css";
import Head from "next/head";
import LayoutWrapper from "./components/layoutWrapper/LayoutWrapper";
import {Metadata} from "next";
import React from "react";
import {PrimeReactProvider} from "primereact/api";
import {ConfirmDialog} from "primereact/confirmdialog";
import { ShippingAddressProvider } from './provider/shipping-address-provider';

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});
export const metadata: Metadata = {
    title: 'Snap&Shop',
    description: 'Snappez, commandez, cuisinez.'
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="fr">
        <Head>
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"
            />
        </Head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <SessionWrapper>
            <PrimeReactProvider>
                <ShippingAddressProvider>
                    <LayoutWrapper>
                        <ConfirmDialog />
                        {children}
                    </LayoutWrapper>
                </ShippingAddressProvider>
            </PrimeReactProvider>
        </SessionWrapper>
        </body>
        </html>
    );
}