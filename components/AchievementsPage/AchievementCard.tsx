import { Stack, Text, Group, Progress } from '@mantine/core';
import { AchievementCardProps } from '@/app/lib/definitions';
import { IconStarFilled, IconFlower } from '@tabler/icons-react';

export default function AchievementCard({ title, tierData, tier, currentProgress }: AchievementCardProps) {
  const isFinalTier = tier >= tierData.length;
  const currentTierData = tierData[tier] ?? null;
  const previousTierData = tier > 0 ? tierData[tier - 1] : null;

  const progressPercentage = currentTierData
    ? ((currentProgress ?? 0) / currentTierData.nextTier) * 100
    : 100;

    const colorTheme = {
      border: isFinalTier ? '#05e600' : '#909090',
      background: isFinalTier ? 'rgba(0, 255, 13, 0.12)' : 'rgba(112, 112, 112, 0.3)',
  };
  

  return (
    <Group
      bg={colorTheme.background}
      h={90}
      p={10}
      align="center"
      w={'90%'}
      style={{ borderRadius: '10px', border: `1px solid ${colorTheme.border}` }}
    >
      <Stack justify='center' w={40} h={'100%'} bg={colorTheme.background} style={{ borderRadius: '6px' }}>
        <IconFlower size={40} color={colorTheme.border} />
      </Stack>
      <Stack w={'80%'}>
        <Group justify='space-between'>
          <Text mt={0} c={'white'} fw={700} size="16px">
            {title}
          </Text>
          <Group m={0} gap={0}>
              {tierData.map((_, i) => (
                <IconStarFilled key={i} size={18} color={i < tier ? '#ffcc00' : '#9e9e9e'} />
              ))}
          </Group>
        </Group>
        <Text mt={-10} c={'white'} fw={500} size="14px">
          {currentTierData ? currentTierData.description : previousTierData?.description || 'Completed all tiers'}
        </Text>
        <Group mt={-10} >
          <Group w={'100%'} justify='space-between' gap={5}>
            {currentTierData ? (
              <Group w={'100%'} justify='space-between'>
                <Text c={'#bebebe'} size="12px" mt={0}>
                  Next Tier:{' '}
                  <Text c={'#bebebe'} size="12px" fw={600} span>
                    {currentProgress ?? 0}/{currentTierData.nextTier}
                  </Text>
                </Text>
                <Progress
                  h={10}
                  color={'#ffcc00'}
                  value={progressPercentage}
                  w={72}
                  styles={{ root: { backgroundColor: '#565656' } }}
                />
              </Group>
            ) : (
              <Text c={'#bebebe'} size="12px">
                Finished
              </Text>
            )}
          </Group>

        </Group>
      </Stack>
    </Group>
  );
}
