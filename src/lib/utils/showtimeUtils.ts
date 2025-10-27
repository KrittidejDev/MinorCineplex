export interface ShowtimeButtonProps {
  disabled: boolean;
  className: string;
  label?: string;
}

export function RUNDER_TIMESLOT(
  start_time: string,
  end_time: string,
  showtimeDate: Date | string,
  now: Date = new Date()
): ShowtimeButtonProps {
  const today = new Date();

  const showtimeDateObj =
    showtimeDate instanceof Date ? showtimeDate : new Date(showtimeDate);

  const todayMid = new Date(today.setHours(0, 0, 0, 0)).getTime();
  const showMid = new Date(showtimeDateObj.setHours(0, 0, 0, 0)).getTime();

  const [sH, sM] = start_time.split(":").map(Number);
  const [eH, eM] = end_time.split(":").map(Number);

  const start = new Date(showtimeDateObj).setHours(sH, sM, 0, 0);
  let end = new Date(showtimeDateObj).setHours(eH, eM, 0, 0);

  if (end < start) {
    end += 24 * 60 * 60 * 1000;
  }

  const current = now.getTime();

  if (showMid < todayMid) {
    return {
      disabled: true,
      className: "white-outline-disabled",
      label: "ผ่านไปแล้ว",
    };
  }

  if (showMid > todayMid) {
    return {
      disabled: false,
      className: "blue-dark-normal cursor-pointer",
      label: "รอรอบ",
    };
  }

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
      className:
        "blue-normal cursor-not-allowed hover:bg-blue-bbee! animate-pulse",
      label: "กำลังฉาย",
    };
  }

  return {
    disabled: false,
    className: "blue-dark-normal cursor-pointer",
    label: "รอรอบ",
  };
}
