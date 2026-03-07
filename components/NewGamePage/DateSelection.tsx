import { IconCalendar } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { DateSelectProps } from '@/app/lib/definitions';
import { DateTime } from 'luxon';

export default function DateSelection({ selectedDate, handleDateChange }: DateSelectProps) {
  const icon = <IconCalendar size={20} />;
  const today = DateTime.now().startOf('day'); 

  const displayDate = selectedDate instanceof DateTime ? selectedDate.toJSDate() : selectedDate;

  return (
    <DateInput
      w={'100%'}
      leftSection={icon}
      value={displayDate}
      onChange={(value) => {
        if (value) {
          const luxonDate = DateTime.fromJSDate(value);
          handleDateChange(luxonDate);
        }
      }}
      placeholder="Give the game a date"
      size="md"
      radius="sm"
      maxDate={today.toJSDate()}
      onFocus={(e) => e.target.blur()}
      styles={{
        input: {
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          fontSize: '16px',
          textAlign: 'center',
          border: '1px solid #333',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          height: '50px',
        },
      }}
    />
  );
}