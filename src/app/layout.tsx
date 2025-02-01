import type { Metadata } from 'next';

import './globals.scss';

export const metadata: Metadata = {
  title: 'Telegram Web Clone',
  description: 'A Telegram Web clone built with Next.js and Stream',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-svh w-svw lg:h-screen lg:w-screen antialiased text-color-text select-none overflow-hidden">
        {children}
      </body>
    </html>
  );
}
