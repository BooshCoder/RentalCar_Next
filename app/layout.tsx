import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import Header from '@/components/Header';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Rental Car - Find your perfect rental car',
  description: 'Reliable and budget-friendly car rentals for any journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={manrope.variable} suppressHydrationWarning>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

