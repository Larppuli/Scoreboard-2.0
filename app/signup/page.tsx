'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconAt, IconLock, IconUser, IconUserPlus } from '@tabler/icons-react';
import { Button, Container, Fieldset, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';

export default function Page() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { refetchUser } = useAppContext();

  const router = useRouter();

  const handleFormChange = () => {
    setIsFormValid(formRef.current?.checkValidity() ?? false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setSubmitError(null);

    const formData = new FormData(formRef.current);
    const data = {
      userName: formData.get('userName') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    if (data.password !== data.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFieldErrors(errorData.errors || {});
        setSubmitError(errorData.message || 'Signup failed');
        return;
      }

      console.log('User created successfully');
      router.push('/profile');
      refetchUser();
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" px="md" py="xl">
      <Stack align="stretch">
        <Stack>
          <Fieldset
            variant="default"
            radius="md"
            pt="md"
            bg="#252525"
            bd="1px solid #333"
            disabled={loading}
          >
            <form onChange={handleFormChange} onSubmit={handleSubmit} ref={formRef}>
              <Stack gap="md">
                <TextInput
                  size="md"
                  name="userName"
                  placeholder="Username"
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
                <TextInput
                  size="md"
                  name="firstName"
                  placeholder="First Name"
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
                <TextInput
                  size="md"
                  name="lastName"
                  placeholder="Last Name"
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
                <TextInput
                  size="md"
                  name="email"
                  placeholder="Email"
                  required
                  leftSection={<IconAt size={20} />}
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
                  placeholder="Password"
                  required
                  error={fieldErrors.password}
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
                <PasswordInput
                  size="md"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  error={fieldErrors.confirmPassword}
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
                  leftSection={<IconUserPlus />}
                  my="xs"
                  radius="md"
                  type="submit"
                  size="md"
                  loading={loading}
                  loaderProps={{ type: 'dots' }}
                  style={{
                    backgroundColor: '#3493d3',
                    color: 'undefined',
                  }}
                >
                  Sign up
                </Button>
              </Stack>
            </form>
          </Fieldset>
          {submitError && (
            <Text c="red" size="sm" ta="center">
              {submitError}
            </Text>
          )}
          <Stack align="center" lh="xs" ta="center" mt="lg">
            <Text size="md" c="#f0f0f0">
              Do you already have an account? <br />
              <Link href="/login">
                <span style={{ color: '#0070f3', textDecoration: 'underline' }}>Login here</span>
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
