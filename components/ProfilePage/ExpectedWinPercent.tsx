import { SemiCircleProgress, Group, Stack, Text } from '@mantine/core';
import { ExpectedWinPercentProps } from '@/app/lib/definitions';

export default function ExpectedWinPercent({ meanGameSize, winPercent }: ExpectedWinPercentProps) {
  return (
    <Group
        mt="10px"
        w={"100%"}
        align="flex-start"
        justify='space-between'
    >
        <Stack
            pb={'10px'}
            pt={'5px'}
            w={'47%'} 
            align='center' 
            bg={'#141414'}
            style={{ borderRadius: '5px' }} >
            <Text c={'white'} fw={700} ta={'center'} >
                Expected win percentage
            </Text>
            <SemiCircleProgress
                mt={-10}
                c={'white'}
                fw={600}
                fillDirection="left-to-right"
                orientation="up"
                filledSegmentColor="#f1c40f"
                emptySegmentColor='#36383a'
                size={150}
                thickness={20}
                value={meanGameSize ? (100 / meanGameSize) : 0}
                label={meanGameSize ? `${(100 / meanGameSize).toFixed(1)}` : '0.0'}
            />
        </Stack>
        <Stack
            pb={'10px'}
            pt={'5px'}
            w={'47%'}
            align='center' 
            bg={'#141414'}
            style={{ borderRadius: '5px' }} >
            <Text c={'white'} fw={700} ta={'center'} >
                Actual win percentage
            </Text>
            <SemiCircleProgress
                mt={-10}
                c={'white'}
                fw={600}
                fillDirection="left-to-right"
                orientation="up"
                filledSegmentColor={winPercent > 100 / meanGameSize ? 'green' : 'red'}
                emptySegmentColor='#36383a'
                size={150}
                thickness={20}
                value={winPercent}
                label={`${winPercent.toFixed(1)}`}
            />
        </Stack>
    </Group>
  );
}