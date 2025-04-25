import { Stack, Text, Group, Progress } from '@mantine/core';
import { AchievementCardProps } from '@/app/lib/definitions';
import { IconStarFilled } from '@tabler/icons-react';
import React from 'react';

export default function AchievementCard({ title, tierData, tier, currentProgress, icon, showProgress, isLegend }: AchievementCardProps) {
  const isFinalTier = tier >= tierData.length;
  const currentTierData = tierData[tier] ?? null;
  const previousTierData = tier > 0 ? tierData[tier - 1] : null;

  const progressPercentage = currentTierData
    ? ((currentProgress ?? 0) / currentTierData.nextTier) * 100
    : 100;

    const colorTheme = {
      border: isLegend && isFinalTier ? '#6e00ff' : isFinalTier ? '#05e600' : '#909090',
      background: isLegend && isFinalTier ? 'rgba(138, 38, 253, 0.12)' : isFinalTier ? 'rgba(0, 255, 13, 0.12)' : 'rgba(112, 112, 112, 0.3)',
    };
    
  

  return (
    <Group
      bg={colorTheme.background}
      h={90}
      p={10}
      align="center"
      w={'90%'}
      maw={450}
      style={{ borderRadius: '10px', border: `1px solid ${colorTheme.border}` }}
    >
      <Stack justify='center' w={40} h={'100%'} bg={colorTheme.background} style={{ borderRadius: '6px' }}>
      {React.cloneElement(icon, { color: colorTheme.border })}
      </Stack>
      <Stack w={'80%'}>
        <Group justify='space-between'>
          <Text mt={0} c={'white'} fw={700} size="16px">
            {title}
          </Text>
          <Group m={0} gap={0}>
              {tierData.map((_, i) => (
                <IconStarFilled key={i} size={18} color={i < tier && isLegend ? '#6e00ff' : i < tier  ? '#ffcc00' : '#9c9c9c' } />
              ))}
          </Group>
        </Group>
        <Text mt={-10} c={'white'} fw={500} size="14px">
          {currentTierData ? currentTierData.description : previousTierData?.description}
        </Text>
        <Group mt={-10} >
          <Group w={'100%'} justify='space-between' gap={5}>
          {currentTierData && showProgress ? (
        <Group w={'100%'} justify="space-between">
          <Text c={'#bebebe'} size="12px" mt={0}>
            Next Tier:
          </Text>
          <Progress.Root h={14} w={150} style={{ borderRadius: '7px',  backgroundColor: '#444444' }}>
            <Progress.Section value={progressPercentage} color={'#ffcc00'} >
              <Progress.Label c={'#232323'} style={{ fontSize: '12px', fontWeight: 'bold' }}>
                {currentProgress ?? 0}/{currentTierData.nextTier}
              </Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </Group>
      ) : currentProgress ? (
        <Text c={'#bebebe'} size="12px">
          Finished
        </Text>
      ) : null}
          </Group>
        </Group>
      </Stack>
    </Group>
  );
}
