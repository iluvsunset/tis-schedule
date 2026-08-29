export type SubjectType = 
  | 'math' 
  | 'english' 
  | 'literature' 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'cs' 
  | 'science' 
  | 'pe' 
  | 'homeroom' 
  | 'event' 
  | 'break';

export type Language = 'vi' | 'en';

export type ThemeKey = 'system' | 'light' | 'dark';

export type ViewMode = 'timeline' | 'grid';

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

export interface ClassInfo {
  id: string; // '6', '7', '8', '9', '10-tn', '10-nt', '11-tn', '12-tn'
  nameVi: string;
  nameEn: string;
  level: 'middle' | 'high'; // THCS vs THPT
  room: string;
  homeroomTeacher: string;
  columnIndex?: number;
}

export interface WeekTabInfo {
  name: string;
  gid: string;
  isLatest?: boolean;
}

export interface ScheduleItem {
  period: number | 'recess';
  time: string;
  startTime: string; // "08:00"
  endTime: string;   // "08:45"
  subjectVi: string;
  subjectEn: string;
  teacher: string;
  type: SubjectType;
  room?: string;
  note?: string;
}

export interface LunchBreak {
  time: string;
  startTime: string;
  endTime: string;
  titleVi: string;
  titleEn: string;
}

export interface DaySchedule {
  dayKey: DayKey;
  dayNameVi: string;
  dayNameEn: string;
  date: string;
  morning: ScheduleItem[];
  lunch: LunchBreak;
  afternoon: ScheduleItem[];
}

export interface TeacherInfo {
  name: string;
  role: string;
  subjectVi: string;
  subjectEn: string;
  room: string;
  color: string;
  icon?: string;
  days?: string;
}

export interface HomeroomTeacher {
  name: string;
  titleVi: string;
  titleEn: string;
  subject: string;
}

export interface ScheduleData {
  classId?: string;
  grade: string;
  gradeTitleVi: string;
  gradeTitleEn: string;
  room: string;
  homeroomTeacher: HomeroomTeacher;
  weekSchedule: DaySchedule[];
  teachers: TeacherInfo[];
}

export interface HomeworkNote {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export const INITIAL_CLASSES: ClassInfo[] = [
  { id: '6', nameVi: 'Lớp 6', nameEn: 'Grade 6', level: 'middle', room: '501', homeroomTeacher: 'Cô Uyển Nhi' },
  { id: '7', nameVi: 'Lớp 7', nameEn: 'Grade 7', level: 'middle', room: '502', homeroomTeacher: 'Cô Thảo' },
  { id: '8', nameVi: 'Lớp 8', nameEn: 'Grade 8', level: 'middle', room: '4010', homeroomTeacher: 'Cô Thuận' },
  { id: '9', nameVi: 'Lớp 9', nameEn: 'Grade 9', level: 'middle', room: '4011', homeroomTeacher: 'Thầy Quân' },
  { id: '10-tn', nameVi: 'Lớp 10-TN', nameEn: 'Grade 10-TN', level: 'high', room: '4012', homeroomTeacher: 'Cô Đặng' },
  { id: '10-nt', nameVi: 'Lớp 10-TN & NT', nameEn: 'Grade 10-TN & NT', level: 'high', room: '307', homeroomTeacher: 'Cô Đặng' },
  { id: '11-tn', nameVi: 'Lớp 11-TN', nameEn: 'Grade 11-TN', level: 'high', room: '504', homeroomTeacher: 'Cô Tiềng' },
  { id: '12-tn', nameVi: 'Lớp 12-TN', nameEn: 'Grade 12-TN', level: 'high', room: '503', homeroomTeacher: 'Thầy Kiên' }
];
