import { IconUsersGroup } from '@tabler/icons-react';
import { Avatar, Group, MultiSelect, MultiSelectProps, Text } from '@mantine/core';
import { ParticipantsSelectProps } from '@/app/lib/definitions';

export default function ParticipantsSelect({
  selectedParticipants,
  handleParticipantsChange,
  userObjects,
}: ParticipantsSelectProps) {

  const renderMultiSelectOption:MultiSelectProps['renderOption'] = ({ option }) => {
    const user = userObjects.find((user) => user._id === option.value);
  
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
    <MultiSelect
      w={'100%'}
      mt={'15px'}
      renderOption={renderMultiSelectOption}
      leftSection={<IconUsersGroup size={20} />}
      data={userObjects.map((user) => ({
        value: user._id,
        label: user.userName,
      }))}
      value={selectedParticipants}
      onChange={handleParticipantsChange}
      placeholder={selectedParticipants.length === 0 ? 'Select participants' : ''}
      comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
      styles={{
        input: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          fontSize: '16px',
          alignContent: 'center',
          border: 0,
          borderRadius: '5px',
          minHeight: '65px',
          textAlignLast: 'center',
          justifyItems: 'center',
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
        },
      }}
    />
  );
}
