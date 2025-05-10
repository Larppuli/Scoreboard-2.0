'use client';

import { Group, Tabs, Text, Button, Image } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconChartBar,
  IconSquareRoundedPlus,
  IconList,
  IconUserCircle,
  IconLogout
} from '@tabler/icons-react';
import { useAppContext } from '@/app/lib/AppContext';
import { audiowide } from '@/app/fonts';

const navItems = [
  { icon: IconChartBar, label: 'Stats', path: ['/'] },
  { icon: IconSquareRoundedPlus, label: 'New game', path: ['/new-game', '/autodarts'] },
  { icon: IconList, label: 'Games', path: ['/games'] },
  { icon: IconUserCircle, label: 'Profile', path: ['/profile', '/profile/achievements'] },
];

function DesktopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearContext } = useAppContext();

  const handleChange = (value: string | null) => {
    if (value && value !== pathname) {
      router.push(value);
    }
  };

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

  return (
    <Group 
        bg="#0c1d27"
        align='center'
        style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderBottom: '1px solid #0d273b',
          }}
    >
      <Group>
        <Image
            src="/poikainscoreFavicon.png"
            alt="Logo"
            width={50}
            height={50}
            style={{ marginLeft: '20px' }}
        />
        <Text c={'white'} className={audiowide.className} size='30px'>
            Poikainscore
        </Text>
      </Group>
        <Tabs 
            value={pathname} 
            onChange={handleChange} 
            bg="#0c1d27"
            color='#ff0052'
            variant="none"
            ml={70}
        >
            <Tabs.List>
                {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path.includes(pathname);

                return (
                    <Tabs.Tab
                        key={item.path[0]}
                        value={item.path[0]}
                        leftSection={<Icon size={30} color={isActive ? '#ff0052' : '#f0f0f0'} />}
                    >
                        <Text c={'white'} size="m">{item.label}</Text>
                    </Tabs.Tab>
                );
                })}
                </Tabs.List>
            </Tabs>
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
    </Group>
  );
}

export default DesktopNavigation;
