export interface ShowtimeButtonProps {
  disabled: boolean;
  className: string;
  label?: string;
}

export function RUNDER_TIMESLOT(
  start_time: string,
  end_time: string,
  showtimeDate: Date, 
  now: Date = new Date()
): ShowtimeButtonProps {
  const today = new Date();
  const showtimeDateStr = showtimeDate.toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];
  
  if (showtimeDateStr < todayStr) {
    return {
      disabled: true,
      className: "white-outline-disabled",
      label: "ผ่านไปแล้ว",
    };
  }
  
  if (showtimeDateStr > todayStr) {
    return {
      disabled: false,
      className: "blue-dark-normal cursor-pointer",
      label: "รอรอบ",
    };
  }
  
  const start = new Date(`${showtimeDateStr}T${start_time}`).getTime();
  let end = new Date(`${showtimeDateStr}T${end_time}`).getTime();
  
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
      className: "blue-normal animate-pulse cursor-pointer",
      label: "ใกล้เริ่ม",
    };
  }
  
  if (current > start && current < end) {
    return {
      disabled: true,
      className: "blue-normal cursor-not-allowed hover:bg-blue-bbee! animate-pulse",
      label: "กำลังฉาย",
    };
  }
  
  return {
    disabled: false,
    className: "blue-dark-normal cursor-pointer",
    label: "รอรอบ",
  };
}
