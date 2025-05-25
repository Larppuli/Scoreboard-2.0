"use client";

import { useState, useEffect } from 'react';
import { Stack, MultiSelect } from "@mantine/core";
import Leaguetable from "@/components/StatsPage/Leaguetable";
import OverallStats from '@/components/StatsPage/OverallStats';
import { useAppContext } from '@/app/lib/AppContext';
import PersonAccordion from '@/components/StatsPage/PersonAccordion';

export default function HomePage() {
  const { users, games, userObjects } = useAppContext();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Sync selectedUsers with first 4 users when users are load
  useEffect(() => {
    if (users && users.length > 0 && selectedUsers.length === 0) {
      setSelectedUsers(users.slice(0, 4).map((user) => user._id));
    }
  }, [users]);

  const handleUserChange = (value: string[]) => {
    setSelectedUsers(value);
  };

  const formattedSelectedUsers = selectedUsers.map((userId) => {
    const user = users?.find((user) => user._id === userId);
    return {
      _id: userId,
      userName: user?.userName ?? "Unknown",
      firstName: user?.firstName ?? "Unknown",
      lastName: user?.lastName ?? "Unknown",
      admin: user?.admin ?? false,
    };
  });

  const filteredGames = games?.filter((game) =>
    game.participants.every((participant) => selectedUsers.includes(participant))
  );

  return (
    <Stack gap={1}>
      <MultiSelect
        data={users?.map(user => ({ value: user._id, label: user.firstName }))}
        placeholder={selectedUsers.length === 0 ? "Select users to show leaguatable" : ""}
        mb={10}
        value={selectedUsers}
        onChange={handleUserChange}
        comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
        styles={{
          input: {
            backgroundColor: '#141414',
            color: '#ffffff',
            alignContent: 'center',
            border: 0,
            borderRadius: '5px',
          },
          dropdown: {
            backgroundColor: '#141414',
            color: '#ffffff',
            border: 0,
            borderRadius: '5px',
          },
          option: {
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#313142',
            },
          },
        }}
        />
      <Leaguetable users={formattedSelectedUsers ?? []} games={filteredGames ?? []}/>
      <OverallStats games={games ?? []}/>
      <PersonAccordion games={games ?? []} userObjects={userObjects ?? []}/>
    </Stack>
  );
}