import { SCHEDULE_DATA } from '../data/scheduleData';
import { DaySchedule } from '../types/schedule';

export function exportScheduleToICS(days: DaySchedule[] = SCHEDULE_DATA.weekSchedule, className: string = '11-TN') {
  let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TIS Schedule//Lop ${className}//VI\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:Thời Khóa Biểu ${className}\r\nX-WR-TIMEZONE:Asia/Ho_Chi_Minh\r\n`;

  days.forEach(day => {
    // Parse date parts e.g. "31/8/2026" -> "20260831"
    const parts = day.date.split(/[\/\-]/).map(Number);
    const y = parts[2] ? (parts[2] < 100 ? 2000 + parts[2] : parts[2]) : 2026;
    const m = String(parts[1] || 8).padStart(2, '0');
    const d = String(parts[0] || 31).padStart(2, '0');
    const dateStr = `${y}${m}${d}`;

    const allItems = [...day.morning, ...day.afternoon];

    allItems.forEach(item => {
      if (item.type === 'break') return;

      const startClean = item.startTime.replace(':', '') + "00";
      const endClean = item.endTime.replace(':', '') + "00";

      icsContent += `BEGIN:VEVENT\r\n`;
      icsContent += `UID:${className}-${day.dayKey}-${item.period}-${dateStr}@tis.edu.vn\r\n`;
      icsContent += `DTSTAMP:${dateStr}T000000Z\r\n`;
      icsContent += `DTSTART;TZID=Asia/Ho_Chi_Minh:${dateStr}T${startClean}\r\n`;
      icsContent += `DTEND;TZID=Asia/Ho_Chi_Minh:${dateStr}T${endClean}\r\n`;
      icsContent += `SUMMARY:[${className}] ${item.subjectVi} - ${item.teacher}\r\n`;
      icsContent += `DESCRIPTION:Thời khóa biểu ${className} | Tiết ${item.period} | GV: ${item.teacher} | Ghi chú: ${item.note || ''}\r\n`;
      icsContent += `LOCATION:Phòng ${item.room || '504'}\r\n`;
      icsContent += `END:VEVENT\r\n`;
    });
  });

  icsContent += `END:VCALENDAR\r\n`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `TKB-${className}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
