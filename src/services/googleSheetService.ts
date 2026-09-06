import { ScheduleData, DaySchedule, ScheduleItem, SubjectType, DayKey, WeekTabInfo, ClassInfo, INITIAL_CLASSES, RoomInfo, INITIAL_ROOMS } from '../types/schedule';
import { SCHEDULE_DATA as FALLBACK_DATA, getFallbackRoomSchedule } from '../data/scheduleData';
import { formatScheduleDate } from '../utils/vietnamTime';

export interface SheetConfig {
  sheetId: string;
  gid?: string;
  sheetName?: string;
}

const DEFAULT_CONFIG: SheetConfig = {
  sheetId: '1H5U71l1QHVPwCBg9c3KPaADG_jjaaRmxfsCNIXpBQJ4'
};

// In-memory cache for ultra-fast instant switching between weeks & classes
const scheduleCache = new Map<string, ScheduleData | null>();
const inFlightSchedules = new Map<string, Promise<ScheduleData | null>>();
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
    { name: 'Tuần 1', gid: '782076123' },
    { name: 'Tuần 2', gid: '1550771511' },
    { name: 'Tuần 3', gid: '0' },
    { name: 'Tuần 4', gid: '209193378' },
    { name: 'Tuần 5', gid: '676068602' },
    { name: 'Tuần 6', gid: '1209587897', isLatest: true }
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
 * Flexible structural detector for Google Sheet rows:
 * Handles varying column offsets (whether Column A is empty or filled),
 * dynamically locating Header, Room, and Teacher rows.
 */
export function detectSheetStructure(rows: string[][]) {
  let headerRowIdx = 0;
  let roomRowIdx = -1;
  let teacherRowIdx = -1;

  for (let r = 0; r < Math.min(6, rows.length); r++) {
    const rowStr = (rows[r] || []).map(c => (c || '').toLowerCase()).join(' ');
    if (roomRowIdx === -1 && (rowStr.includes('phòng') || rowStr.includes('room'))) {
      roomRowIdx = r;
    }
    if (teacherRowIdx === -1 && (rowStr.includes('gvqn') || rowStr.includes('teacher') || rowStr.includes('giáo viên') || rowStr.includes('gv phụ trách'))) {
      teacherRowIdx = r;
    }
  }

  if (roomRowIdx === -1) roomRowIdx = 1;
  if (teacherRowIdx === -1) teacherRowIdx = 2;

  const headerRow = rows[headerRowIdx] || [];
  const roomRow = rows[roomRowIdx] || [];
  const teacherRow = rows[teacherRowIdx] || [];

  // Locate the first column containing class information (searching for "LỚP", "GRADE", "TRUNG HỌC", etc.)
  let firstClassCol = -1;
  for (let c = 0; c < headerRow.length; c++) {
    const val = (headerRow[c] || '').toUpperCase();
    if (val.includes('LỚP') || val.includes('GRADE') || val.includes('TRUNG HỌC')) {
      firstClassCol = c;
      break;
    }
  }

  // Fallback: search room row where room numbers start (e.g. 501, 502...)
  if (firstClassCol === -1) {
    for (let c = 0; c < roomRow.length; c++) {
      const val = (roomRow[c] || '').trim();
      if (/^\d{3,4}$/.test(val)) {
        firstClassCol = c;
        break;
      }
    }
  }

  if (firstClassCol === -1) firstClassCol = 3;

  return {
    headerRowIdx,
    roomRowIdx,
    teacherRowIdx,
    headerRow,
    roomRow,
    teacherRow,
    firstClassCol
  };
}

/**
 * Discovers available classes dynamically from CSV header rows
 */
export function getAvailableClassesFromCSV(rows: string[][]): ClassInfo[] {
  if (!rows || rows.length < 3) return INITIAL_CLASSES;

  const { headerRow, roomRow, teacherRow, firstClassCol } = detectSheetStructure(rows);
  const classes: ClassInfo[] = [];

  for (let c = firstClassCol; c < headerRow.length; c++) {
    const rawTitle = (headerRow[c] || '').trim();
    if (!rawTitle) continue;

    let id = '';
    let nameVi = '';
    let nameEn = '';
    let level: 'middle' | 'high' = 'high';

    const upper = rawTitle.toUpperCase();
    if (/LỚP\s*6\b|GRADE\s*6\b/.test(upper)) {
      id = '6'; nameVi = 'Lớp 6'; nameEn = 'Grade 6'; level = 'middle';
    } else if (/LỚP\s*7\b|GRADE\s*7\b/.test(upper)) {
      id = '7'; nameVi = 'Lớp 7'; nameEn = 'Grade 7'; level = 'middle';
    } else if (/LỚP\s*8\b|GRADE\s*8\b/.test(upper)) {
      id = '8'; nameVi = 'Lớp 8'; nameEn = 'Grade 8'; level = 'middle';
    } else if (/LỚP\s*9\b|GRADE\s*9\b/.test(upper)) {
      id = '9'; nameVi = 'Lớp 9'; nameEn = 'Grade 9'; level = 'middle';
    } else if (/10\.1|10-1/i.test(rawTitle)) {
      id = '10.1-tn'; nameVi = 'Lớp 10.1-TN'; nameEn = 'Grade 10.1-TN'; level = 'high';
    } else if (/10\.2|10-2/i.test(rawTitle)) {
      id = '10.2-nt'; nameVi = 'Lớp 10.2-TN & NT'; nameEn = 'Grade 10.2-TN & NT'; level = 'high';
    } else if (/10.*NT/i.test(rawTitle)) {
      id = '10-nt'; nameVi = 'Lớp 10-TN & NT'; nameEn = 'Grade 10-TN & NT'; level = 'high';
    } else if (/10/i.test(rawTitle)) {
      id = '10-tn'; nameVi = 'Lớp 10-TN'; nameEn = 'Grade 10-TN'; level = 'high';
    } else if (/11\.1|11-1/i.test(rawTitle)) {
      id = '11.1-tn'; nameVi = 'Lớp 11.1-TN'; nameEn = 'Grade 11.1-TN'; level = 'high';
    } else if (/11\.2|11-2/i.test(rawTitle)) {
      id = '11.2-xh'; nameVi = 'Lớp 11.2-TN & XH'; nameEn = 'Grade 11.2-TN & XH'; level = 'high';
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
 * Flexible Class Matcher supporting aliases (e.g., 11-tn -> 11.1-tn, 10-tn -> 10.1-tn)
 */
export function findMatchingClass(classes: ClassInfo[], targetClassId: string = '11-tn'): ClassInfo {
  const norm = targetClassId.trim().toLowerCase();
  
  // Exact match first
  let matched = classes.find(c => c.id.toLowerCase() === norm);
  if (matched) return matched;

  // Flexible Aliases
  if (norm === '11-tn' || norm === '11') {
    matched = classes.find(c => c.id === '11.1-tn') || classes.find(c => c.id === '11-tn') || classes.find(c => c.id.startsWith('11'));
  } else if (norm === '11.1-tn' || norm === '11-1-tn' || norm === '11.1') {
    matched = classes.find(c => c.id === '11.1-tn') || classes.find(c => c.id === '11-tn');
  } else if (norm === '11.2-tn' || norm === '11.2-xh' || norm === '11-2-tn' || norm === '11.2') {
    matched = classes.find(c => c.id === '11.2-xh') || classes.find(c => c.id.includes('11.2'));
  } else if (norm === '10-tn' || norm === '10') {
    matched = classes.find(c => c.id === '10.1-tn') || classes.find(c => c.id === '10-tn') || classes.find(c => c.id.startsWith('10'));
  } else if (norm === '10.1-tn' || norm === '10-1-tn' || norm === '10.1') {
    matched = classes.find(c => c.id === '10.1-tn') || classes.find(c => c.id === '10-tn');
  } else if (norm === '10-nt' || norm === '10.2-nt' || norm === '10-2-nt' || norm === '10.2') {
    matched = classes.find(c => c.id === '10.2-nt') || classes.find(c => c.id === '10-nt') || classes.find(c => c.id.includes('10.2'));
  } else if (norm === '12' || norm === '12-tn') {
    matched = classes.find(c => c.id === '12-tn') || classes.find(c => c.id.startsWith('12'));
  }

  return matched || classes[0] || INITIAL_CLASSES[0];
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
 * Discovers available rooms dynamically from CSV header rows
 */
export function getAvailableRoomsFromCSV(rows: string[][]): RoomInfo[] {
  if (!rows || rows.length < 3) return INITIAL_ROOMS;

  const { headerRow, roomRow, teacherRow, firstClassCol } = detectSheetStructure(rows);
  const roomsMap = new Map<string, RoomInfo>();

  for (let c = firstClassCol; c < roomRow.length; c++) {
    const rawRoom = (roomRow[c] || '').trim();
    if (!rawRoom) continue;

    const roomId = rawRoom;
    if (!roomsMap.has(roomId)) {
      const rawClass = (headerRow[c] || '').trim();
      const rawTeacher = (teacherRow[c] || '').trim();
      const homeroomTeacher = rawTeacher.replace(/^[CT]\.\s*/i, (m) => m.toUpperCase().startsWith('C') ? 'Cô ' : 'Thầy ');
      
      const floorVi = roomId.startsWith('5') ? 'Tầng 5' : roomId.startsWith('4') ? 'Tầng 4' : roomId.startsWith('3') ? 'Tầng 3' : 'Tầng TIS';
      const floorEn = roomId.startsWith('5') ? 'Floor 5' : roomId.startsWith('4') ? 'Floor 4' : roomId.startsWith('3') ? 'Floor 3' : 'Floor TIS';

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
 * Helper to determine subject category for styling
 */
export const detectSubjectType = (text: string): SubjectType => {
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
  if (t.includes('shl') || t.includes('sinh hoạt') || t.includes('hướng nghiệp') || t.includes('hđtn')) return 'homeroom';
  if (t.includes('khai giảng') || t.includes('good morning') || t.includes('rehearsal') || t.includes('nghỉ lễ') || t.includes('hội đồng')) return 'event';
  return 'event';
};

/**
 * Subject Name and Teacher Cleaner
 */
export const cleanSubjectName = (raw: string): { vi: string; en: string; teacher: string; note: string } => {
  if (!raw || raw.trim() === '') {
    return { vi: 'Tự học / Nghỉ', en: 'Self Study / Free', teacher: 'Chưa phân công', note: '' };
  }

  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const firstLine = lines[0] || '';

  // National Holiday
  if (/nghỉ lễ/i.test(firstLine)) {
    return {
      vi: 'Nghỉ Lễ Quốc Khánh',
      en: 'National Day Holiday',
      teacher: 'Nghỉ toàn trường',
      note: firstLine
    };
  }

  // Opening Ceremony
  if (/khai giảng/i.test(firstLine)) {
    return {
      vi: 'Lễ Khai Giảng Năm Học',
      en: 'School Year Opening Ceremony',
      teacher: 'Toàn Trường (All School)',
      note: lines.join(' • ')
    };
  }

  // Rehearsal
  if (/rehearsal/i.test(firstLine)) {
    return {
      vi: 'Rehearsal Lễ Khai Giảng',
      en: 'Ceremony Rehearsal',
      teacher: 'Toàn Trường',
      note: lines.join(' • ')
    };
  }

  // Morning Assembly
  if (/good morning/i.test(firstLine) || /hđtn.*good morning/i.test(firstLine)) {
    return {
      vi: 'Sinh Hoạt Đầu Tuần (Good Morning)',
      en: 'Morning Assembly (Good Morning)',
      teacher: 'Toàn Trường',
      note: lines.join(' • ')
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

  // Science / Math in English multi-line
  if (firstLine.toUpperCase() === 'SCIENCE' || firstLine.toUpperCase() === 'MATH') {
    const teacherLines = lines.slice(1).join(' & ');
    return {
      vi: firstLine.toUpperCase() === 'SCIENCE' ? 'Khoa Học Tiếng Anh (Science)' : 'Toán Tiếng Anh (Math)',
      en: firstLine.toUpperCase() === 'SCIENCE' ? 'Science' : 'Mathematics',
      teacher: teacherLines || 'Ms. Hải Lý',
      note: lines.join(' • ')
    };
  }

  // Format: "MÔN-GIÁO VIÊN" e.g. "TOÁN-NHI", "GDTC-HẢI"
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
      'NT (MĨ THUẬT)': { vi: 'Nghệ Thuật (Mĩ Thuật)', en: 'Fine Arts' },
      'MĨ THUẬT': { vi: 'Mĩ Thuật', en: 'Fine Arts' },
      'NHẠC': { vi: 'Âm Nhạc', en: 'Music' },
      'GDKTPL': { vi: 'Kinh Tế & Pháp Luật', en: 'Economic & Legal Education' },
      'CĐ TIN': { vi: 'Chuyên Đề Tin Học', en: 'Applied Computer Science' },
      'CĐ LÝ': { vi: 'Chuyên Đề Vật Lý', en: 'Advanced Physics' },
      'CĐ HÓA': { vi: 'Chuyên Đề Hóa Học', en: 'Advanced Chemistry' },
      'CĐ VĂN': { vi: 'Chuyên Đề Ngữ Văn', en: 'Advanced Literature' },
      'CĐ TOÁN': { vi: 'Chuyên Đề Toán', en: 'Advanced Mathematics' },
      'LSĐL (ĐỊA)': { vi: 'Lịch Sử & Địa Lý (Địa)', en: 'History & Geography (Geo)' },
      'LSĐL (SỬ)': { vi: 'Lịch Sử & Địa Lý (Sử)', en: 'History & Geography (Hist)' },
      'GDĐP': { vi: 'Giáo Dục Địa Phương', en: 'Local Education' },
      'GDCD': { vi: 'Giáo Dục Công Dân', en: 'Civic Education' },
      'HĐTN': { vi: 'Hoạt Động Trải Nghiệm', en: 'Experiential Activity' },
      'CN': { vi: 'Công Nghệ', en: 'Technology' },
      'SỬ': { vi: 'Lịch Sử', en: 'History' },
      'ĐỊA': { vi: 'Địa Lý', en: 'Geography' },
      'MATH': { vi: 'Toán Tiếng Anh (Math)', en: 'English Mathematics' },
      'SCIENCE': { vi: 'Khoa Học Tiếng Anh (Science)', en: 'English Science' }
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

/**
 * Dynamic Universal CSV parser for any specified Class
 */
export function parseSheetCSV(csvText: string, targetClassId: string = '11-tn'): ScheduleData {
  const rows = parseCSVTokens(csvText);
  if (!rows || rows.length < 3) {
    return FALLBACK_DATA;
  }

  const { roomRow, teacherRow, firstClassCol } = detectSheetStructure(rows);
  const availableClasses = getAvailableClassesFromCSV(rows);
  const matchedClass = findMatchingClass(availableClasses, targetClassId);

  const gradeCol = matchedClass.columnIndex ?? firstClassCol;
  const room = (roomRow[gradeCol] || matchedClass.room || '504').trim();
  const rawTeacher = (teacherRow[gradeCol] || matchedClass.homeroomTeacher || 'Cô Tiềng').trim();
  const hrTeacherName = rawTeacher.replace(/^[CT]\.\s*/i, (m) => m.toUpperCase().startsWith('C') ? 'Cô ' : 'Thầy ');

  // Day Definitions & regex matchers
  const daysConfig: { key: DayKey; nameVi: string; nameEn: string; match: RegExp }[] = [
    { key: 'mon', nameVi: 'Thứ Hai', nameEn: 'Monday', match: /THỨ\s*HAI|MONDAY/i },
    { key: 'tue', nameVi: 'Thứ Ba', nameEn: 'Tuesday', match: /THỨ\s*BA|TUESDAY/i },
    { key: 'wed', nameVi: 'Thứ Tư', nameEn: 'Wednesday', match: /THỨ\s*TƯ|WEDNESDAY/i },
    { key: 'thu', nameVi: 'Thứ Năm', nameEn: 'Thursday', match: /THỨ\s*NĂM|THURSDAY/i },
    { key: 'fri', nameVi: 'Thứ Sáu', nameEn: 'Friday', match: /THỨ\s*SÁU|FRIDAY/i },
    { key: 'sat', nameVi: 'Thứ Bảy', nameEn: 'Saturday', match: /THỨ\s*BẢY|SATURDAY/i }
  ];

  // Universal scan for day header rows across prefix columns
  const daySections: { dayConfig: typeof daysConfig[0]; startRow: number; dateStr: string }[] = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const scanLimit = Math.min(Math.max(firstClassCol, 4), row.length);
    for (let c = 0; c < scanLimit; c++) {
      const cell = (row[c] || '').trim();
      if (!cell) continue;

      const matchedDay = daysConfig.find(d => d.match.test(cell));
      if (matchedDay) {
        // Extract date from this row regardless of column
        let dateStr = '';
        for (let dc = 0; dc < row.length; dc++) {
          const dateMatch = (row[dc] || '').match(/\b(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/);
          if (dateMatch) {
            dateStr = formatScheduleDate(dateMatch[1]) || dateMatch[1];
            break;
          }
        }
        daySections.push({ dayConfig: matchedDay, startRow: r, dateStr });
        break;
      }
    }
  }

  const weekSchedule: DaySchedule[] = [];

  for (let d = 0; d < daySections.length; d++) {
    const section = daySections[d];
    const startRow = section.startRow;
    const nextDayStartRow = (d < daySections.length - 1) ? daySections[d + 1].startRow : rows.length;

    // Check if entire day is a national holiday
    let dayHolidayText = '';
    for (let r = startRow + 1; r < nextDayStartRow; r++) {
      const found = rows[r].find(c => /nghỉ lễ/i.test(c || ''));
      if (found) {
        dayHolidayText = found;
        break;
      }
    }

    let currentSession: 'morning' | 'afternoon' = 'morning';
    const morningItems: ScheduleItem[] = [];
    const afternoonItems: ScheduleItem[] = [];

    for (let r = startRow + 1; r < nextDayStartRow; r++) {
      const row = rows[r];
      const rowPrefixText = row.slice(0, firstClassCol).join(' ').toUpperCase();

      if (rowPrefixText.includes('CHIỀU') || rowPrefixText.includes('AFTERNOON') || rowPrefixText.includes('LUNCH') || rowPrefixText.includes('NGHỈ TRƯA')) {
        currentSession = 'afternoon';
      } else if (rowPrefixText.includes('SÁNG') || rowPrefixText.includes('MORNING')) {
        currentSession = 'morning';
      }

      // Search prefix columns for time range
      let timeText = '';
      let periodText = '';
      for (let c = 0; c < firstClassCol; c++) {
        const cellRaw = (row[c] || '').replace(/[\u2010-\u2015\u2212]/g, '-').trim();
        const timeMatch = cellRaw.match(/(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/);
        if (timeMatch) {
          timeText = `${timeMatch[1]} - ${timeMatch[2]}`;
        } else if (/^[1-5]$/.test(cellRaw)) {
          periodText = cellRaw;
        }
      }

      if (!timeText) continue;

      let cellValue = (row[gradeCol] || '').trim();

      // If whole day holiday, propagate
      if (dayHolidayText) {
        cellValue = dayHolidayText;
      } else if (!cellValue) {
        // Check for whole-school event across class columns
        const wholeSchoolEvent = row.slice(firstClassCol).find(c => {
          const u = (c || '').toUpperCase();
          return u.includes('NGHỈ LỄ') || u.includes('KHAI GIẢNG') || u.includes('REHEARSAL') || u.includes('GOOD MORNING') || u.includes('HỘI ĐỒNG');
        });
        if (wholeSchoolEvent) {
          cellValue = wholeSchoolEvent;
        }
      }

      const periodNum = parseInt(periodText, 10) || 
        (currentSession === 'morning' 
          ? morningItems.filter(i => i.period !== 'recess').length + 1 
          : afternoonItems.filter(i => i.period !== 'recess').length + 1);

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
        room: matchedClass.room || room || '504',
        note: cleaned.note
      };

      if (currentSession === 'morning') {
        morningItems.push(item);
        if (periodNum === 2 && section.dayConfig.key !== 'sat') {
          morningItems.push({
            period: 'recess',
            time: `${endTime} - 09:30`,
            startTime: endTime,
            endTime: '09:30',
            subjectVi: 'Ra chơi sáng',
            subjectEn: 'Morning Recess',
            teacher: '',
            type: 'break',
            room: '',
            note: '20 phút giải lao'
          });
        }
      } else {
        afternoonItems.push(item);
        if (periodNum === 2) {
          afternoonItems.push({
            period: 'recess',
            time: `${endTime} - 15:20`,
            startTime: endTime,
            endTime: '15:20',
            subjectVi: 'Ra chơi chiều',
            subjectEn: 'Afternoon Recess',
            teacher: '',
            type: 'break',
            room: '',
            note: '15 phút giải lao'
          });
        }
      }
    }

    weekSchedule.push({
      dayKey: section.dayConfig.key,
      dayNameVi: section.dayConfig.nameVi,
      dayNameEn: section.dayConfig.nameEn,
      date: section.dateStr || '7/9/2026',
      morning: morningItems,
      lunch: {
        time: '11:30 - 13:30',
        startTime: '11:30',
        endTime: '13:30',
        titleVi: 'Nghỉ trưa & Dùng bữa',
        titleEn: 'Lunch Break & Rest'
      },
      afternoon: afternoonItems
    });
  }

  return {
    classId: matchedClass.id,
    grade: matchedClass.id,
    gradeTitleVi: matchedClass.nameVi,
    gradeTitleEn: matchedClass.nameEn,
    room: room || matchedClass.room || '504',
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
    activeGid = latest?.gid;
  }
  if (!activeGid) {
    const allTabs = await getAllSheetTabs(sheetId);
    activeGid = allTabs[allTabs.length - 1]?.gid || '1209587897';
  }

  const cacheKey = `${activeGid}-${targetClassId}`;
  if (scheduleCache.has(cacheKey)) {
    return scheduleCache.get(cacheKey)! as ScheduleData;
  }
  if (inFlightSchedules.has(cacheKey)) {
    return inFlightSchedules.get(cacheKey)! as Promise<ScheduleData>;
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
export function parseSheetCSVForRoom(csvText: string, targetRoomId: string = '504'): ScheduleData | null {
  const cleanTarget = targetRoomId.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  const rows = parseCSVTokens(csvText);
  const availableRooms = getAvailableRoomsFromCSV(rows);
  const matchedRoom = availableRooms.find(r => r.id.toLowerCase() === cleanTarget.toLowerCase())
    || INITIAL_ROOMS.find(r => r.id.toLowerCase() === cleanTarget.toLowerCase());

  // Strict check: if room is not found, return null
  if (!matchedRoom) {
    return null;
  }

  const availableClasses = getAvailableClassesFromCSV(rows);
  const matchedClass = availableClasses.find(c => (c.room || '').toLowerCase() === matchedRoom.id.toLowerCase())
    || availableClasses[0];

  // Base schedule for the primary class in this room
  const baseSchedule = parseSheetCSV(csvText, matchedClass ? matchedClass.id : '11-tn');

  // Enhance items with room and class tags
  const enhancedWeekSchedule = baseSchedule.weekSchedule.map(day => ({
    ...day,
    morning: day.morning.map(item => ({
      ...item,
      room: matchedRoom.id,
      classNameVi: matchedClass ? matchedClass.nameVi : matchedRoom.defaultClassVi,
      classNameEn: matchedClass ? matchedClass.nameEn : matchedRoom.defaultClassEn
    })),
    afternoon: day.afternoon.map(item => ({
      ...item,
      room: matchedRoom.id,
      classNameVi: matchedClass ? matchedClass.nameVi : matchedRoom.defaultClassVi,
      classNameEn: matchedClass ? matchedClass.nameEn : matchedRoom.defaultClassEn
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
): Promise<ScheduleData | null> {
  const cleanTarget = targetRoomId.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  let activeGid = gid;
  if (!activeGid) {
    const latest = await getLatestSheetTab(sheetId);
    activeGid = latest?.gid;
  }
  if (!activeGid) {
    const allTabs = await getAllSheetTabs(sheetId);
    activeGid = allTabs[allTabs.length - 1]?.gid || '1209587897';
  }

  const cacheKey = `room-${activeGid}-${cleanTarget}`;
  if (scheduleCache.has(cacheKey)) {
    const cached = scheduleCache.get(cacheKey);
    if (cached) return cached;
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
      const parsed = parseSheetCSVForRoom(csvText, cleanTarget);
      if (parsed) {
        scheduleCache.set(cacheKey, parsed);
        return parsed;
      }
      const fallback = getFallbackRoomSchedule(cleanTarget);
      if (fallback) {
        scheduleCache.set(cacheKey, fallback);
        return fallback;
      }
      return null;
    } catch (e) {
      console.warn(`Falling back to static schedule for room ${cleanTarget}:`, e);
      return getFallbackRoomSchedule(cleanTarget);
    } finally {
      inFlightSchedules.delete(cacheKey);
    }
  })();

  inFlightSchedules.set(cacheKey, fetchPromise);
  return fetchPromise;
}
