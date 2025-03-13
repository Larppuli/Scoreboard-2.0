import { Stack, Text, Flex } from '@mantine/core';
import { SportCardProps } from '@/app/lib/definitions';
import CountUp from 'react-countup';

export default function SportCard({ gameNum, sport, width, minWidth }: SportCardProps) {
  return (
    <Stack
      my="5px"
      gap={'-5px'}
      p={'4px'}
      w={width}
      miw={minWidth}
      style={{
        borderRadius: '5px',
        background: 'linear-gradient(135deg, rgba(49, 49, 49, 0.8), rgba(32, 32, 32, 0.7))',
        backdropFilter: 'blur(6px)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Text c="#e2e2e2" ta="center" fw={700}>
        {sport}
      </Text>
      <Flex c="#f1c40f" ta="center" mt={'2px'} fw={700} justify="center">
        <CountUp end={gameNum} duration={1} />
      </Flex>
    </Stack>
  );
}