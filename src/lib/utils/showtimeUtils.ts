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
  // แปลง now เป็นเวลาไทย (UTC+7)
  const thaiNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );
  const current = thaiNow.getTime();

  // แปลง showtimeDate เป็นวันที่ในโซนเวลาไทย โดยใช้เฉพาะวันที่ (ไม่รวมเวลา)
  let showtimeDateObj: Date;
  if (typeof showtimeDate === "string") {
    // ลบส่วนเวลาออก และตั้งเป็น 00:00:00 ในโซนเวลาไทย
    const dateOnly = showtimeDate.split("T")[0]; // เช่น "2025-10-27"
    showtimeDateObj = new Date(`${dateOnly}T00:00:00.000+07:00`);
  } else {
    showtimeDateObj = showtimeDate;
  }

  if (isNaN(showtimeDateObj.getTime())) {
    console.error("Invalid showtimeDate:", showtimeDate);
    return {
      disabled: true,
      className: "white-outline-disabled",
      label: "วันที่ไม่ถูกต้อง",
    };
  }

  // ตั้งวันที่เป็น 00:00:00 ในโซนเวลาไทย
  const todayThai = new Date(
    thaiNow.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );
  const showThai = new Date(showtimeDateObj);
  todayThai.setHours(0, 0, 0, 0);
  showThai.setHours(0, 0, 0, 0);

  const todayMid = todayThai.getTime();
  const showMid = showThai.getTime();

  // แยกชั่วโมงและนาทีจาก start_time และ end_time
  const [sH, sM] = start_time.split(":").map(Number);
  const [eH, eM] = end_time.split(":").map(Number);

  // ตั้งค่าเวลาเริ่มต้นและสิ้นสุดในวันที่ของ showtime
  const startDate = new Date(showThai);
  startDate.setHours(sH, sM, 0, 0);
  const endDate = new Date(showThai);
  endDate.setHours(eH, eM, 0, 0);

  let start = startDate.getTime();
  let end = endDate.getTime();

  // ถ้า end < start (ข้ามวัน) เพิ่ม 24 ชั่วโมงให้ end
  if (end < start) {
    end += 24 * 60 * 60 * 1000;
  }

  // ดีบักข้อมูล
  console.log({
    start_time,
    showtimeDate: showtimeDateObj.toISOString(),
    now: thaiNow.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    start: startDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    end: endDate.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    showMid: showThai.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    todayMid: todayThai.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    disabled:
      showMid < todayMid || current > end || (current > start && current < end),
  });

  // ตรวจสอบเงื่อนไข
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
