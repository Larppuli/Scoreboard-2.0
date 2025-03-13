import { Stack, Text, Flex } from '@mantine/core';
import { OverallStatsProps } from '@/app/lib/definitions';
import SportCard from './SportCard';
import CountUp from 'react-countup';

export default function OverallStats({ games }: OverallStatsProps) {
  const sportCounts = new Map<string, number>();

  games.forEach((game) => {
    sportCounts.set(game.sport, (sportCounts.get(game.sport) || 0) + 1);
  });

  return (
    <Stack
      mt="10px"
      bg={'#141414'}
      py={'10px'}
      style={{ borderRadius: '5px' }}
      align='center'
      pb={'18px'}
    >
        <Text c="#e2e2e2" ta="center" fw={700} size="lg">
            Games played
        </Text>
        <Flex w={'90%'} wrap="wrap" justify="space-between">
            {Array.from(sportCounts.entries()).map(([sport, count]) => (
            <SportCard key={sport} gameNum={count} sport={sport} width={'31%'} minWidth='95px' />
            ))}
        </Flex>
        <Stack
            mt="-10px"
            gap={'-5px'}
            p={'4px'}
            w={'90%'}
            style={{
                borderRadius: '5px',
                background: 'linear-gradient(135deg, rgba(49, 49, 49, 0.8), rgba(32, 32, 32, 0.7))',
                backdropFilter: 'blur(6px)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            }}
        >
            <Text c="#e2e2e2" ta="center" fw={700}>
                In total
            </Text>
            <Flex c="#f1c40f" ta="center" mt={'2px'} fw={700} justify="center">
                <CountUp end={games.length} duration={1} />
            </Flex>
        </Stack>
    </Stack>
  );
}