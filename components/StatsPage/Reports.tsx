'use client';

import { useState } from 'react';
import { 
  Stack, 
  Text, 
  Flex, 
  Collapse, 
  UnstyledButton, 
  ThemeIcon, 
  Paper,
  Badge,
  Divider
} from '@mantine/core';
import { IconNews, IconChevronDown, IconChevronUp, IconMicrophone2 } from '@tabler/icons-react';
import { ReportProps } from '@/app/lib/definitions';

export default function Reports({ reports }: { reports: ReportProps[] }) {
  const [opened, setOpened] = useState(false);

  const formatPeriod = (m: number, y: number) => {
    return new Date(y, m).toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  return (
    <Paper
      mt="20px"
      p="md"
      w="100%"
      style={{
        background: 'rgba(20, 20, 20, 0.9)',
        borderRadius: '12px',
        border: '1px solid #333',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      <UnstyledButton onClick={() => setOpened((o) => !o)} w="100%">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="sm" mt="sm">
            <ThemeIcon variant="gradient" gradient={{ from: '#f1c40f', to: '#e67e22' }} size="lg" radius="md">
              <IconNews size={20} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text c="#f1c40f" fw={800} size="sm" style={{ letterSpacing: '1px' }}>
                SPORTS ILLUSTRATED
              </Text>
              <Text c="#e2e2e2" size="xl" fw={700}>
                Monthly News Feed
              </Text>
            </Stack>
          </Flex>
          {opened ? <IconChevronUp color="grey" /> : <IconChevronDown color="grey" />}
        </Flex>
      </UnstyledButton>

      <Collapse 
        in={opened} 
        mt="sm"
        transitionDuration={300}
        transitionTimingFunction="ease-in-out"
        >
        <Stack gap="lg">
          {reports.map((report) => (
            <div key={report._id}>
              <Stack gap="xs">
                <Flex align="center" gap="xs">
                  <Badge color="yellow" variant="outline" size="sm" radius="sm">
                    {formatPeriod(report.month, report.year)}
                  </Badge>
                  <Divider size="xs" style={{ flex: 1 }} color="#333" />
                  <IconMicrophone2 size={14} color="#555" />
                </Flex>
                
                <Text c="#f1c40f" fw={700} size="md">
                  "{report.title}"
                </Text>
                
                <Text 
                  c="#b2b2b2" 
                  size="sm" 
                  lh={1.6} 
                  style={{ 
                    fontStyle: 'italic',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {report.content}
                </Text>
              </Stack>
            </div>
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
}