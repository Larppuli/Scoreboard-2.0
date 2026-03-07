import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import React from "react";
import { Caveat } from 'next/font/google';
import { mantineHtmlProps, MantineProvider } from "@mantine/core";
import { AppProvider } from "@/app/lib/AppContext";
import AppShellWrapper from "@/components/AppShellWrapper/AppShellWrapper";
import { Metadata, Viewport } from 'next';

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
});

export const metadata: Metadata = {
  title: "Poikainscore 2.0",
  description: "Kovaa ajoa ja hurjaa peliä",
  icons: {
    icon: [{ url: "/poikainscoreFavicon.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/poikainscoreFavicon.png", sizes: "192x192", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps} className={caveat.variable}>
      <head />
      <body>
        <MantineProvider defaultColorScheme="dark">
          <AppProvider>
            <AppShellWrapper>{children}</AppShellWrapper>
          </AppProvider>
        </MantineProvider>
      </body>
    </html>
  );
}