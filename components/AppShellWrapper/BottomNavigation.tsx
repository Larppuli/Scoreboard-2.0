import React from 'react';
import { AppShell, Group, Button, Stack, Text } from '@mantine/core';
import { IconChartBar, IconSquareRoundedPlus, IconList, IconUserCircle } from '@tabler/icons-react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { icon: <IconChartBar size={24} />, label: 'Stats', path: '/' },
    { icon: <IconSquareRoundedPlus size={24} />, label: 'New game', path: '/new-game' },
    { icon: <IconList size={24} />, label: 'Games', path: '/games' },
    { icon: <IconUserCircle size={24} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <AppShell.Footer bg='#08141c' style={{ borderTop: '1px solid #081c2c' }}>
      <Group grow h='100px'>
        {navItems.map((item) => (
          <Link href={item.path} key={item.label} >
            <Button mb='40px' w='23vw' bg='inherit' h='50px'>
                <Stack align="center" gap='7px' c={pathname === item.path ? '#ff0052' : '#f0f0f0'}>
                    {item.icon}
                    <Text size="xs">{item.label}</Text>
                </Stack>
            </Button>
          </Link>
        ))}
      </Group>
    </AppShell.Footer>
  );
}

export default BottomNavigation;