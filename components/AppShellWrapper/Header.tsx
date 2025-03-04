'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppShell, Container, Title, Avatar } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';

function Header() {
  const pathname = usePathname();
  const { userObjects, user } = useAppContext();

  const pageNames: { [key: string]: string } = {
    '/': 'Stats',
    '/new-game': 'New game',
    '/games': 'Games',
    '/login': 'Login',
    '/signup': 'Sign up',
    '/profile': 'Profile',
  };

  const userAvatar = user?._id ? userObjects[user.userName]?.image : null;

  return (
    <AppShell.Header bg="#08141c" style={{ borderBottom: '1px solid #081c2c' }}>
      <Container size="sm" p="md" bg="#08141c" style={{ textAlign: 'center', borderBottom: '1px solid #081c2c'}}>
        <Avatar src={userAvatar} style={{ position: 'absolute', top: 10, left: 10 }}/>
        <Title order={4} c="white">
          {pageNames[pathname]}
        </Title>
      </Container>
    </AppShell.Header>
  );
}

export default Header;
