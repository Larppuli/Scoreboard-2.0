'use client';

import { IconLogout } from '@tabler/icons-react';
import { Stack, Button } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    // Logout function that sends a POST request to the server
    const handleLogout = async () => {
        try {
          const res = await fetch('/api/logout', { method: 'POST' });
          if (!res.ok) throw new Error('Logout failed');
          router.push('/login');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    return (
        <Stack>
            <Stack align="flex-end">
                <Button onClick={handleLogout} c={'#9c9c9c'}  w={'130px'} variant="subtle" size="md" rightSection={<IconLogout />}>Logout</Button>
            </Stack>
        </Stack>
    )
  }