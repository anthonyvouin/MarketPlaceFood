import "./globals.css";
import "@radix-ui/themes/styles.css";
import SessionWrapper from "@/lib/SessionWrapper";
import { Theme } from "@radix-ui/themes";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: 'Snap&Shop',
  description: 'Snappez, commandez, cuisinez.'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className="min-h-screen">
          <Theme className="flex">
            <Sidebar />
            <SessionWrapper>{children}</SessionWrapper>
          </Theme>
        </body>
    </html>
  );
}
