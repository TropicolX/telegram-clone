import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';

import '@stream-io/video-react-sdk/dist/css/styles.css';
// import 'stream-chat-react/dist/css/v2/index.css';
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
    <ClerkProvider>
      <html lang="en">
        <body className="h-screen w-screen antialiased text-color-text select-none overflow-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
