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
  const showtimeDateObj =
    showtimeDate instanceof Date ? showtimeDate : new Date(showtimeDate);
  const thaiNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );
  const current = thaiNow.getTime();

  const todayThai = new Date(
    thaiNow.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );
  const showThai = new Date(
    showtimeDateObj.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );
  todayThai.setHours(0, 0, 0, 0);
  showThai.setHours(0, 0, 0, 0);

  const todayMid = todayThai.getTime();
  const showMid = showThai.getTime();

  const [sH, sM] = start_time.split(":").map(Number);
  const [eH, eM] = end_time.split(":").map(Number);

  const startDate = new Date(showThai);
  startDate.setHours(sH, sM, 0, 0);
  const endDate = new Date(showThai);
  endDate.setHours(eH, eM, 0, 0);

  let start = startDate.getTime();
  let end = endDate.getTime();

  if (end < start) {
    end += 24 * 60 * 60 * 1000;
  }

  console.log({
    now: thaiNow.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    start: startDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    end: endDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    disabled:
      showMid < todayMid || current > end || (current > start && current < end),
  });

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
