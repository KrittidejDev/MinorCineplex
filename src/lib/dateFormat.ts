export const dateFormat = (dateString: string) => {
    const date = new Date(dateString);
    // ใช้ UTC date เพื่อแสดงวันที่ที่ถูกต้อง (ไม่แปลงเป็น local time)
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return utcDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  