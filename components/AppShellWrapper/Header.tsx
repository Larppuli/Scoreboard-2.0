'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppShell, Group, Title } from '@mantine/core';

function Header() {
  const pathname = usePathname();

  const pageNames: { [key: string]: string } = {
    '/': 'Stats',
    '/new-game': 'New game',
    '/games': 'Games',
    '/login': 'Login',
    '/signup': 'Sign up',
    '/profile': 'Profile',
  };

  return (
    <AppShell.Header bg="#08141c" style={{ borderBottom: '1px solid #081c2c' }}>
      <Group h="100%" px="md" justify="center">
        <Title order={4} c="white">
          {pageNames[pathname]}
        </Title>
      </Group>
    </AppShell.Header>
  );
}

export default Header;
