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
  startTime: string; // "07:40"
  endTime: string;   // "08:25"
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
  { id: '504', nameVi: 'Phòng 504', nameEn: 'Room 504', floorVi: 'Tầng 5', floorEn: 'Floor 5', defaultClassVi: 'Lớp 11.1-TN', defaultClassEn: 'Grade 11.1-TN', homeroomTeacher: 'Cô Tiềng' },
  { id: 'P. Tâm lý học đường', nameVi: 'P. Tâm lý học đường', nameEn: 'Psychology Room', floorVi: 'Tầng 5', floorEn: 'Floor 5', defaultClassVi: 'Lớp 11.2-TN & XH', defaultClassEn: 'Grade 11.2-TN & XH', homeroomTeacher: 'Cô Tiềng' }
];

export const INITIAL_CLASSES: ClassInfo[] = [
  { id: '11.1-tn', nameVi: 'Lớp 11.1-TN', nameEn: 'Grade 11.1-TN', level: 'high', room: '504', homeroomTeacher: 'Cô Tiềng' },
  { id: '11.2-xh', nameVi: 'Lớp 11.2-TN & XH', nameEn: 'Grade 11.2-TN & XH', level: 'high', room: 'P. Tâm lý học đường', homeroomTeacher: 'Cô Tiềng' }
];

