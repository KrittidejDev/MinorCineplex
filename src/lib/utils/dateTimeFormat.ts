export function RENDER_TIME_TH(timeRange: string): string {
  const [start, end] = timeRange.split(" - ");

  const convert = (timeStr: string) => {
    const match = timeStr.match(/(\d{1,2})[:.](\d{2})\s*(A\.M\.|P\.M\.|น\.)?/i);
    if (!match) return timeStr;
    const [, hours, minutes, period] = match;
    let h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);

    if (!period || /น/i.test(period)) {
      if (h < 6) h = h;
      else if (h >= 6 && h <= 11) h = h;
      else h = h + 12 > 23 ? 23 : h + 12;
    } else if (/P\.M\./i.test(period) && h !== 12) h += 12;
    else if (/A\.M\./i.test(period) && h === 12) h = 0;

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} น.`;
  };

  return `${convert(start)} - ${convert(end)}`;
}
