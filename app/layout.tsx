import type { Metadata } from "next";
import { W95FA } from '@/app/ui/fonts';
import "./globals.css";
import Footer from './ui/footer';
import DesktopEnvironment from './ui/desktopEnvironment';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: "Ledger95",
  description: "Ledger95 - for all your accounting needs, fresh from the 90s.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${W95FA.className} antialiased`}>
        <AuthProvider>
          <div className="site-wrapper">
            <div className="background-image" />
            <main className="page-content">
              {children}
              <DesktopEnvironment />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
