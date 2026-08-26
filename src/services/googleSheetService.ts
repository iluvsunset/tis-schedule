import { ScheduleData, DaySchedule, ScheduleItem, SubjectType } from '../types/schedule';
import { SCHEDULE_DATA as FALLBACK_DATA } from '../data/scheduleData';

export interface SheetConfig {
  sheetId: string;
  gid?: string;
  sheetName?: string;
}

const DEFAULT_CONFIG: SheetConfig = {
  sheetId: '1H5U71l1QHVPwCBg9c3KPaADG_jjaaRmxfsCNIXpBQJ4',
  gid: '209193378'
};

/**
 * Parses raw CSV content from Google Sheets dynamically for Grade 11-TN
 */
export function parseSheetCSV(csvText: string): ScheduleData {
  // Simple robust CSV parser handling quotes and newlines
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  // 1. Locate 11-TN Column
  let gradeCol = 10; // Default fallback
  let headerRowIdx = 2;

  for (let r = 0; r < Math.min(10, rows.length); r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] && (row[c].includes('11-TN') || row[c].includes('LỚP 11') || row[c].includes('Grade 11'))) {
        gradeCol = c;
        headerRowIdx = r;
        break;
      }
    }
  }

  // 2. Extract Room and Homeroom Teacher
  const room = rows[headerRowIdx + 1]?.[gradeCol] || '504';
  const rawTeacher = rows[headerRowIdx + 2]?.[gradeCol] || 'Cô Tiềng';
  const hrTeacherName = rawTeacher.replace(/^[CT]\.\s*/i, (m) => m.toUpperCase().startsWith('C') ? 'Cô ' : 'Thầy ');

  // 3. Helper to determine subject type
  const detectSubjectType = (text: string): SubjectType => {
    const t = text.toLowerCase();
    if (t.includes('toán') || t.includes('math')) return 'math';
    if (t.includes('anh') || t.includes('eng') || t.includes('level 10')) return 'english';
    if (t.includes('văn')) return 'literature';
    if (t.includes('lý') || t.includes('physics')) return 'physics';
    if (t.includes('hóa') || t.includes('chemistry')) return 'chemistry';
    if (t.includes('sinh-') || t.includes('sinh học') || t.includes('biology')) return 'biology';
    if (t.includes('tin') || t.includes('cs')) return 'cs';
    if (t.includes('science')) return 'science';
    if (t.includes('gdtc') || t.includes('thể dục') || t.includes('pe')) return 'pe';
    if (t.includes('shl') || t.includes('sinh hoạt')) return 'homeroom';
    if (t.includes('good morning') || t.includes('bầu cử') || t.includes('chào cờ') || t.includes('event')) return 'event';
    return 'event';
  };

  // 4. Helper to extract teacher and subject names from raw cell (e.g. "LÝ-THUẬN", "Level 10 - R504\nEng 1\nMr. Steven")
  const parseCellContent = (raw: string, defaultRoom: string) => {
    if (!raw) return { subjectVi: 'Tự học / Nghỉ', subjectEn: 'Self-study', teacher: '', room: defaultRoom, note: '' };

    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    
    // English block
    if (raw.toLowerCase().includes('level 10') || raw.toLowerCase().includes('eng')) {
      const teacherLine = lines.find(l => l.startsWith('Mr.') || l.startsWith('Ms.') || l.startsWith('C.') || l.startsWith('T.'));
      const engLine = lines.find(l => l.toLowerCase().startsWith('eng')) || 'Tiếng Anh';
      return {
        subjectVi: `Tiếng Anh (${engLine})`,
        subjectEn: `English Level 10 (${engLine})`,
        teacher: teacherLine || 'English Faculty',
        room: defaultRoom,
        note: 'Level 10 - Room ' + defaultRoom
      };
    }

    // Standard Vietnamese format: "MÔN-TÊN_GV" (e.g. "VĂN-CAM", "LÝ-THUẬN", "HÓA-TÂN", "TOÁN-THÀNH")
    if (raw.includes('-')) {
      const parts = raw.split('-');
      const subjectPart = parts[0].trim();
      const teacherPart = parts[1].trim();

      const teacherFormatted = teacherPart.startsWith('Cô') || teacherPart.startsWith('Thầy') || teacherPart.startsWith('Ms.') || teacherPart.startsWith('Mr.')
        ? teacherPart
        : `Thầy/Cô ${teacherPart}`;

      const isTinHoc = subjectPart.toLowerCase().includes('tin');
      return {
        subjectVi: subjectPart,
        subjectEn: subjectPart,
        teacher: teacherFormatted,
        room: isTinHoc ? 'Lab Tin' : defaultRoom,
        note: raw
      };
    }

    const isTinHoc = raw.toLowerCase().includes('tin');
    return {
      subjectVi: raw,
      subjectEn: raw,
      teacher: '',
      room: isTinHoc ? 'Lab Tin' : defaultRoom,
      note: raw
    };
  };

  // 5. Parse Days dynamically
  const days: DaySchedule[] = [];
  const dayKeys: ('mon' | 'tue' | 'wed' | 'thu' | 'fri')[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
  const dayNamesVi = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'];
  const dayNamesEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  let currentDayIndex = -1;
  let isMorning = true;

  for (let r = headerRowIdx + 3; r < rows.length; r++) {
    const row = rows[r];
    const col1 = row[1] || '';
    const col2 = row[2] || '';
    const col3 = row[3] || '';
    const val = row[gradeCol] || '';

    // Day Header Row (e.g. "THỨ HAI / MONDAY" with date in col3)
    if (col1.toUpperCase().includes('THỨ') || col1.toUpperCase().includes('MONDAY') || col1.toUpperCase().includes('TUESDAY') || col1.toUpperCase().includes('WEDNESDAY') || col1.toUpperCase().includes('THURSDAY') || col1.toUpperCase().includes('FRIDAY')) {
      currentDayIndex++;
      if (currentDayIndex >= 5) break;

      const dateStr = col3 || (row[4] || '24/8/2026');

      days.push({
        dayKey: dayKeys[currentDayIndex],
        dayNameVi: dayNamesVi[currentDayIndex],
        dayNameEn: dayNamesEn[currentDayIndex],
        date: dateStr,
        morning: [],
        lunch: {
          time: '11:30 - 13:30',
          startTime: '11:30',
          endTime: '13:30',
          titleVi: 'Nghỉ trưa & Dùng bữa',
          titleEn: 'Lunch Break & Rest'
        },
        afternoon: []
      });
      isMorning = true;
      continue;
    }

    // Check session switch (Sáng vs Chiều)
    if (col1.toUpperCase().includes('SÁNG') || col1.toUpperCase().includes('MORNING')) {
      isMorning = true;
    } else if (col1.toUpperCase().includes('CHIỀU') || col1.toUpperCase().includes('AFTERNOON')) {
      isMorning = false;
    }

    // Recess row
    if (col3.toLowerCase().includes('ra chơi') || col3.toLowerCase().includes('recess')) {
      if (currentDayIndex >= 0 && currentDayIndex < days.length) {
        const breakItem: ScheduleItem = {
          period: 'recess',
          time: isMorning ? '09:35 - 09:55' : '15:05 - 15:20',
          startTime: isMorning ? '09:35' : '15:05',
          endTime: isMorning ? '09:55' : '15:20',
          subjectVi: isMorning ? 'Ra chơi sáng' : 'Ra chơi chiều',
          subjectEn: isMorning ? 'Morning Recess' : 'Afternoon Recess',
          teacher: '',
          type: 'break',
          room: '',
          note: isMorning ? '20 phút giải lao' : '15 phút giải lao'
        };

        if (isMorning) {
          days[currentDayIndex].morning.push(breakItem);
        } else {
          days[currentDayIndex].afternoon.push(breakItem);
        }
      }
      continue;
    }

    // Period Row (has a period number in col2)
    if (col2 && /^\d+$/.test(col2.trim())) {
      if (currentDayIndex >= 0 && currentDayIndex < days.length) {
        const periodNum = parseInt(col2.trim(), 10);
        const timeStr = col3 || (isMorning 
          ? (periodNum === 1 ? '08:00 - 08:45' : periodNum === 2 ? '08:50 - 09:35' : periodNum === 3 ? '09:55 - 10:40' : '10:45 - 11:30')
          : (periodNum === 1 ? '13:30 – 14:15' : periodNum === 2 ? '14:20 – 15:05' : '15:20 - 16:05'));

        const [st, et] = timeStr.split(/[-–]/).map(s => s.trim());
        const parsed = parseCellContent(val, room);

        const item: ScheduleItem = {
          period: periodNum,
          time: timeStr,
          startTime: st || '08:00',
          endTime: et || '08:45',
          subjectVi: parsed.subjectVi,
          subjectEn: parsed.subjectEn,
          teacher: parsed.teacher,
          type: detectSubjectType(val || parsed.subjectVi),
          room: parsed.room,
          note: parsed.note
        };

        if (isMorning) {
          days[currentDayIndex].morning.push(item);
        } else {
          days[currentDayIndex].afternoon.push(item);
        }
      }
    }
  }

  // If parsed properly, return dynamic data; otherwise fallback safely
  if (days.length === 5) {
    return {
      grade: '11-TN',
      gradeTitleVi: 'Lớp 11 - Tự Nhiên',
      gradeTitleEn: 'Grade 11 - Natural Sciences',
      room: room || '504',
      homeroomTeacher: {
        name: hrTeacherName || 'Cô Tiềng',
        titleVi: 'Giáo Viên Chủ Nhiệm (GVQN)',
        titleEn: 'Homeroom Teacher',
        subject: 'Sinh Hoạt Lớp'
      },
      weekSchedule: days,
      teachers: FALLBACK_DATA.teachers // retain rich teacher roster
    };
  }

  return FALLBACK_DATA;
}

/**
 * Fetches live CSV data from Google Sheet and parses it dynamically
 */
export async function fetchLiveSchedule(config: SheetConfig = DEFAULT_CONFIG): Promise<ScheduleData> {
  const params = config.gid ? `gid=${config.gid}` : config.sheetName ? `sheet=${encodeURIComponent(config.sheetName)}` : 'gid=0';
  const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&${params}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Google Sheets responded with status ${response.status}`);
    }
    const csvText = await response.text();
    return parseSheetCSV(csvText);
  } catch (error) {
    console.warn('Live Google Sheet fetch failed, using cached schedule:', error);
    return FALLBACK_DATA;
  }
}
