import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import React from "react";
import { mantineHtmlProps, MantineProvider } from "@mantine/core";
import { AppProvider } from "@/app/lib/AppContext";
import AppShellWrapper from "@/components/AppShellWrapper/AppShellWrapper";
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: "Poikainscore 2.0",
  description: "Kovaa ajoa ja hurjaa peliä",
  icons: {
    icon: [
      {
        url: "/poikainscoreFavicon.png",
        sizes: "192x192",
        type: "image/png",
      }
    ],
    apple: [
      {
        url: "/poikainscoreFavicon.png",
        sizes: "192x192", 
        type: "image/png",
      }
    ]
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
      </head>
      <body>
        <MantineProvider>
          <AppProvider>
            <AppShellWrapper>{children}</AppShellWrapper>
          </AppProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
