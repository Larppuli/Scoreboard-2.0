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
    handleSportChange(value);
  };

  return (
    <Select
      w={'100%'}
      mt={'15px'}
      leftSection={icon}
      value={selectedSport || null}
      onChange={handleChange}
      placeholder="Select sport"
      data={sports}
      comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
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
