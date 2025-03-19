import { Stack, Text, Group, Progress } from '@mantine/core';
import { AchievementCardProps } from '@/app/lib/definitions';
import { IconStarFilled } from '@tabler/icons-react';

export default function AchievementCard({ title, tierData, tier, currentProgress }: AchievementCardProps) {
  const progressPercentage = ((currentProgress ?? 0) / tierData[tier]?.nextTier) * 100;

  const colorTheme = {
    border: tierData[tier] ? '#909090' : '#05ff00',
    background: tierData[tier] ? 'rgba(112, 112, 112, 0.3)' : 'rgba(0, 255, 13, 0.12)',
  }

  return (
    <Stack
      p={10}
      bg={colorTheme.background}
      h={95}
      align="left"
      w={'90%'}
      style={{ borderRadius: '10px', border: `1px solid ${colorTheme.border}` }}
    >
      <Text mt={0} c={'white'} w={700} size="25px">
        {title}
      </Text>
      <Text mt={-10} c={'white'} w={500} size="15px">
        {tierData[tier] ? tierData[tier].description : tierData[tier-1].description}
      </Text>
      <Group
        mt={-10}
        justify='space-between'
      >
        <Group gap={5}>
        {tierData[tier] ? (
            <Group gap={5}>
            <Text c={'#bebebe'} size="12px" mt={0}>
                Next Tier:{' '}
                <Text c={'#bebebe'} size="12px" fw={600} span>
                {currentProgress ?? 0}/{tierData[tier]?.nextTier}
                </Text>
            </Text>
            <Progress mt={1} h={10} color={'#ffcc00'} value={progressPercentage} w={100} styles={{ root: { backgroundColor: '#565656' } }} />
            </Group>
        ) : (
            <Text  c={'#bebebe'} size="12px">Finished</Text>
        )}
        </Group>
        <Group gap={0}>
          {Array.from({ length: tierData?.length }, (_, i) => (
            <IconStarFilled
              key={i}
              size={18}
              color={i < tier ? '#ffcc00' : '#9e9e9e'}
            />
          ))}
        </Group>
      </Group>
    </Stack>
  );
}