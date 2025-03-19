import { Stack, Text, Group, Progress } from '@mantine/core';
import { AchievementCardProps } from '@/app/lib/definitions';
import { IconStarFilled } from '@tabler/icons-react';

export default function AchievementCard({ title, tierData, tier, currentProgress }: AchievementCardProps) {
  const isFinalTier = tier >= tierData.length;
  const currentTierData = tierData[tier] ?? null;
  const previousTierData = tier > 0 ? tierData[tier - 1] : null;

  const progressPercentage = currentTierData
    ? ((currentProgress ?? 0) / currentTierData.nextTier) * 100
    : 100;

    const colorTheme = {
      border: isFinalTier ? '#05ff00' : '#909090',
      background: isFinalTier ? 'rgba(0, 255, 13, 0.12)' : 'rgba(112, 112, 112, 0.3)',
  };
  

  return (
    <Stack
      p={10}
      bg={colorTheme.background}
      h={95}
      align="left"
      w={'90%'}
      style={{ borderRadius: '10px', border: `1px solid ${colorTheme.border}` }}
    >
      <Text mt={0} c={'white'} fw={700} size="25px">
        {title}
      </Text>
      <Text mt={-10} c={'white'} fw={500} size="15px">
        {currentTierData ? currentTierData.description : previousTierData?.description || 'Completed all tiers'}
      </Text>
      <Group mt={-10} justify="space-between">
        <Group gap={5}>
          {currentTierData ? (
            <Group gap={5}>
              <Text c={'#bebebe'} size="12px" mt={0}>
                Next Tier:{' '}
                <Text c={'#bebebe'} size="12px" fw={600} span>
                  {currentProgress ?? 0}/{currentTierData.nextTier}
                </Text>
              </Text>
              <Progress
                mt={1}
                h={10}
                color={'#ffcc00'}
                value={progressPercentage}
                w={100}
                styles={{ root: { backgroundColor: '#565656' } }}
              />
            </Group>
          ) : (
            <Text c={'#bebebe'} size="12px">
              Finished
            </Text>
          )}
        </Group>
        <Group gap={0}>
          {tierData.map((_, i) => (
            <IconStarFilled key={i} size={18} color={i < tier ? '#ffcc00' : '#9e9e9e'} />
          ))}
        </Group>
      </Group>
    </Stack>
  );
}
