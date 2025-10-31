// lib/utils/showtimeUtils.ts

export interface ShowtimeButtonProps {
  disabled: boolean;
  className: string;
  label?: string;
}

export function RUNDER_TIMESLOT(
  start_time: string,
  end_time: string,
  showtimeDate: Date | string,
  now: Date
): ShowtimeButtonProps {
  let showY: number;
  let showM: number;
  let showD: number;
  if (typeof showtimeDate === "string" && /\d{4}-\d{2}-\d{2}T/.test(showtimeDate)) {
    const [y, m, d] = showtimeDate.split("T")[0].split("-").map(Number);
    showY = y;
    showM = (m || 1) - 1;
    showD = d || 1;
  } else {
    const showtimeDateObj =
      showtimeDate instanceof Date ? showtimeDate : new Date(showtimeDate);
    showY = showtimeDateObj.getFullYear();
    showM = showtimeDateObj.getMonth();
    showD = showtimeDateObj.getDate();
  }
  const nowY = now.getFullYear();
  const nowM = now.getMonth();
  const nowD = now.getDate();
  const isBeforeToday =
    showY < nowY ||
    (showY === nowY && (showM < nowM || (showM === nowM && showD < nowD)));
  const isAfterToday =
    showY > nowY ||
    (showY === nowY && (showM > nowM || (showM === nowM && showD > nowD)));

  if (isBeforeToday) {
    return {
      disabled: true,
      className: "white-outline-disabled",
      label: "ผ่านไปแล้ว",
    };
  }

  if (isAfterToday) {
    return {
      disabled: false,
      className: "blue-dark-normal cursor-pointer",
      label: "รอรอบ",
    };
  }

  const [sh, sm, ssStr = "0"] = start_time.split(":").map(Number);
  const [eh, em, esStr = "0"] = end_time.split(":").map(Number);
  const ss = Number(ssStr);
  const es = Number(esStr);

  const start = new Date(showY, showM, showD, sh, sm, ss).getTime();
  let end = new Date(showY, showM, showD, eh, em, es).getTime();

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
