export interface ShowtimeButtonProps {
  disabled: boolean;
  className: string;
  label?: string;
}

export function RUNDER_TIMESLOT(
  start_time: string,
  end_time: string,
  now: Date = new Date()
): ShowtimeButtonProps {
  const today = now.toISOString().split("T")[0];

  const start = new Date(`${today}T${start_time}`).getTime();
  let end = new Date(`${today}T${end_time}`).getTime();

  if (end < start) {
    end += 24 * 60 * 60 * 1000;
  }

  const current = now.getTime();

  if (current > end) {
    return {
      disabled: true,
      className: "white-outline-disabled",
      label: "หมดเวลา",
    };
  }

  if (current >= start && current <= start + 30 * 60 * 1000) {
    return {
      disabled: false,
      className: "blue-normal animate-pulse  cursor-pointer  ",
      label: "ใกล้เริ่ม",
    };
  }

  if (current > start && current < end) {
    return {
      disabled: true,
      className:
        "blue-normal cursor-not-allowed hover:bg-blue-bbee! animate-pulse",
      label: "กำลังฉาย",
    };
  }

  return {
    disabled: false,
    className: "blue-dark-normal  cursor-pointer ",
    label: "รอรอบ",
  };
}
