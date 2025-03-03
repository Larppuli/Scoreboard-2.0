import { useEffect, useState } from 'react';
import { IconLaurelWreath1 } from '@tabler/icons-react';
import { Select } from '@mantine/core';
import { WinnerSelectProps } from '@/app/lib/definitions';

export default function WinnerSelection({ participants, handleWinnerChange }: WinnerSelectProps) {
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

  return (
    <Select
      w={'100%'}
      mt={'15px'}
      leftSection={<IconLaurelWreath1 size={20} />}
      data={participants}
      value={selectedWinner}
      onChange={handleChange}
      placeholder="Select winner"
      styles={{
        input: {
          backgroundColor: '#1e1e2e',
          color: '#ffffff',
          fontSize: '16px',
          border: '1px solid #363636',
          borderRadius: '5px',
          minHeight: '50px',
          textAlign: 'center',
        },
        dropdown: {
          backgroundColor: '#2e2e3e',
          color: '#ffffff',
          border: '1px solid #363636',
          borderRadius: '5px',
        },
        option: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#313142',
          },
        },
      }}
    />
  );
}
