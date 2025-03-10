import { SemiCircleProgress, Group, Stack, Text } from '@mantine/core';
import { ExpectedWinPercentProps } from '@/app/lib/definitions';

export default function ExpectedWinPercent({ meanGameSize, winPercent }: ExpectedWinPercentProps) {
  return (
    <Group
        mt="10px"
        px={"20px"}
        py={'10px'}
        w={"80vw"}
        align="flex-start"
        bg={'#141414'}
        justify='space-between'
        style={{ borderRadius: '8px' }}
    >
        <Stack w={'40%'} align='center'>
            <Text fw={700} ta={'center'} >
                Expected win percentage
            </Text>
            <SemiCircleProgress
                mt={-10}
                fillDirection="left-to-right"
                orientation="up"
                filledSegmentColor="#f1c40f"
                size={150}
                thickness={20}
                value={(100 / meanGameSize)}
                label={`${(100 / meanGameSize).toFixed(1)}`}
            />
        </Stack>
        <Stack w={'40%'} align='center' >
            <Text fw={700} ta={'center'} >
                Actual win percentage
            </Text>
            <SemiCircleProgress
                mt={-10}
                fillDirection="left-to-right"
                orientation="up"
                filledSegmentColor={winPercent > 100 / meanGameSize ? 'green' : 'red'}
                size={150}
                thickness={20}
                value={winPercent}
                label={`${winPercent.toFixed(1)}`}
            />
        </Stack>
    </Group>
  );
}