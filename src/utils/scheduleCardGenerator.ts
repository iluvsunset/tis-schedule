import { DayKey, Language } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { getVietnamTime } from './vietnamTime';

/**
 * Dynamically generates a high-resolution 1200x675 16:9 graphic card
 * for tomorrow's schedule using HTML5 Canvas.
 * Returns a PNG Data URL that can be directly passed into `NotificationOptions.image`.
 */
export async function generateScheduleCardDataUrl(language: Language = 'vi'): Promise<string> {
  const vnTime = getVietnamTime();
  const currentDayOfWeek = vnTime.dayOfWeek;

  let nextDayKey: DayKey = 'mon';
  if (currentDayOfWeek === 1) nextDayKey = 'tue';
  else if (currentDayOfWeek === 2) nextDayKey = 'wed';
  else if (currentDayOfWeek === 3) nextDayKey = 'thu';
  else if (currentDayOfWeek === 4) nextDayKey = 'fri';
  else if (currentDayOfWeek === 5) nextDayKey = 'sat';
  else nextDayKey = 'mon';

  const dayData = SCHEDULE_DATA.weekSchedule.find(d => d.dayKey === nextDayKey) || SCHEDULE_DATA.weekSchedule[0];
  const dayTitle = language === 'vi' ? dayData.dayNameVi : dayData.dayNameEn;

  // Off-screen canvas (1200x675 for rich push 16:9 banner)
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 675;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Background Gradient (Cozy Cream Studio)
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
  bgGrad.addColorStop(0, '#f7f4eb');
  bgGrad.addColorStop(1, '#efeae0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 675);

  // Soft Ambient Glows
  const glow1 = ctx.createRadialGradient(200, 150, 10, 200, 150, 450);
  glow1.addColorStop(0, 'rgba(254, 243, 199, 0.7)'); // soft butter
  glow1.addColorStop(1, 'rgba(254, 243, 199, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, 600, 400);

  const glow2 = ctx.createRadialGradient(1000, 500, 10, 1000, 500, 450);
  glow2.addColorStop(0, 'rgba(255, 237, 213, 0.6)'); // soft peach
  glow2.addColorStop(1, 'rgba(255, 237, 213, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(600, 250, 600, 425);

  // Outer Border Frame
  ctx.strokeStyle = 'rgba(138, 98, 62, 0.18)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 1160, 635);

  // 2. Top Header Bar
  // TIS Terracotta Coral Badge Pill
  ctx.fillStyle = '#d4674a';
  ctx.beginPath();
  ctx.roundRect(50, 45, 140, 36, 18);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('TIS SCHOOL', 72, 69);

  // Main Card Title (Dark Espresso Ink)
  ctx.fillStyle = '#3d2f26';
  ctx.font = '900 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const mainTitle = language === 'vi' ? 'THỜI KHÓA BIỂU NGÀY MAI' : "TOMORROW'S SCHEDULE";
  ctx.fillText(mainTitle, 210, 74);

  // Subtitle / Date Pill (Muted Coffee)
  ctx.fillStyle = '#8c7360';
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${dayTitle} (${dayData.date}) • Lớp 11-TN • Phòng 504`, 210, 110);

  // Divider Line
  ctx.strokeStyle = 'rgba(138, 98, 62, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(50, 135);
  ctx.lineTo(1150, 135);
  ctx.stroke();

  // 3. Morning Session Box (Left Column)
  const drawSessionBox = (
    title: string,
    timeText: string,
    items: typeof dayData.morning,
    x: number,
    y: number,
    w: number,
    h: number,
    accentColor: string,
    badgeBg: string,
    badgeTextColor: string
  ) => {
    // Pure Milk-White Box Background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 24);
    ctx.fill();

    ctx.strokeStyle = 'rgba(138, 98, 62, 0.16)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Session Header
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(x + 20, y + 20, 8, 24, 4);
    ctx.fill();

    ctx.fillStyle = '#3d2f26';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(title, x + 38, y + 40);

    ctx.fillStyle = '#8c7360';
    ctx.font = '600 16px monospace';
    ctx.fillText(timeText, x + w - 160, y + 40);

    // List of Lessons
    let currentY = y + 80;
    items.forEach((item) => {
      const isRecess = item.type === 'break';
      
      if (isRecess) {
        ctx.fillStyle = '#fef3c7'; // butter
        ctx.beginPath();
        ctx.roundRect(x + 20, currentY - 18, w - 40, 36, 12);
        ctx.fill();

        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#92400e';
        ctx.font = 'italic 700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`☕ ${language === 'vi' ? 'Ra chơi giải lao' : 'Recess'} (${item.time})`, x + 35, currentY + 6);
        currentY += 50;
        return;
      }

      // Lesson Row Box
      ctx.fillStyle = '#fffdfa';
      ctx.beginPath();
      ctx.roundRect(x + 20, currentY - 20, w - 40, 52, 14);
      ctx.fill();

      ctx.strokeStyle = 'rgba(138, 98, 62, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Period Badge (Pastel Chip)
      ctx.fillStyle = badgeBg;
      ctx.beginPath();
      ctx.roundRect(x + 30, currentY - 10, 36, 32, 8);
      ctx.fill();

      ctx.fillStyle = badgeTextColor;
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`T${item.period}`, x + 38, currentY + 12);

      // Subject Name
      const subName = language === 'vi' ? item.subjectVi : item.subjectEn;
      ctx.fillStyle = '#3d2f26';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(subName, x + 80, currentY + 2);

      // Teacher & Room
      ctx.fillStyle = '#8c7360';
      ctx.font = '500 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const teacherText = item.teacher ? `${item.teacher} • ${item.room || 'P.504'}` : (item.room || 'P.504');
      ctx.fillText(teacherText, x + 80, currentY + 22);

      // Time
      ctx.fillStyle = '#3d2f26';
      ctx.font = '700 15px monospace';
      ctx.fillText(item.time.split(' - ')[0], x + w - 90, currentY + 12);

      currentY += 62;
    });
  };

  // Morning Column
  drawSessionBox(
    language === 'vi' ? 'BUỔI SÁNG' : 'MORNING',
    '07:40 - 11:30',
    dayData.morning,
    50,
    155,
    530,
    440,
    '#d4674a',
    '#ffedd5',
    '#9a3412'
  );

  // Afternoon Column
  drawSessionBox(
    language === 'vi' ? 'BUỔI CHIỀU' : 'AFTERNOON',
    '13:30 - 16:05',
    dayData.afternoon,
    620,
    155,
    530,
    440,
    '#0284c7',
    '#e0f2fe',
    '#0369a1'
  );

  // 4. Footer Bar
  ctx.fillStyle = '#8c7360';
  ctx.font = '500 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('Trường Quốc Tế TIS • GVQN: Cô Tiềng (Phòng 504) • tis-schedule.iluvsunset.workers.dev', 50, 630);

  // Export to Data URL
  return canvas.toDataURL('image/png');
}
