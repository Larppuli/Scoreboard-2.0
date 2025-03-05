'use client';

import React from 'react';
import { AppShell } from '@mantine/core';
import BottomNavigation from './BottomNavigation';
import Header from './Header';

function AppShellWrapper({ children }: { children: any }) {
  return (
    <AppShell header={{ height: 55 }} footer={{ height: 90 }} padding="md">
      <Header />
      <AppShell.Main bg="#080c0c">{children}</AppShell.Main>
      <BottomNavigation />
    </AppShell>
  );
}

export default AppShellWrapper;
