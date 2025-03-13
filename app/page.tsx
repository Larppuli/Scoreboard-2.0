"use client";

import { Stack } from "@mantine/core";
import Leaguetable from "@/components/StatsPage/Leaguetable";
import OverallStats from '@/components/StatsPage/OverallStats';
import { useAppContext } from '@/app/lib/AppContext';

export default function HomePage() {
  const { users, games } = useAppContext();

  return (
    <Stack gap={1}>
      <Leaguetable users={users ?? []} games={games ?? []}/>
      <OverallStats games={games ?? []}/>
    </Stack>
  );
}