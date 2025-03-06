import { IconCalendar } from '@tabler/icons-react';
import { DateInput } from '@mantine/dates';
import { DateSelectProps } from '@/app/lib/definitions';
import { DateTime } from 'luxon';

export default function DateSelection({ selectedDate, handleDateChange }: DateSelectProps) {
  const icon = <IconCalendar size={20} />;
  const today = DateTime.now().startOf('day'); // Using Luxon to get current date

  // Convert selectedDate to JS Date if it's a DateTime object for Mantine's DateInput
  const displayDate = selectedDate instanceof DateTime ? selectedDate.toJSDate() : selectedDate;

  return (
    <DateInput
      w={'100%'}
      leftSection={icon}
      value={displayDate}
      onChange={(value) => {
        if (value) {
          // Convert the selected JS Date back to Luxon DateTime
          const luxonDate = DateTime.fromJSDate(value);
          handleDateChange(luxonDate);
        }
      }}
      placeholder="Give the game a date"
      size="md"
      radius="md"
      maxDate={today.toJSDate()} // Convert Luxon DateTime to JS Date for maxDate
      onFocus={(e) => e.target.blur()}
      styles={{
        input: {
          backgroundColor: '#1e1e2e',
          color: '#ffffff',
          fontSize: '16px',
          textAlign: 'center',
          border: '1px solid #363636',
          borderRadius: '5px',
          height: '50px',
        },
      }}
    />
  );
}