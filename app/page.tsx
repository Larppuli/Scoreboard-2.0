"use client";

import { Stack } from "@mantine/core";
import Leaguetable from "@/components/StatsPage/Leaguetable";
import OverallStats from '@/components/StatsPage/OverallStats';
import { useAppContext } from '@/app/lib/AppContext';
import PersonAccordion from '@/components/StatsPage/PersonAccordion';

export default function HomePage() {
  const { users, games, userObjects } = useAppContext();

  return (
    <Stack gap={1}>
      <Leaguetable users={users ?? []} games={games ?? []}/>
      <OverallStats games={games ?? []}/>
      <PersonAccordion games={games ?? []} userObjects={userObjects ?? []}/>
    </Stack>
  );
}