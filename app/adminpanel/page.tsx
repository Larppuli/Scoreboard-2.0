'use client'

import { useState } from 'react';
import { Transition, Notification, Text, Stack, TextInput, Group, Button, Select } from "@mantine/core";
import { IconRefresh, IconCirclePlus, IconDeviceFloppy, IconCheck } from "@tabler/icons-react";
import { useAppContext } from '@/app/lib/AppContext';

export default function AdminPanel() {
    const [refreshToken, setRefreshToken] = useState("");
    const [sport, setSport] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showTransition, setShowTransition] = useState<boolean>(false);
    const [tokenButtonLoading, setTokenButtonLoading] = useState<boolean>(false);
    const [sportButtonLoading, setSportButtonLoading] = useState<boolean>(false);
    const [passwordButtonLoading, setPasswordButtonLoading] = useState<boolean>(false);
    const { users } = useAppContext();

    const checkIcon = <IconCheck size={20} />;

    const handleRefreshTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRefreshToken(event.target.value);
      };

    const handleSportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSport(event.target.value);
    };

    const handleUserSelect = (value: string | null) => {
        setSelectedUser(value || "");
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRefreshTokenSubmit = async () => {
        setTokenButtonLoading(true);
        try {
            const response = await fetch('/api/autodarts-token', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to update token');
            }

            const data = await response.json();
            setMessage('Token updated successfully');
            setShowTransition(true);
            setTokenButtonLoading(false);
            setTimeout(() => {
                setShowTransition(false);
              }, 3000);
        } catch (error) {
            setTokenButtonLoading(false);
            console.error('Error updating token:', error);
        }
    };

    const handleSportSubmit = async (sport: string) => {
        setSportButtonLoading(true);
        try {
            const response = await fetch('/api/sports', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sport: sport }),
            });

            if (!response.ok) {
                throw new Error('Failed to add sport');
            }

            const data = await response.json();
            setSportButtonLoading(false);
            setMessage('Sport added successfully');
            setShowTransition(true);
            setTimeout(() => {
                setShowTransition(false);
              }, 3000);
        } catch (error) {
            setSportButtonLoading(false);
            console.error('Error adding sport:', error);
        }
    };

    const handlePasswordSubmit = async (password: string) => {
        setPasswordButtonLoading(true);
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: selectedUser, value: password, attribute: 'password' }),
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            const data = await response.json();
            setPasswordButtonLoading(false);
            setMessage('Password updated successfully');
            setShowTransition(true);
            setTimeout(() => {
                setShowTransition(false);
              }, 3000);
        } catch (error) {
            setPasswordButtonLoading(false);
            console.error('Error updating password:', error);
        }
    };

  return (
    <Stack>
    <Stack
        align="center"
        p={'18px'}
        bg={'#141414'}
        w={'100%'}
        mt={'4vh'}
        style={{ borderRadius: '5px' }}      
    >
        <Group w={'100%'} justify="center">
            <TextInput
                w={'70%'}
                size='md'
                name="refreshToken"
                placeholder="Autodarts Refresh Token"
                onChange={handleRefreshTokenChange}
                value={refreshToken}
                styles={(theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[6],
                    color: theme.colors.gray[0],
                    borderColor: theme.colors.dark[5],
                },
                })}
            />
            <Button
                size="md"
                w={60}
                variant="outline"
                color="red"
                loading={tokenButtonLoading}
                disabled={refreshToken.length < 20}
                onClick={() => {
                    handleRefreshTokenSubmit();
                }}
            >
                <IconRefresh size={20} />
            </Button>
        </Group>
        <Group w={'100%'} justify="center">
            <TextInput
                w={'70%'}
                size='md'
                name="newSport"
                placeholder="Add New Sport"
                value={sport}
                onChange={handleSportChange}
                styles={(theme) => ({
                    input: {
                        backgroundColor: theme.colors.dark[6],
                        color: theme.colors.gray[0],
                        borderColor: theme.colors.dark[5],
                    },
                })}
            />
            <Button
                size="md"
                w={60}
                variant="outline"
                loading={sportButtonLoading}
                color="red"
                disabled={sport.length < 2}
                onClick={() => {
                    handleSportSubmit(sport);
                }}
            >
                <IconCirclePlus size={20} />
            </Button>
        </Group>
        <Select
            placeholder="Select User"
            w={150}
            size='md'
            onChange={handleUserSelect}
            value={selectedUser}
            comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
            styles={(theme) => ({
                input: {
                    backgroundColor: theme.colors.dark[6],
                    color: theme.colors.gray[0],
                    borderColor: theme.colors.dark[5],
                },
                })}
            data={users? users.map(user => ({
                value: user._id,
                label: user.userName,
            })) : []}   
        />
        {selectedUser && (
            <Stack w={'100%'} justify="center" align="center">
                <Text fw={700} size="xl" ta="center">
                    Edit data of _id {selectedUser}
                </Text>
                <Group w={'100%'} justify="center">
                    <TextInput
                        w={'70%'}
                        size='md'
                        name="newPassword"
                        placeholder="Change Password"
                        value={password}
                        onChange={handlePasswordChange}
                        styles={(theme) => ({
                            input: {
                                backgroundColor: theme.colors.dark[6],
                                color: theme.colors.gray[0],
                                borderColor: theme.colors.dark[5],
                            },
                        })}
                    />
                    <Button
                        size="md"
                        w={60}
                        variant="outline"
                        loading={passwordButtonLoading}
                        color="red"
                        disabled={password.length < 6}
                        onClick={() => {
                            handlePasswordSubmit(password);
                        }}
                    >
                        <IconDeviceFloppy size={20} />
                    </Button>
                </Group>
            </Stack>
        )}
    </Stack>
        <Transition mounted={showTransition} transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
            <Notification
                bg={'#2e2d2d'}
                w={'100%'}
                style={styles}
                icon={checkIcon}
                color="teal"
                title="All good!"
                withCloseButton={false}
                styles={{
                    root: {
                    backgroundColor: '#2e2d2d',
                    },
                    title: {
                    color: '#ffffff',
                    },
                    description: {
                    color: '#ffffff',
                    },
                }}
            >
            {message}
            </Notification>
        )}
        </Transition>
    </Stack>
  );
};