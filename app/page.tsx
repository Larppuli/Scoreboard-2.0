"use client";

import { useState, useEffect } from 'react';
import { Stack, MultiSelect } from "@mantine/core";
import Leaguetable from "@/components/StatsPage/Leaguetable";
import OverallStats from '@/components/StatsPage/OverallStats';
import { useAppContext } from '@/app/lib/AppContext';
import Reports from '@/components/StatsPage/Reports';

export default function HomePage() {
  const { users, games, reports } = useAppContext();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Sync selectedUsers with first 4 users when users are loaded
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
        placeholder={selectedUsers.length === 0 ? "Select players to compare..." : ""}
        mb={10}
        value={selectedUsers}
        onChange={handleUserChange}
        comboboxProps={{ 
          transitionProps: { transition: 'pop-top-left', duration: 200 },
          shadow: '0px 10px 30px rgba(0, 0, 0, 0.5)' 
        }}
        styles={{
          input: {
            backgroundColor: '#141414',
            color: '#e2e2e2',
            border: '1px solid #333',
            transition: 'border-color 200ms ease',
          },
          pill: {
            backgroundColor: 'rgba(226, 226, 226, 0.05)',
            color: '#f1c40f',
            border: '1px solid rgba(241, 196, 15, 0.3)',
            fontWeight: 700,
            transition: 'all 200ms ease',
          },
          dropdown: {
            backgroundColor: '#141414',
            border: '1px solid #333',
          },
          option: {
            color: '#e2e2e2',
            transition: 'background 200ms ease, color 200ms ease',
          },
        }}
      />
      
      <Leaguetable users={formattedSelectedUsers ?? []} games={filteredGames ?? []}/>
      <Reports reports={reports ?? []}/>
      <OverallStats games={games ?? []}/>
    </Stack>
  );
}