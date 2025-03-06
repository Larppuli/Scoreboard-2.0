import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import React from "react";
import { mantineHtmlProps, MantineProvider } from "@mantine/core";
import { Metadata, Viewport } from 'next';
import { AppProvider } from "@/app/lib/AppContext";
import AppShellWrapper from "@/components/AppShellWrapper/AppShellWrapper";

export const metadata: Metadata = {
  title: "Poikainscore 2.0",
  description: "Kovaa ajoa ja hurjaa peliä",
  generator: "Next.js",
  creator: "Lauri Talvitie",
  icons: {
    apple: [
      {
        url: "/poiainscoreFavicon.png",
        sizes: '192x192',
        type: "image/png"
      }
    ]
  },
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
