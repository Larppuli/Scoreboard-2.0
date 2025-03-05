import { Button, Modal, Stack } from '@mantine/core';
import { SparklineLengthModalProps } from '@/app/lib/definitions';

export const SparklineLengthModal = ({
  opened,
  setOpened,
  onLengthSelect,
  maxLength,
  setDisplayMax,
}: SparklineLengthModalProps) => {
  const sparklineLengths = [5, 10, 15, 20, 25, 30];

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="Amount Of Games" centered>
      <Stack mt="20px">
        {sparklineLengths.map((length) => (
          <Button
            key={length}
            variant="light"
            onClick={() => {
              onLengthSelect(length);
              setDisplayMax(false);
            }}
            disabled={length > maxLength}
          >
            {length}
          </Button>
        ))}
        <Button
          key={length}
          variant="light"
          onClick={() => {
            onLengthSelect(maxLength);
            setDisplayMax(true);
          }}
        >
          Max
        </Button>
      </Stack>
    </Modal>
  );
};
