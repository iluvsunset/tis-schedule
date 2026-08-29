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
