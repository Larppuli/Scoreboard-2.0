import {
  IconCalendar,
  IconMoodLookDown,
  IconPlayFootball,
  IconSquareRoundedPercentage,
  IconTrophy,
  IconUsersGroup
} from '@tabler/icons-react';
import CountUp from 'react-countup';
import { Group, Stack, Text } from '@mantine/core';
import { ProfileCardProps } from '@/app/lib/definitions';

export default function ProfileCard({
  gameCount,
  winCount,
  lossCount,
  daysSinceLastGame,
  meanGameSize
}: ProfileCardProps) {
  return (
    <Stack
      mt="20px"
      p="lg"
      w="80vw"
      align="flex-start"
      bg={'#141414'}
      style={{ borderRadius: '8px' }}
    >
      <Group gap="xs">
        <IconCalendar size={30} color={'white'} />
        <Text size="xl" c={'white'} fw={500}>
          Days since last game: <CountUp end={daysSinceLastGame || 0} duration={1} />
        </Text>
      </Group>
      <Group gap="xs">
        <IconPlayFootball size={30} color={'#00bcd4'} />
        <Text size="xl" c={'#00bcd4'} fw={500}>
          Games played: <CountUp end={gameCount} duration={1} />
        </Text>
      </Group>
      <Group gap="xs">
        <IconTrophy size={30} color={'#01cb00'} />
        <Text size="xl" c={'#01cb00'} fw={500}>
          Wins: <CountUp end={winCount} duration={1} />
        </Text>
      </Group>
      <Group gap="xs">
        <IconMoodLookDown size={30} color={'#d00000'} />
        <Text size="xl" c={'#d00000'} fw={500}>
          Losses: <CountUp end={lossCount} duration={1} />
        </Text>
      </Group>
      <Group gap="xs">
        <IconSquareRoundedPercentage size={30} color={'#f1c40f'} />
        <Text size="xl" c={'#f1c40f'} fw={500}>
          Win percentage:{' '}
          <CountUp
            end={gameCount > 0 ? (winCount / gameCount) * 100 : 0}
            duration={1}
            decimals={1}
          />
          %
        </Text>
      </Group>
      <Group gap="xs">
        <IconUsersGroup size={30} color={'#8800ff'} />
        <Text size="xl" c={'#8800ff'} fw={500}>
          Mean game size:{' '}
          <CountUp
            end={meanGameSize || 0}
            duration={1}
            decimals={1}
          />
        </Text>
      </Group>
    </Stack>
  );
}
