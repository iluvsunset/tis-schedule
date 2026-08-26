import { SCHEDULE_DATA } from '../data/scheduleData';

export function exportScheduleToICS() {
  let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TIS Schedule//Lop 11-TN//VI\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:Thời Khóa Biểu 11-TN\r\nX-WR-TIMEZONE:Asia/Ho_Chi_Minh\r\n`;

  const dayDateMap: Record<string, string> = {
    mon: "20260824",
    tue: "20260825",
    wed: "20260826",
    thu: "20260827",
    fri: "20260828"
  };

  SCHEDULE_DATA.weekSchedule.forEach(day => {
    const dateStr = dayDateMap[day.dayKey];
    const allItems = [...day.morning, ...day.afternoon];

    allItems.forEach(item => {
      if (item.type === 'break') return;

      const startClean = item.startTime.replace(':', '') + "00";
      const endClean = item.endTime.replace(':', '') + "00";

      icsContent += `BEGIN:VEVENT\r\n`;
      icsContent += `UID:11TN-${day.dayKey}-${item.period}-${dateStr}@tis.edu.vn\r\n`;
      icsContent += `DTSTAMP:${dateStr}T000000Z\r\n`;
      icsContent += `DTSTART;TZID=Asia/Ho_Chi_Minh:${dateStr}T${startClean}\r\n`;
      icsContent += `DTEND;TZID=Asia/Ho_Chi_Minh:${dateStr}T${endClean}\r\n`;
      icsContent += `SUMMARY:[11-TN] ${item.subjectVi} - ${item.teacher}\r\n`;
      icsContent += `DESCRIPTION:Thời khóa biểu Lớp 11-TN | Tiết ${item.period} | GV: ${item.teacher} | Ghi chú: ${item.note || ''}\r\n`;
      icsContent += `LOCATION:Phòng ${item.room || '504'}\r\n`;
      icsContent += `END:VEVENT\r\n`;
    });
  });

  icsContent += `END:VCALENDAR\r\n`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'TKB_Lop_11TN_TIS.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
