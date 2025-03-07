'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';
import { AppShell, Avatar, Button, Container, Title } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';

function Header() {
  const pathname = usePathname();
  const { userObjects, user, clearContext, games } = useAppContext();
  const userAvatar = user?._id 
  ? userObjects.find((u) => u._id === user._id)?.image || null
  : null;


  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Logout failed');
      router.push('/login');
      clearContext();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      <Container size="sm" p="md" style={{ textAlign: 'center' }}>
        <Avatar src={userAvatar} style={{ position: 'absolute', top: 6, left: 15 }} />
        <Title order={4} c="white" mt={'-3px'}>
          {pageNames[pathname]}
        </Title>
        <Button
          onClick={handleLogout}
          c={'#9c9c9c'}
          w={'130px'}
          variant="subtle"
          size="md"
          rightSection={<IconLogout />}
          style={{ position: 'absolute', top: 4, right: 0 }}
        >
          Logout
        </Button>
      </Container>
    </AppShell.Header>
  );
}

export default Header;
