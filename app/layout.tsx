import '@mantine/core/styles.css';
import React from 'react';
import { mantineHtmlProps, MantineProvider } from '@mantine/core';
import AppShellWrapper from '@/components/AppShellWrapper/AppShellWrapper';
import { AppProvider } from '@/app/lib/AppContext';

export const metadata = {
  title: 'Poikainscore 2.0',
  description: 'PWA to keep track of scores',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
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
