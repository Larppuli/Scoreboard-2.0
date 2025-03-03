import { MultiSelect, MultiSelectProps, Avatar, Group, Text } from '@mantine/core';
import { ParticipantsSelectProps } from '@/app/lib/definitions';
import { useAppContext } from '@/app/lib/AppContext';
import { useState, useEffect } from 'react';
import { IconUsersGroup } from '@tabler/icons-react';

export default function ParticipantsSelect({ selectedParticipants, handleParticipantsChange }: ParticipantsSelectProps) {
  const [userObjects, setUserObjects] = useState<Record<string, { image: string; fullName: string }>>({});
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const { users } = useAppContext();
  const timestamp = new Date().getTime();

  useEffect(() => {
    if (users) {
      const defaultPfpUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1741022251265/DefaultPFP`;

      const updatedUsers: Record<string, { image: string; fullName: string }> = {};

      users.forEach((user) => {
        const primaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v${timestamp}/profilepictures/profile_picture_${user._id}`;

        updatedUsers[user.userName] = {
          image: primaryUrl,
          fullName: `${user.firstName} ${user.lastName}`,
        };
      });

      const checkImageValidity = async (url: string): Promise<boolean> => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return response.ok;
        } catch {
          return false;
        }
      };

      const finalizeUsers = async () => {
        const validatedUsers = await Promise.all(
          Object.entries(updatedUsers).map(async ([name, data]) => {
            const isValid = await checkImageValidity(data.image);
            return [name, { ...data, image: isValid ? data.image : defaultPfpUrl }];
          })
        );

        setUserObjects(Object.fromEntries(validatedUsers));
      };

      finalizeUsers();
    }
  }, [users, cloudName]);

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