import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from './ui/footer';
import { W95FA } from '@/app/ui/fonts';
import Image from 'next/image';
import DesktopEnvironment from './ui/desktopEnvironment';

export const metadata: Metadata = {
  title: "Ledger95",
  description: "Ledger95 - for all your accounting needs, fresh from the 90s.",
};

// Background, desktop icons and footer are all defined below, for use throughout entire website.
export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${W95FA.className} antialiased`}>
        <div className="site-wrapper">
          <div className="background-image" />
          <main className="page-content">
            {children}
            <DesktopEnvironment />
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}