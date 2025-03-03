import { IconUsersGroup } from '@tabler/icons-react';
import { MultiSelect } from '@mantine/core';
import { ParticipantsSelectProps } from '@/app/lib/definitions';

export default function ParticipantsSelect({
  participants,
  selectedParticipants,
  handleParticipantsChange,
}: ParticipantsSelectProps) {
  return (
    <MultiSelect
      w={'100%'}
      mt={'15px'}
      leftSection={<IconUsersGroup size={20} />}
      data={participants}
      value={selectedParticipants}
      onChange={handleParticipantsChange}
      placeholder={selectedParticipants.length === 0 ? 'Select participants' : ''}
      styles={{
        input: {
          backgroundColor: '#1e1e2e',
          color: '#ffffff',
          fontSize: '16px',
          alignContent: 'center',
          border: '1px solid #363636',
          borderRadius: '5px',
          minHeight: '65px',
          textAlignLast: 'center',
          justifyItems: 'center',
        },
      }}
    />
  );
}
