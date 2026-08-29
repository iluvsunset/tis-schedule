export interface VietnamTimeInfo {
  date: Date;
  hours: number;
  minutes: number;
  seconds: number;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  timeStr: string;
  timeWithSeconds: string;
  dateStr: string;
  totalMinutes: number;
  dayNameVi: string;
  dayNameEn: string;
}

export function parseVnDateToTimestamp(dStr: string): number {
  if (!dStr) return 0;
  const parts = dStr.split(/[\/\-]/).map(s => parseInt(s.trim(), 10));
  const day = parts[0];
  const month = parts[1];
  const year = parts[2] ? (parts[2] < 100 ? 2000 + parts[2] : parts[2]) : new Date().getFullYear();
  return new Date(year, month - 1, day, 0, 0, 0, 0).getTime();
}

export function getDateStatus(scheduleDateStr: string, todayDateStr: string): 'past' | 'today' | 'future' {
  const scTime = parseVnDateToTimestamp(scheduleDateStr);
  const tdTime = parseVnDateToTimestamp(todayDateStr);
  if (scTime === tdTime) return 'today';
  return scTime < tdTime ? 'past' : 'future';
}

export function getVietnamTime(): VietnamTimeInfo {
  const now = new Date();
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(now);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';

  const hours = parseInt(getPart('hour'), 10) || 0;
  const minutes = parseInt(getPart('minute'), 10) || 0;
  const seconds = parseInt(getPart('second'), 10) || 0;

  const weekdayStr = getPart('weekday').toLowerCase();
  const dayMap: Record<string, number> = { 
    'sun': 0, 
    'mon': 1, 
    'tue': 2, 
    'wed': 3, 
    'thu': 4, 
    'fri': 5, 
    'sat': 6 
  };
  const dayOfWeek = dayMap[weekdayStr] ?? 1;

  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const timeWithSeconds = `${timeStr}:${String(seconds).padStart(2, '0')}`;
  const dateStr = `${getPart('day')}/${getPart('month')}/${getPart('year')}`;

  const daysVi = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const fakeVnDate = new Date();
  fakeVnDate.setHours(hours, minutes, seconds, 0);

  return {
    date: fakeVnDate,
    hours,
    minutes,
    seconds,
    dayOfWeek,
    timeStr,
    timeWithSeconds,
    dateStr,
    totalMinutes: hours * 60 + minutes,
    dayNameVi: daysVi[dayOfWeek],
    dayNameEn: daysEn[dayOfWeek]
  };
}
