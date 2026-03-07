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
  Divider,
  Box,
  Avatar
} from '@mantine/core';
import { 
  IconNews, 
  IconChevronDown, 
  IconChevronUp, 
  IconMicrophone2, 
  IconMessageCircle 
} from '@tabler/icons-react';
import { ReportProps } from '@/app/lib/definitions';

function ReportItem({ report, formatPeriod }: { report: ReportProps; formatPeriod: (m: number, y: number) => string }) {
  const [itemOpened, setItemOpened] = useState(false);
  
  const dynamicComments = report.comments || [];

  return (
    <Box
      style={{
        border: '1px solid #333',
        borderRadius: '5px',
        background: itemOpened ? 'rgba(40, 40, 40, 0.4)' : 'transparent',
        transition: 'background 200ms ease',
        overflow: 'hidden'
      }}
    >
      <UnstyledButton 
        onClick={() => setItemOpened((o) => !o)} 
        p="sm" 
        w="100%"
        style={{ '&:hover': { background: 'rgba(255, 255, 255, 0.03)' } }}
      >
        <Flex align="center" justify="space-between" gap="xs">
          <Flex align="center" gap="sm">
            <Badge w={120} color="yellow" variant="outline" size="sm" radius="sm">
              {formatPeriod(report.month, report.year)}
            </Badge>
            
            <Text 
              size="xs" 
              c={itemOpened ? "#f1c40f" : "#555"} 
              fs="italic"
              style={{ transition: 'color 200ms ease' }}
            >
              — {report.author}
            </Text>
          </Flex>
          
          <Flex align="center" gap="sm">
            <IconMicrophone2 
              size={14} 
              color={itemOpened ? "#f1c40f" : "#555"} 
              style={{ transition: 'color 200ms ease' }}
            />
            
            <Box style={{ 
              display: 'flex', 
              transition: 'color 200ms ease',
              color: itemOpened ? "#f1c40f" : "grey" 
            }}>
              {itemOpened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </Box>
          </Flex>
        </Flex>
      </UnstyledButton>

      <Collapse in={itemOpened} transitionDuration={200}>
        <Box p="md" pt={0}>
          <Divider mb="sm" color="#333" />
          
          <Text c="#f1c40f" fw={700} size="md" mb="xs">
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

          {dynamicComments.length > 0 && (
            <Stack gap="xs" mt="xl" p="sm" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <Flex align="center" gap="xs">
                <IconMessageCircle size={14} color="#f1c40f" />
                <Text size="xs" fw={700} c="#f1c40f" style={{ letterSpacing: '1px' }}>
                  Comments ({dynamicComments.length})
                </Text>
              </Flex>
              
              <Divider color="#222" />
              
              {dynamicComments.map((comment, i) => (
                <Box key={i} mb="xs">
                  <Flex gap="xs" align="flex-start">
                    <Stack gap={0}>
                      <Text size="11px" fw={700} c="#e2e2e2">{comment.user}</Text>
                      <Text mt={5} size="11px" c="#888" style={{ fontStyle: 'italic' }}>"{comment.text}"</Text>
                    </Stack>
                  </Flex>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

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
          <Box style={{ color: 'grey', display: 'flex' }}>
            {opened ? <IconChevronUp /> : <IconChevronDown />}
          </Box>
        </Flex>
      </UnstyledButton>

      <Collapse 
        in={opened} 
        mt="sm"
        transitionDuration={300}
        transitionTimingFunction="ease-in-out"
      >
        <Stack gap="sm">
          {reports && reports.length > 0 ? (
            reports.map((report) => (
              <ReportItem key={report._id} report={report} formatPeriod={formatPeriod} />
            ))
          ) : (
            <Text c="dimmed" ta="center" size="sm" py="xl">No reports available yet.</Text>
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
}