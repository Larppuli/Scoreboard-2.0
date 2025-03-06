'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconLock, IconLogin2, IconUser, IconX } from '@tabler/icons-react';
import {
  Button,
  Container,
  Fieldset,
  Notification,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';

export default function Page() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetchUser, user } = useAppContext();

  const xIcon = <IconX size={20} />;

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.error || 'Login failed');
      }

      const data = await response.json();

      router.replace('/profile');
      refetchUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user, router]);

  return (
    <Container size="xs" px="md" py="xl">
      <Stack align="stretch">
        <Stack>
          <Fieldset radius="md" pt="md" bg="#252525" bd="1px solid #333" disabled={loading}>
            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                <TextInput
                  size="md"
                  type="text"
                  name="email"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  leftSection={<IconUser size={20} />}
                  leftSectionPointerEvents="none"
                  styles={(theme) => ({
                    input: {
                      backgroundColor: theme.colors.dark[6],
                      color: theme.colors.gray[0],
                      borderColor: theme.colors.dark[5],
                    },
                  })}
                />
                <PasswordInput
                  size="md"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  leftSection={<IconLock size={20} />}
                  leftSectionPointerEvents="none"
                  styles={(theme) => ({
                    input: {
                      backgroundColor: theme.colors.dark[6],
                      color: theme.colors.gray[0],
                      borderColor: theme.colors.dark[5],
                    },
                  })}
                />
                <Button
                  leftSection={<IconLogin2 />}
                  type="submit"
                  size="md"
                  my="xs"
                  radius="md"
                  loading={loading}
                  loaderProps={{ type: 'dots' }}
                  disabled={!password || !emailOrUsername}
                  style={{
                    backgroundColor:
                      !password || !emailOrUsername ? 'rgba(128, 128, 128, 0.1)' : '#3493d3',
                    color: !password || !emailOrUsername ? '' : '#363636',
                  }}
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Fieldset>
          <Stack align="center" lh="xs" ta="center" mt="lg">
            <Text size="md" c="#f0f0f0">
              No account yet? <br />
              <Link href="/signup">
                <span style={{ color: '#0070f3', textDecoration: 'underline' }}>Sign up</span>
              </Link>
            </Text>
            {error && (
              <Notification icon={xIcon} color="red" title="Oh dear!" withCloseButton={false}>
                {error}
              </Notification>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
