'use client'

import React from 'react';
import { AppShell } from '@mantine/core';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

function AppShellWrapper({ children }: { children: any }) {

  return (
    <AppShell
      header={{ height: 50 }}
      footer={{ height: 90 }}
      padding="md"
    >
      <Header />
      <AppShell.Main bg='#080c0c'>{children}</AppShell.Main>
      <BottomNavigation />
    </AppShell>
  );
}

export default AppShellWrapper;