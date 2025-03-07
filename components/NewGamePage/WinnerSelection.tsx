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

  const filteredUserObjects = userObjects.filter((user) => participants.includes(user._id));

  const renderSelectOption: SelectProps['renderOption'] = ({ option }) => {
    const user = filteredUserObjects.find((user) => user._id === option.value);
  
    return (
      <Group gap="sm">
        <Avatar src={user?.image} size={36} radius="xl" />
        <div>
          <Text size="sm">{user?.userName}</Text>
          <Text size="xs" opacity={0.5}>
            {user?.fullName}
          </Text>
        </div>
      </Group>
    );
  };
  

  return (
    <Select
      w={'100%'}
      mt={'15px'}
      leftSection={<IconLaurelWreath1 size={20} />}
      renderOption={renderSelectOption}
      data={filteredUserObjects.map((user) => ({
        value: user._id,
        label: user.userName,
      }))}
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
