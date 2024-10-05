import type {Metadata} from "next";
import localFont from "next/font/local";
import SessionWrapper from "@/lib/SessionWrapper";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import {Theme} from "@radix-ui/themes";
import Head from "next/head";
import LayoutWrapper from "./components/layoutWrapper/LayoutWrapper";

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


export const metadata : Metadata = {
    title: 'Snap&Shop',
    description: 'Snappez, commandez, cuisinez.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    {/*<Head>*/}
    {/*    <link*/}
    {/*        href="https://fonts.googleapis.com/icon?family=Material+Icons"*/}
    {/*        rel="stylesheet"*/}
    {/*    />*/}
    {/*</Head>*/}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
            <LayoutWrapper>
            {children}
            </LayoutWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
