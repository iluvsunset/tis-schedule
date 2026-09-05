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
  classNameVi?: string;
  classNameEn?: string;
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
  roomId?: string;
  grade: string;
  gradeTitleVi: string;
  gradeTitleEn: string;
  room: string;
  roomNameVi?: string;
  roomNameEn?: string;
  floorVi?: string;
  floorEn?: string;
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

export interface RoomInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  floorVi: string;
  floorEn: string;
  defaultClassVi: string;
  defaultClassEn: string;
  homeroomTeacher: string;
}

export const INITIAL_ROOMS: RoomInfo[] = [
  { id: '504', nameVi: 'Phòng 504', nameEn: 'Room 504', floorVi: 'Tầng 5', floorEn: 'Floor 5', defaultClassVi: 'Lớp 11-TN', defaultClassEn: 'Grade 11-TN', homeroomTeacher: 'Cô Tiềng' },
  { id: '4012', nameVi: 'Phòng 4012', nameEn: 'Room 4012', floorVi: 'Tầng 4', floorEn: 'Floor 4', defaultClassVi: 'Lớp 10-TN', defaultClassEn: 'Grade 10-TN', homeroomTeacher: 'Cô Đặng' },
  { id: '307', nameVi: 'Phòng 307', nameEn: 'Room 307', floorVi: 'Tầng 3', floorEn: 'Floor 3', defaultClassVi: 'Lớp 10-TN & NT', defaultClassEn: 'Grade 10-TN & NT', homeroomTeacher: 'Cô Đặng' },
  { id: '4010', nameVi: 'Phòng 4010', nameEn: 'Room 4010', floorVi: 'Tầng 4', floorEn: 'Floor 4', defaultClassVi: 'Lớp 8', defaultClassEn: 'Grade 8', homeroomTeacher: 'Cô Thuận' },
  { id: '4011', nameVi: 'Phòng 4011', nameEn: 'Room 4011', floorVi: 'Tầng 4', floorEn: 'Floor 4', defaultClassVi: 'Lớp 9', defaultClassEn: 'Grade 9', homeroomTeacher: 'Thầy Quân' },
  { id: '503', nameVi: 'Phòng 503', nameEn: 'Room 503', floorVi: 'Tầng 5', floorEn: 'Floor 5', defaultClassVi: 'Lớp 12-TN', defaultClassEn: 'Grade 12-TN', homeroomTeacher: 'Thầy Kiên' },
  { id: '502', nameVi: 'Phòng 502', nameEn: 'Room 502', floorVi: 'Tầng 5', floorEn: 'Floor 5', defaultClassVi: 'Lớp 7', defaultClassEn: 'Grade 7', homeroomTeacher: 'Cô Thảo' },
  { id: '501', nameVi: 'Phòng 501', nameEn: 'Room 501', floorVi: 'Tầng 5', floorEn: 'Floor 5', defaultClassVi: 'Lớp 6', defaultClassEn: 'Grade 6', homeroomTeacher: 'Cô Uyển Nhi' },
];

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
