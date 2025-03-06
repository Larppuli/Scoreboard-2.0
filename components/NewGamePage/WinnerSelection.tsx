import { useEffect, useState } from 'react';
import { IconLaurelWreath1 } from '@tabler/icons-react';
import { Avatar, Group, Select, SelectProps, Text } from '@mantine/core';
import { WinnerSelectProps } from '@/app/lib/definitions';

export default function WinnerSelection({
  participants,
  handleWinnerChange,
  userObjects,
}: WinnerSelectProps) {
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);

  useEffect(() => {
    if (selectedWinner && !participants.includes(selectedWinner)) {
      setSelectedWinner(null);
      handleWinnerChange('');
    }
  }, [participants, selectedWinner, handleWinnerChange]);

  const handleChange = (value: string | null) => {
    setSelectedWinner(value);
    handleWinnerChange(value || '');
  };

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) => (
    <Group gap="sm">
      <Avatar src={userObjects[option.value]?.image} size={36} radius="xl" />
      <div>
        <Text size="sm">{option.value}</Text>
        <Text size="xs" opacity={0.5}>
          {userObjects[option.value]?.fullName}
        </Text>
      </div>
    </Group>
  );

  return (
    <Select
      w={'100%'}
      mt={'15px'}
      leftSection={<IconLaurelWreath1 size={20} />}
      renderOption={renderSelectOption}
      data={participants}
      value={selectedWinner}
      onChange={handleChange}
      placeholder="Select winner"
      comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
      styles={{
        input: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          fontSize: '16px',
          border: 0,
          borderRadius: '5px',
          minHeight: '50px',
          textAlign: 'center',
        },
        dropdown: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          border: 0,
          borderRadius: '5px',
        },
        option: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#313142',
          },
          '&:click': {
            backgroundColor: '#3d3d3d',
          },
          '&:focus': {
            backgroundColor: '#3d3d3d',
          }
        },
      }}
    />
  );
}
