import { DateSelectProps } from "@/app/lib/definitions";
import { DateInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

export default function DateSelection({
  selectedDate,
  handleDateChange,
}: DateSelectProps) {
  const icon = <IconCalendar size={20} />;

  return (
    <DateInput
      w={"100%"}
      leftSection={icon}
      value={selectedDate}
      onChange={(value) => value && handleDateChange(value)}
      placeholder="Give the game a date"
      size="md"
      radius="md"
      onFocus={(e) => e.target.blur()}
      styles={{
        input: {
          backgroundColor: "#1e1e2e",
          color: "#ffffff",
          fontSize: "16px",
          textAlign: "center",
          border: "1px solid #363636",
          borderRadius: "5px",
          height: "50px",
        },
      }}
    />
  );
}
