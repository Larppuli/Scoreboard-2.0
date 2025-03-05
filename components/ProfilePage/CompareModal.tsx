import { Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useAppContext } from '@/app/lib/AppContext';
import { CompareModalProps } from '@/app/lib/definitions';

export const CompareModal = ({ opened, setOpened, onUserSelect }: CompareModalProps) => {
  const { user, users } = useAppContext();

  const filteredUsers = users?.filter((u) => u._id !== user?._id);

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Compare Points With" centered>
      <Stack mt="20px">
        {filteredUsers?.map((userObj) => (
          <Button key={userObj._id} variant="light" onClick={() => onUserSelect(userObj)}>
            <Group>
              <Text>{userObj.userName}</Text>
            </Group>
          </Button>
        ))}
      </Stack>
    </Modal>
  );
};
