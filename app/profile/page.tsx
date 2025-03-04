'use client';

import { useRouter } from 'next/navigation';
import { IconLogout } from '@tabler/icons-react';
import { Button, LoadingOverlay, Stack, Text, Image, AspectRatio } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import ImageUpload from '@/components/ImageUpload/ImageUpload';

export default function Page() {
  const router = useRouter();
  const { user, loading, userObjects, clearContext, fetchUserObjects } = useAppContext();
  const userAvatar = user?._id ? userObjects[user.userName]?.image : null;



  const handleImageUpload = () => {
    fetchUserObjects();
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
    <Stack>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ color: 'black', radius: 'sm', blur: 4 }}
        loaderProps={{ color: 'red', type: 'bars' }}
      />
      <Stack align="flex-end">
        <Button
          onClick={handleLogout}
          c={'#9c9c9c'}
          w={'130px'}
          variant="subtle"
          size="md"
          rightSection={<IconLogout />}
        >
          Logout
        </Button>
      </Stack>

      <Stack align="center">
        <AspectRatio>
          <Image
            src={userAvatar}
            alt="Profile Picture"
            h={150}
            w={150}
            radius="50%"
            style={{ objectFit: "cover" }}
          />
        </AspectRatio>
        <ImageUpload setSelectedImage={handleImageUpload} />
        <Text mt={'-10px'} size="35px" fw={'bold'} c={'white'}>
          {user?.userName}
        </Text>
      </Stack>
    </Stack>
  );
}
