import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import React from "react";
import { mantineHtmlProps, MantineProvider } from "@mantine/core";
import { AppProvider } from "@/app/lib/AppContext";
import AppShellWrapper from "@/components/AppShellWrapper/AppShellWrapper";

export const metadata = {
  title: "Poikainscore 2.0",
  description: "Kovaa ajoa ja hurjaa peliä",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/poikainscoreFavicon.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/poikainscoreFavicon.png"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
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
