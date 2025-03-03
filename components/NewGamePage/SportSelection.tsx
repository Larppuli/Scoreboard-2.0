import { IconSoccerField } from '@tabler/icons-react';
import { Select } from '@mantine/core';
import { SportSelectProps } from '@/app/lib/definitions';

export default function SportSelection({
  sports,
  selectedSport,
  handleSportChange,
}: SportSelectProps) {
  const icon = <IconSoccerField size={20} />;

  const handleChange = (value: string | null) => {
    handleSportChange(value); // Use `null` instead of `''`
  };

  return (
    <Select
      w={'100%'}
      mt={'15px'}
      leftSection={icon}
      value={selectedSport || null} // Ensure `null` resets the selection
      onChange={handleChange}
      placeholder="Select sport"
      data={sports}
      styles={{
        input: {
          backgroundColor: '#1e1e2e',
          color: '#ffffff',
          fontSize: '16px',
          alignContent: 'center',
          border: '1px solid #363636',
          borderRadius: '5px',
          minHeight: '50px',
          textAlign: 'center',
        },
      }}
    />
  );
}
