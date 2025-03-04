import { MultiSelect, MultiSelectProps, Avatar, Group, Text } from '@mantine/core';
import { ParticipantsSelectProps } from '@/app/lib/definitions';
import { IconUsersGroup } from '@tabler/icons-react';

export default function ParticipantsSelect({ selectedParticipants, handleParticipantsChange, userObjects }: ParticipantsSelectProps) {

  const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option }) => (
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
    <MultiSelect
      w={'100%'}
      mt={'15px'}
      renderOption={renderMultiSelectOption}
      leftSection={<IconUsersGroup size={20} />}
      data={Object.keys(userObjects)}
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