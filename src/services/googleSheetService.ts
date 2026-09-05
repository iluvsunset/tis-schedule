import { ScheduleData, DaySchedule, ScheduleItem, SubjectType, DayKey, WeekTabInfo, ClassInfo, INITIAL_CLASSES, RoomInfo, INITIAL_ROOMS } from '../types/schedule';
import { SCHEDULE_DATA as FALLBACK_DATA, getFallbackRoomSchedule } from '../data/scheduleData';
import { formatScheduleDate } from '../utils/vietnamTime';

export interface SheetConfig {
  sheetId: string;
  gid?: string;
  sheetName?: string;
}

const DEFAULT_CONFIG: SheetConfig = {
  sheetId: '1H5U71l1QHVPwCBg9c3KPaADG_jjaaRmxfsCNIXpBQJ4',
  gid: '676068602' // Tuần 5/8 default
};

// In-memory cache for ultra-fast instant switching between weeks & classes
const scheduleCache = new Map<string, ScheduleData>();
const inFlightSchedules = new Map<string, Promise<ScheduleData>>();
let cachedTabs: WeekTabInfo[] | null = null;
let inFlightTabsPromise: Promise<WeekTabInfo[]> | null = null;

/**
 * Discovers all week tabs from Google Spreadsheet HTML view
 */
export async function getAllSheetTabs(sheetId: string = DEFAULT_CONFIG.sheetId): Promise<WeekTabInfo[]> {
  if (cachedTabs && cachedTabs.length > 0) return cachedTabs;
  if (inFlightTabsPromise) return inFlightTabsPromise;

  try {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/htmlview`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const regex = /items\.push\(\{[^}]*name:\s*"([^"]+)"[^}]*gid:\s*"([0-9]+)"/g;
    let match;
    const tabs: WeekTabInfo[] = [];
    while ((match = regex.exec(html)) !== null) {
      tabs.push({ 
        name: match[1].replace(/\\\//g, '/'), 
        gid: match[2],
        isLatest: false
      });
    }
    if (tabs.length > 0) {
      tabs[tabs.length - 1].isLatest = true;
      cachedTabs = tabs;
      return tabs;
    }
  } catch (e) {
    console.warn('Could not auto-detect sheet tabs from HTML view:', e);
  }

  // Static Fallback Tabs
  const fallbackTabs: WeekTabInfo[] = [
    { name: 'Tuần 1/8', gid: '782076123' },
    { name: 'Tuần 2/8', gid: '1550771511' },
    { name: 'Tuần 3/8', gid: '0' },
    { name: 'Tuần 4/8', gid: '209193378' },
    { name: 'Tuần 5/8', gid: '676068602', isLatest: true }
  ];
  cachedTabs = fallbackTabs;
  return fallbackTabs;
}

/**
 * Returns latest sheet tab
 */
export async function getLatestSheetTab(sheetId: string = DEFAULT_CONFIG.sheetId): Promise<WeekTabInfo | null> {
  const tabs = await getAllSheetTabs(sheetId);
  return tabs.length > 0 ? tabs[tabs.length - 1] : null;
}

/**
 * Discovers available classes from CSV header rows
 */
export function getAvailableClassesFromCSV(rows: string[][]): ClassInfo[] {
  if (!rows || rows.length < 3) return INITIAL_CLASSES;

  const headerRow = rows[0];
  const roomRow = rows[1];
  const teacherRow = rows[2];
  const classes: ClassInfo[] = [];

  for (let c = 4; c < headerRow.length; c++) {
    const rawTitle = (headerRow[c] || '').trim();
    if (!rawTitle) continue;

    let id = '';
    let nameVi = '';
    let nameEn = '';
    let level: 'middle' | 'high' = 'high';

    if (/6/i.test(rawTitle)) {
      id = '6'; nameVi = 'Lớp 6'; nameEn = 'Grade 6'; level = 'middle';
    } else if (/7/i.test(rawTitle)) {
      id = '7'; nameVi = 'Lớp 7'; nameEn = 'Grade 7'; level = 'middle';
    } else if (/8/i.test(rawTitle)) {
      id = '8'; nameVi = 'Lớp 8'; nameEn = 'Grade 8'; level = 'middle';
    } else if (/9/i.test(rawTitle)) {
      id = '9'; nameVi = 'Lớp 9'; nameEn = 'Grade 9'; level = 'middle';
    } else if (/10.*NT/i.test(rawTitle)) {
      id = '10-nt'; nameVi = 'Lớp 10-TN & NT'; nameEn = 'Grade 10-TN & NT'; level = 'high';
    } else if (/10/i.test(rawTitle)) {
      id = '10-tn'; nameVi = 'Lớp 10-TN'; nameEn = 'Grade 10-TN'; level = 'high';
    } else if (/11/i.test(rawTitle)) {
      id = '11-tn'; nameVi = 'Lớp 11-TN'; nameEn = 'Grade 11-TN'; level = 'high';
    } else if (/12/i.test(rawTitle)) {
      id = '12-tn'; nameVi = 'Lớp 12-TN'; nameEn = 'Grade 12-TN'; level = 'high';
    } else {
      id = `class-${c}`; nameVi = rawTitle.split('\n')[0]; nameEn = rawTitle.split('\n')[1] || nameVi;
    }

    const room = (roomRow[c] || '').trim();
    const rawTeacher = (teacherRow[c] || '').trim();
    const homeroomTeacher = rawTeacher.replace(/^[CT]\.\s*/i, (m) => m.toUpperCase().startsWith('C') ? 'Cô ' : 'Thầy ');

    classes.push({
      id,
      nameVi,
      nameEn,
      level,
      room: room || 'TIS',
      homeroomTeacher: homeroomTeacher || 'Chưa phân công',
      columnIndex: c
    });
  }

  return classes.length > 0 ? classes : INITIAL_CLASSES;
}

/**
 * Parse raw CSV string into 2D array of rows
 */
export function parseCSVTokens(csvText: string): string[][] {
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
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
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
  return rows;
}

/**
 * Discovers available rooms from CSV header rows
 */
export function getAvailableRoomsFromCSV(rows: string[][]): RoomInfo[] {
  if (!rows || rows.length < 3) return INITIAL_ROOMS;

  const headerRow = rows[0] || [];
  const roomRow = rows[1] || [];
  const teacherRow = rows[2] || [];
  const roomsMap = new Map<string, RoomInfo>();

  for (let c = 4; c < roomRow.length; c++) {
    const rawRoom = (roomRow[c] || '').trim();
    if (!rawRoom) continue;

    const roomId = rawRoom;
    if (!roomsMap.has(roomId)) {
      const rawClass = (headerRow[c] || '').trim();
      const rawTeacher = (teacherRow[c] || '').trim();
      const homeroomTeacher = rawTeacher.replace(/^[CT]\.\s*/i, (m) => m.toUpperCase().startsWith('C') ? 'Cô ' : 'Thầy ');
      
      const floorVi = roomId.startsWith('5') ? 'Tầng 5' : roomId.startsWith('4') ? 'Tầng 4' : 'Tầng 3';
      const floorEn = roomId.startsWith('5') ? 'Floor 5' : roomId.startsWith('4') ? 'Floor 4' : 'Floor 3';

      const classVi = rawClass.split('\n')[0] || `Lớp ${roomId}`;
      const classEn = rawClass.split('\n')[1] || classVi;

      roomsMap.set(roomId, {
        id: roomId,
        nameVi: `Phòng ${roomId}`,
        nameEn: `Room ${roomId}`,
        floorVi,
        floorEn,
        defaultClassVi: classVi,
        defaultClassEn: classEn,
        homeroomTeacher: homeroomTeacher || 'Chưa phân công'
      });
    }
  }

  INITIAL_ROOMS.forEach(r => {
    if (!roomsMap.has(r.id)) {
      roomsMap.set(r.id, r);
    }
  });

  return Array.from(roomsMap.values());
}

/**
 * Parses raw CSV content dynamically for any specified Class
 */
export function parseSheetCSV(csvText: string, targetClassId: string = '11-tn'): ScheduleData {
  const rows = parseCSVTokens(csvText);

  // 1. Locate Class Column
  const availableClasses = getAvailableClassesFromCSV(rows);
  const matchedClass = availableClasses.find(c => c.id === targetClassId) || 
                       availableClasses.find(c => c.id === '11-tn') || 
                       availableClasses[0];

  let gradeCol = matchedClass.columnIndex ?? 10;
  if (gradeCol < 4 || gradeCol >= (rows[0]?.length || 0)) {
    gradeCol = 10;
  }

  const room = rows[1]?.[gradeCol] || matchedClass.room || '504';
  const rawTeacher = rows[2]?.[gradeCol] || matchedClass.homeroomTeacher || 'Cô Tiềng';
  const hrTeacherName = rawTeacher.replace(/^[CT]\.\s*/i, (m) => m.toUpperCase().startsWith('C') ? 'Cô ' : 'Thầy ');

  // 2. Helper to determine subject type
  const detectSubjectType = (text: string): SubjectType => {
    const t = text.toLowerCase();
    if (t.includes('toán') || t.includes('math')) return 'math';
    if (t.includes('anh') || t.includes('eng') || t.includes('level')) return 'english';
    if (t.includes('văn') || t.includes('lit')) return 'literature';
    if (t.includes('lý') || t.includes('phy') || t.includes('khtn (lý)')) return 'physics';
    if (t.includes('hóa') || t.includes('chem') || t.includes('khtn (hóa)')) return 'chemistry';
    if (t.includes('sinh') || t.includes('bio') || t.includes('khtn (sinh)')) return 'biology';
    if (t.includes('tin') || t.includes('cs') || t.includes('ict') || t.includes('computer')) return 'cs';
    if (t.includes('science') || t.includes('khtn')) return 'science';
    if (t.includes('gdtc') || t.includes('thể chất') || t.includes('pe') || t.includes('bóng')) return 'pe';
    if (t.includes('shl') || t.includes('sinh hoạt') || t.includes('hướng nghiệp')) return 'homeroom';
    if (t.includes('khai giảng') || t.includes('good morning') || t.includes('rehearsal') || t.includes('nghỉ lễ') || t.includes('hội đồng')) return 'event';
    return 'event';
  };

  // 3. Subject Name Cleaner
  const cleanSubjectName = (raw: string): { vi: string; en: string; teacher: string; note: string } => {
    if (!raw || raw.trim() === '') {
      return { vi: 'Tự học / Nghỉ', en: 'Self Study / Free', teacher: 'Chưa phân công', note: '' };
    }

    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0] || '';

    // National Holiday
    if (/nghỉ lễ/i.test(firstLine)) {
      return {
        vi: 'Nghỉ Lễ 2/9',
        en: 'National Day Holiday',
        teacher: 'Nghỉ toàn trường',
        note: 'Nghỉ Lễ Quốc Khánh 2/9'
      };
    }

    // Opening Ceremony
    if (/khai giảng/i.test(firstLine)) {
      return {
        vi: 'Lễ Khai Giảng Năm Học 2026 - 2027',
        en: 'School Year Opening Ceremony',
        teacher: 'Toàn Trường (All School)',
        note: 'LỄ KHAI GIẢNG NĂM HỌC 2026 - 2027'
      };
    }

    // Rehearsal
    if (/rehearsal/i.test(firstLine)) {
      return {
        vi: 'Rehearsal Lễ Khai Giảng',
        en: 'Ceremony Rehearsal',
        teacher: 'Toàn Trường',
        note: 'Rehearsal Lễ Khai Giảng Năm Học 2026-2027'
      };
    }

    // English multi-line (Level X - Room / Eng X / Teacher)
    if (firstLine.toLowerCase().includes('level') || firstLine.toLowerCase().includes('eng')) {
      const teacherLine = lines.find(l => l.toLowerCase().startsWith('mr') || l.toLowerCase().startsWith('ms') || l.toLowerCase().startsWith('thầy') || l.toLowerCase().startsWith('cô')) || '';
      return {
        vi: `English (${firstLine})`,
        en: `English (${firstLine})`,
        teacher: teacherLine || 'GV Bản Ngữ / Việt Nam',
        note: lines.join(' • ')
      };
    }

    // Format: "MÔN-GIÁO VIÊN" e.g. "TOÁN-THÀNH", "GDTC-HẢI"
    if (firstLine.includes('-')) {
      const parts = firstLine.split('-');
      const sub = parts[0].trim();
      const tea = parts.slice(1).join('-').trim();

      const subMap: Record<string, { vi: string; en: string }> = {
        'TOÁN': { vi: 'Toán Học', en: 'Mathematics' },
        'VĂN': { vi: 'Ngữ Văn', en: 'Literature' },
        'LÝ': { vi: 'Vật Lý', en: 'Physics' },
        'HÓA': { vi: 'Hóa Học', en: 'Chemistry' },
        'SINH': { vi: 'Sinh Học', en: 'Biology' },
        'TIN': { vi: 'Tin Học', en: 'Computer Science' },
        'GDTC': { vi: 'Giáo Dục Thể Chất', en: 'Physical Education' },
        'SHL': { vi: 'Sinh Hoạt Lớp', en: 'Homeroom Period' },
        'KHTN (LÝ)': { vi: 'KHTN (Vật Lý)', en: 'Natural Science (Physics)' },
        'KHTN (HÓA)': { vi: 'KHTN (Hóa Học)', en: 'Natural Science (Chemistry)' },
        'KHTN (SINH)': { vi: 'KHTN (Sinh Học)', en: 'Natural Science (Biology)' },
        'NT (NHẠC)': { vi: 'Nghệ Thuật (Âm Nhạc)', en: 'Art & Music' },
      };

      const cleanSub = sub.replace(/\s*\d+$/, '').trim().toUpperCase();
      const mapped = subMap[cleanSub] || { vi: sub, en: sub };
      return {
        vi: mapped.vi,
        en: mapped.en,
        teacher: tea ? `Thầy/Cô ${tea}` : 'Giáo viên bộ môn',
        note: firstLine
      };
    }

    return {
      vi: firstLine,
      en: firstLine,
      teacher: lines[1] || 'Giáo viên bộ môn',
      note: lines.slice(1).join(' • ')
    };
  };

  // 4. Parse Days
  const daysConfig: { key: DayKey; nameVi: string; nameEn: string; matchText: string }[] = [
    { key: 'mon', nameVi: 'Thứ Hai', nameEn: 'Monday', matchText: 'THỨ HAI' },
    { key: 'tue', nameVi: 'Thứ Ba', nameEn: 'Tuesday', matchText: 'THỨ BA' },
    { key: 'wed', nameVi: 'Thứ Tư', nameEn: 'Wednesday', matchText: 'THỨ TƯ' },
    { key: 'thu', nameVi: 'Thứ Năm', nameEn: 'Thursday', matchText: 'THỨ NĂM' },
    { key: 'fri', nameVi: 'Thứ Sáu', nameEn: 'Friday', matchText: 'THỨ SÁU' },
    { key: 'sat', nameVi: 'Thứ Bảy', nameEn: 'Saturday', matchText: 'THỨ BẢY' }
  ];

  const weekSchedule: DaySchedule[] = [];

  for (let d = 0; d < daysConfig.length; d++) {
    const config = daysConfig[d];
    let startRow = -1;
    let nextDayStartRow = rows.length;

    for (let r = 0; r < rows.length; r++) {
      const cell = (rows[r][1] || '').toUpperCase();
      if (cell.includes(config.matchText)) {
        startRow = r;
        break;
      }
    }

    if (startRow === -1) continue;

    if (d < daysConfig.length - 1) {
      const nextConfig = daysConfig[d + 1];
      for (let r = startRow + 1; r < rows.length; r++) {
        const cell = (rows[r][1] || '').toUpperCase();
        if (cell.includes(nextConfig.matchText)) {
          nextDayStartRow = r;
          break;
        }
      }
    }

    const rawDate = (rows[startRow][3] || '').trim();
    const dateStr = formatScheduleDate(rawDate) || rawDate;
    const morningItems: ScheduleItem[] = [];
    const afternoonItems: ScheduleItem[] = [];

    // Pre-scan day rows for whole-day holidays (e.g. Nghỉ Lễ 2/9)
    let dayHolidayText = '';
    for (let r = startRow + 1; r < nextDayStartRow; r++) {
      const found = rows[r].find(c => /nghỉ lễ/i.test(c || ''));
      if (found) {
        dayHolidayText = found;
        break;
      }
    }

    for (let r = startRow + 1; r < nextDayStartRow; r++) {
      const row = rows[r];
      const sessionText = (row[1] || '').toUpperCase();
      const periodText = (row[2] || '').trim();
      const rawTime = (row[3] || '').trim();
      const timeText = rawTime.replace(/[\u2010-\u2015\u2212]/g, '-').trim();

      if (!timeText || !timeText.includes('-') || !/\d/.test(timeText)) continue;

      let cellValue = (row[gradeCol] || '').trim();

      // If whole day is a holiday, propagate holiday to all periods
      if (dayHolidayText) {
        cellValue = dayHolidayText;
      } else if (!cellValue) {
        const wholeSchoolEvent = row.slice(4).find(c => {
          const u = (c || '').toUpperCase();
          return u.includes('NGHỈ LỄ') || u.includes('KHAI GIẢNG') || u.includes('REHEARSAL');
        });
        if (wholeSchoolEvent) {
          cellValue = wholeSchoolEvent;
        }
      }

      const periodNum = parseInt(periodText, 10) || 1;
      const isMorning = sessionText.includes('SÁNG') || (!sessionText.includes('CHIỀU') && (r - startRow) <= 7);

      const timeParts = timeText.split('-').map(t => t.trim());
      const formatTime = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return `${String(h || 0).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
      };
      const startTime = formatTime(timeParts[0]);
      const endTime = formatTime(timeParts[1]);

      const cleaned = cleanSubjectName(cellValue);
      const subType = detectSubjectType(cleaned.vi + ' ' + cleaned.note);

      const item: ScheduleItem = {
        period: periodNum,
        time: `${startTime} - ${endTime}`,
        startTime,
        endTime,
        subjectVi: cleaned.vi,
        subjectEn: cleaned.en,
        teacher: cleaned.teacher,
        type: subType,
        room: room || '504',
        note: cleaned.note
      };

      if (isMorning) {
        morningItems.push(item);
        if (periodNum === 2 && config.key !== 'sat') {
          morningItems.push({
            period: 'recess',
            time: "09:35 - 09:55",
            startTime: "09:35",
            endTime: "09:55",
            subjectVi: "Ra chơi sáng",
            subjectEn: "Morning Recess",
            teacher: "",
            type: "break",
            room: "",
            note: "20 phút giải lao"
          });
        }
      } else {
        afternoonItems.push(item);
        if (periodNum === 2) {
          afternoonItems.push({
            period: 'recess',
            time: "15:05 - 15:20",
            startTime: "15:05",
            endTime: "15:20",
            subjectVi: "Ra chơi chiều",
            subjectEn: "Afternoon Recess",
            teacher: "",
            type: "break",
            room: "",
            note: "15 phút giải lao"
          });
        }
      }
    }

    weekSchedule.push({
      dayKey: config.key,
      dayNameVi: config.nameVi,
      dayNameEn: config.nameEn,
      date: dateStr || `31/8/2026`,
      morning: morningItems,
      lunch: {
        time: "11:30 - 13:30",
        startTime: "11:30",
        endTime: "13:30",
        titleVi: "Nghỉ trưa & Dùng bữa",
        titleEn: "Lunch Break & Rest"
      },
      afternoon: afternoonItems
    });
  }

  return {
    classId: matchedClass.id,
    grade: matchedClass.id,
    gradeTitleVi: matchedClass.nameVi,
    gradeTitleEn: matchedClass.nameEn,
    room: room || '504',
    homeroomTeacher: {
      name: hrTeacherName,
      titleVi: 'Giáo viên Chủ nhiệm',
      titleEn: 'Homeroom Teacher',
      subject: 'GVQN'
    },
    weekSchedule: weekSchedule.length > 0 ? weekSchedule : FALLBACK_DATA.weekSchedule,
    teachers: FALLBACK_DATA.teachers
  };
}

/**
 * Main Fetcher for any specified Week Tab and Class
 */
export async function fetchLiveSchedule(
  gid?: string, 
  targetClassId: string = '11-tn',
  sheetId: string = DEFAULT_CONFIG.sheetId
): Promise<ScheduleData> {
  let activeGid = gid;
  if (!activeGid) {
    const latest = await getLatestSheetTab(sheetId);
    activeGid = latest?.gid || DEFAULT_CONFIG.gid;
  }

  const cacheKey = `${activeGid}-${targetClassId}`;
  if (scheduleCache.has(cacheKey)) {
    return scheduleCache.get(cacheKey)!;
  }
  if (inFlightSchedules.has(cacheKey)) {
    return inFlightSchedules.get(cacheKey)!;
  }

  const fetchPromise = (async () => {
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${activeGid}`;
      const res = await fetch(csvUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.statusText}`);

      const csvText = await res.text();
      const parsed = parseSheetCSV(csvText, targetClassId);
      scheduleCache.set(cacheKey, parsed);
      return parsed;
    } finally {
      inFlightSchedules.delete(cacheKey);
    }
  })();

  inFlightSchedules.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Parses raw CSV content dynamically for any specified Room
 */
export function parseSheetCSVForRoom(csvText: string, targetRoomId: string = '504'): ScheduleData {
  const rows = parseCSVTokens(csvText);
  const availableRooms = getAvailableRoomsFromCSV(rows);
  const matchedRoom = availableRooms.find(r => r.id.toLowerCase() === targetRoomId.toLowerCase())
    || INITIAL_ROOMS.find(r => r.id.toLowerCase() === targetRoomId.toLowerCase())
    || availableRooms[0] || INITIAL_ROOMS[0];

  const availableClasses = getAvailableClassesFromCSV(rows);
  const matchedClass = availableClasses.find(c => (c.room || '').toLowerCase() === matchedRoom.id.toLowerCase())
    || availableClasses[0];

  // Base schedule for the primary class in this room
  const baseSchedule = parseSheetCSV(csvText, matchedClass.id);

  // Enhance items with room and class tags
  const enhancedWeekSchedule = baseSchedule.weekSchedule.map(day => ({
    ...day,
    morning: day.morning.map(item => ({
      ...item,
      room: matchedRoom.id,
      classNameVi: matchedClass.nameVi,
      classNameEn: matchedClass.nameEn
    })),
    afternoon: day.afternoon.map(item => ({
      ...item,
      room: matchedRoom.id,
      classNameVi: matchedClass.nameVi,
      classNameEn: matchedClass.nameEn
    }))
  }));

  return {
    ...baseSchedule,
    roomId: matchedRoom.id,
    room: matchedRoom.id,
    roomNameVi: matchedRoom.nameVi,
    roomNameEn: matchedRoom.nameEn,
    floorVi: matchedRoom.floorVi,
    floorEn: matchedRoom.floorEn,
    gradeTitleVi: matchedRoom.defaultClassVi,
    gradeTitleEn: matchedRoom.defaultClassEn,
    homeroomTeacher: {
      name: matchedRoom.homeroomTeacher,
      titleVi: 'Giáo viên Phụ trách',
      titleEn: 'Room Overseer / Homeroom',
      subject: 'Phòng học'
    },
    weekSchedule: enhancedWeekSchedule
  };
}

/**
 * Fetcher for any specified Week Tab and Room
 */
export async function fetchLiveRoomSchedule(
  gid?: string, 
  targetRoomId: string = '504',
  sheetId: string = DEFAULT_CONFIG.sheetId
): Promise<ScheduleData> {
  let activeGid = gid;
  if (!activeGid) {
    const latest = await getLatestSheetTab(sheetId);
    activeGid = latest?.gid || DEFAULT_CONFIG.gid;
  }

  const cacheKey = `room-${activeGid}-${targetRoomId}`;
  if (scheduleCache.has(cacheKey)) {
    return scheduleCache.get(cacheKey)!;
  }
  if (inFlightSchedules.has(cacheKey)) {
    return inFlightSchedules.get(cacheKey)!;
  }

  const fetchPromise = (async () => {
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${activeGid}`;
      const res = await fetch(csvUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.statusText}`);

      const csvText = await res.text();
      const parsed = parseSheetCSVForRoom(csvText, targetRoomId);
      scheduleCache.set(cacheKey, parsed);
      return parsed;
    } catch (e) {
      console.warn(`Falling back to static schedule for room ${targetRoomId}:`, e);
      return getFallbackRoomSchedule(targetRoomId);
    } finally {
      inFlightSchedules.delete(cacheKey);
    }
  })();

  inFlightSchedules.set(cacheKey, fetchPromise);
  return fetchPromise;
}
