import { SemiCircleProgress, Group, Stack, Text } from '@mantine/core';
import { ExpectedWinPercentProps } from '@/app/lib/definitions';

export default function ExpectedWinPercent({ meanGameSize, winPercent }: ExpectedWinPercentProps) {
  return (
    <Group
        mt="10px"
        w={"100%"}
        align="flex-start"
        justify='space-between'
        style={{ overflowY: 'auto', 
            borderRadius: '12px', 
            background: 'rgba(20, 20, 20, 0.9)', 
            border: '1px solid #333',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)'
        }}
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