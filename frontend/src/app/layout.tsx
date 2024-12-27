import React from 'react';

import type { Metadata } from 'next';

import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Audio Recorder',
  description: 'Audio Recorder App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon.png"
        />
      </head>

      <body className="w-full h-screen">{children}</body>
    </html>
  );
}
