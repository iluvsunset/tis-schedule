import { ScheduleData, SubjectType } from '../types/schedule';

export const SCHEDULE_DATA: ScheduleData = {
  grade: "11-TN",
  gradeTitleVi: "Lớp 11 - Tự Nhiên",
  gradeTitleEn: "Grade 11 - Natural Sciences",
  room: "504",
  homeroomTeacher: {
    name: "Cô Tiềng",
    titleVi: "Giáo Viên Chủ Nhiệm (GVQN)",
    titleEn: "Homeroom Teacher",
    subject: "Sinh Hoạt Lớp"
  },
  weekSchedule: [
    {
      dayKey: "mon",
      dayNameVi: "Thứ Hai",
      dayNameEn: "Monday",
      date: "24/8/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Good Morning TIS",
          subjectEn: "School Assembly / Good Morning TIS",
          teacher: "Toàn Trường (All School)",
          type: "event",
          room: "Sân trường / Assembly",
          note: "8:00 - 9:00 Hoạt động đầu tuần"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Toán (Math)",
          subjectEn: "Mathematics",
          teacher: "Thầy Thành",
          type: "math",
          room: "504",
          note: "TOÁN-THÀNH"
        },
        {
          period: "recess",
          time: "09:35 - 09:55",
          startTime: "09:35",
          endTime: "09:55",
          subjectVi: "Ra chơi sáng",
          subjectEn: "Morning Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "20 phút giải lao"
        },
        {
          period: 3,
          time: "09:55 - 10:40",
          startTime: "09:55",
          endTime: "10:40",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Mr. Steven",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 1"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Mr. Steven",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 2"
        }
      ],
      lunch: {
        time: "11:30 - 13:30",
        startTime: "11:30",
        endTime: "13:30",
        titleVi: "Nghỉ trưa & Dùng bữa",
        titleEn: "Lunch Break & Rest"
      },
      afternoon: [
        {
          period: 1,
          time: "13:30 - 14:15",
          startTime: "13:30",
          endTime: "14:15",
          subjectVi: "Tin Học",
          subjectEn: "Computer Science",
          teacher: "Thầy Quân",
          type: "cs",
          room: "Lab Tin",
          note: "TIN-QUÂN"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Tin Học",
          subjectEn: "Computer Science",
          teacher: "Thầy Quân",
          type: "cs",
          room: "Lab Tin",
          note: "TIN-QUÂN"
        },
        {
          period: "recess",
          time: "15:05 - 15:20",
          startTime: "15:05",
          endTime: "15:20",
          subjectVi: "Ra chơi chiều",
          subjectEn: "Afternoon Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "15 phút giải lao"
        },
        {
          period: 3,
          time: "15:20 - 16:05",
          startTime: "15:20",
          endTime: "16:05",
          subjectVi: "Toán",
          subjectEn: "Mathematics",
          teacher: "Thầy Thành",
          type: "math",
          room: "504",
          note: "TOÁN-THÀNH"
        }
      ]
    },
    {
      dayKey: "tue",
      dayNameVi: "Thứ Ba",
      dayNameEn: "Tuesday",
      date: "25/8/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Vật Lý",
          subjectEn: "Physics",
          teacher: "Cô Thuận",
          type: "physics",
          room: "504",
          note: "LÝ-THUẬN"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Vật Lý",
          subjectEn: "Physics",
          teacher: "Cô Thuận",
          type: "physics",
          room: "504",
          note: "LÝ-THUẬN"
        },
        {
          period: "recess",
          time: "09:35 - 09:55",
          startTime: "09:35",
          endTime: "09:55",
          subjectVi: "Ra chơi sáng",
          subjectEn: "Morning Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "20 phút giải lao"
        },
        {
          period: 3,
          time: "09:55 - 10:40",
          startTime: "09:55",
          endTime: "10:40",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Ms. Phương Anh",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 3"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Ms. Phương Anh",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 4"
        }
      ],
      lunch: {
        time: "11:30 - 13:30",
        startTime: "11:30",
        endTime: "13:30",
        titleVi: "Nghỉ trưa & Dùng bữa",
        titleEn: "Lunch Break & Rest"
      },
      afternoon: [
        {
          period: 1,
          time: "13:30 - 14:15",
          startTime: "13:30",
          endTime: "14:15",
          subjectVi: "Ngữ Văn",
          subjectEn: "Literature",
          teacher: "Cô Cam",
          type: "literature",
          room: "504",
          note: "VĂN-CAM"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Ngữ Văn",
          subjectEn: "Literature",
          teacher: "Cô Cam",
          type: "literature",
          room: "504",
          note: "VĂN-CAM"
        },
        {
          period: "recess",
          time: "15:05 - 15:20",
          startTime: "15:05",
          endTime: "15:20",
          subjectVi: "Ra chơi chiều",
          subjectEn: "Afternoon Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "15 phút giải lao"
        },
        {
          period: 3,
          time: "15:20 - 16:05",
          startTime: "15:20",
          endTime: "16:05",
          subjectVi: "Hóa Học",
          subjectEn: "Chemistry",
          teacher: "Thầy Tân",
          type: "chemistry",
          room: "504",
          note: "HÓA-TÂN"
        }
      ]
    },
    {
      dayKey: "wed",
      dayNameVi: "Thứ Tư",
      dayNameEn: "Wednesday",
      date: "26/8/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Tin Học",
          subjectEn: "Computer Science",
          teacher: "Thầy Quân",
          type: "cs",
          room: "Lab Tin",
          note: "TIN-QUÂN"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Tin Học",
          subjectEn: "Computer Science",
          teacher: "Thầy Quân",
          type: "cs",
          room: "Lab Tin",
          note: "TIN-QUÂN"
        },
        {
          period: "recess",
          time: "09:35 - 09:55",
          startTime: "09:35",
          endTime: "09:55",
          subjectVi: "Ra chơi sáng",
          subjectEn: "Morning Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "20 phút giải lao"
        },
        {
          period: 3,
          time: "09:55 - 10:40",
          startTime: "09:55",
          endTime: "10:40",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Mr. Steven",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 5"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Mr. Steven",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 6"
        }
      ],
      lunch: {
        time: "11:30 - 13:30",
        startTime: "11:30",
        endTime: "13:30",
        titleVi: "Nghỉ trưa & Dùng bữa",
        titleEn: "Lunch Break & Rest"
      },
      afternoon: [
        {
          period: 1,
          time: "13:30 - 14:15",
          startTime: "13:30",
          endTime: "14:15",
          subjectVi: "Science",
          subjectEn: "Integrated Science",
          teacher: "Ms. Hạnh",
          type: "science",
          room: "504",
          note: "SCIENCE - Ms. Hạnh"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Science",
          subjectEn: "Integrated Science",
          teacher: "Ms. Hạnh",
          type: "science",
          room: "504",
          note: "SCIENCE - Ms. Hạnh"
        },
        {
          period: "recess",
          time: "15:05 - 15:20",
          startTime: "15:05",
          endTime: "15:20",
          subjectVi: "Ra chơi chiều",
          subjectEn: "Afternoon Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "15 phút giải lao"
        },
        {
          period: 3,
          time: "15:20 - 16:05",
          startTime: "15:20",
          endTime: "16:05",
          subjectVi: "Toán",
          subjectEn: "Mathematics",
          teacher: "Thầy Thành",
          type: "math",
          room: "504",
          note: "TOÁN-THÀNH"
        }
      ]
    },
    {
      dayKey: "thu",
      dayNameVi: "Thứ Năm",
      dayNameEn: "Thursday",
      date: "27/8/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Giáo Dục Thể Chất",
          subjectEn: "Physical Education (PE)",
          teacher: "Thầy Hải",
          type: "pe",
          room: "Sân thể thao",
          note: "GDTC-HẢI"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Giáo Dục Thể Chất",
          subjectEn: "Physical Education (PE)",
          teacher: "Thầy Hải",
          type: "pe",
          room: "Sân thể thao",
          note: "GDTC-HẢI"
        },
        {
          period: "recess",
          time: "09:35 - 09:55",
          startTime: "09:35",
          endTime: "09:55",
          subjectVi: "Ra chơi sáng",
          subjectEn: "Morning Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "20 phút giải lao"
        },
        {
          period: 3,
          time: "09:55 - 10:40",
          startTime: "09:55",
          endTime: "10:40",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Ms. Phương Anh",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 7"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Ms. Phương Anh",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 8"
        }
      ],
      lunch: {
        time: "11:30 - 13:30",
        startTime: "11:30",
        endTime: "13:30",
        titleVi: "Nghỉ trưa & Dùng bữa",
        titleEn: "Lunch Break & Rest"
      },
      afternoon: [
        {
          period: 1,
          time: "13:30 - 14:15",
          startTime: "13:30",
          endTime: "14:15",
          subjectVi: "Hóa Học",
          subjectEn: "Chemistry",
          teacher: "Thầy Tân",
          type: "chemistry",
          room: "504",
          note: "HÓA-TÂN"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Hóa Học",
          subjectEn: "Chemistry",
          teacher: "Thầy Tân",
          type: "chemistry",
          room: "504",
          note: "HÓA-TÂN"
        },
        {
          period: "recess",
          time: "15:05 - 15:20",
          startTime: "15:05",
          endTime: "15:20",
          subjectVi: "Ra chơi chiều",
          subjectEn: "Afternoon Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "15 phút giải lao"
        },
        {
          period: 3,
          time: "15:20 - 16:05",
          startTime: "15:20",
          endTime: "16:05",
          subjectVi: "Sinh Hoạt Lớp (SHL)",
          subjectEn: "Homeroom Activity",
          teacher: "Cô Tiềng",
          type: "homeroom",
          room: "504",
          note: "SHL-TIỀNG"
        }
      ]
    },
    {
      dayKey: "fri",
      dayNameVi: "Thứ Sáu",
      dayNameEn: "Friday",
      date: "28/8/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Sinh Học",
          subjectEn: "Biology",
          teacher: "Thầy Công",
          type: "biology",
          room: "504",
          note: "SINH-CÔNG"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Toán",
          subjectEn: "Mathematics",
          teacher: "Thầy Thành",
          type: "math",
          room: "504",
          note: "TOÁN-THÀNH"
        },
        {
          period: "recess",
          time: "09:35 - 09:55",
          startTime: "09:35",
          endTime: "09:55",
          subjectVi: "Ra chơi sáng",
          subjectEn: "Morning Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "20 phút giải lao"
        },
        {
          period: 3,
          time: "09:55 - 10:40",
          startTime: "09:55",
          endTime: "10:40",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Ms. Phương Anh",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 9"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "English (Level 10)",
          subjectEn: "English (Level 10)",
          teacher: "Ms. Phương Anh",
          type: "english",
          room: "504",
          note: "Level 10 - Eng 10"
        }
      ],
      lunch: {
        time: "11:30 - 13:30",
        startTime: "11:30",
        endTime: "13:30",
        titleVi: "Nghỉ trưa & Dùng bữa",
        titleEn: "Lunch Break & Rest"
      },
      afternoon: [
        {
          period: 1,
          time: "13:30 - 14:15",
          startTime: "13:30",
          endTime: "14:15",
          subjectVi: "Ngữ Văn",
          subjectEn: "Literature",
          teacher: "Cô Cam",
          type: "literature",
          room: "504",
          note: "VĂN-CAM"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Ngữ Văn",
          subjectEn: "Literature",
          teacher: "Cô Cam",
          type: "literature",
          room: "504",
          note: "VĂN-CAM"
        },
        {
          period: "recess",
          time: "15:05 - 15:20",
          startTime: "15:05",
          endTime: "15:20",
          subjectVi: "Ra chơi chiều",
          subjectEn: "Afternoon Recess",
          teacher: "",
          type: "break",
          room: "",
          note: "15 phút giải lao"
        },
        {
          period: 3,
          time: "15:20 - 16:05",
          startTime: "15:20",
          endTime: "16:05",
          subjectVi: "Bầu cử BCH Hội Đồng Học Sinh",
          subjectEn: "Student Council Election",
          teacher: "Toàn Trường (School Activity)",
          type: "event",
          room: "Hội trường",
          note: "Hoạt động chung toàn trường"
        }
      ]
    }
  ],
  teachers: [
    { name: "Cô Tiềng", role: "GVQN (Homeroom)", subjectVi: "Sinh Hoạt Lớp", subjectEn: "Homeroom Activities", room: "Phòng 504", color: "purple", icon: "HeartHandshake", days: "Thứ 5 Chiều" },
    { name: "Thầy Thành", role: "Bộ môn Toán", subjectVi: "Toán Học", subjectEn: "Mathematics", room: "Phòng 504", color: "blue", icon: "Calculator", days: "T2, T4, T6" },
    { name: "Cô Cam", role: "Bộ môn Ngữ Văn", subjectVi: "Ngữ Văn", subjectEn: "Literature", room: "Phòng 504", color: "rose", icon: "BookOpen", days: "T3, T6 Chiều" },
    { name: "Cô Thuận", role: "Bộ môn Vật Lý", subjectVi: "Vật Lý", subjectEn: "Physics", room: "Phòng 504", color: "indigo", icon: "Zap", days: "T3 Sáng" },
    { name: "Thầy Tân", role: "Bộ môn Hóa Học", subjectVi: "Hóa Học", subjectEn: "Chemistry", room: "Phòng 504", color: "emerald", icon: "FlaskConical", days: "T3, T5" },
    { name: "Thầy Công", role: "Bộ môn Sinh Học", subjectVi: "Sinh Học", subjectEn: "Biology", room: "Phòng 504", color: "green", icon: "Leaf", days: "T6 Sáng" },
    { name: "Thầy Quân", role: "Bộ môn Tin Học", subjectVi: "Tin Học", subjectEn: "Computer Science", room: "Lab Tin", color: "amber", icon: "Laptop", days: "T2 Chiều, T4 Sáng" },
    { name: "Thầy Hải", role: "Bộ môn GDTC", subjectVi: "Giáo Dục Thể Chất", subjectEn: "Physical Education", room: "Sân Thể Thao", color: "orange", icon: "Activity", days: "T5 Sáng" },
    { name: "Mr. Steven", role: "English Faculty", subjectVi: "English (Level 10)", subjectEn: "English (Level 10)", room: "Phòng 504", color: "pink", icon: "Globe", days: "T2, T4 Sáng (Eng 1,2,5,6)" },
    { name: "Ms. Phương Anh", role: "English Faculty", subjectVi: "English (Level 10)", subjectEn: "English (Level 10)", room: "Phòng 504", color: "pink", icon: "Globe", days: "T3, T5, T6 Sáng (Eng 3,4,7,8,9,10)" },
    { name: "Ms. Hạnh", role: "Science Faculty", subjectVi: "Science", subjectEn: "Integrated Science", room: "Phòng 504", color: "teal", icon: "Microscope", days: "T4 Chiều" }
  ]
};

export const SUBJECT_METADATA: Record<SubjectType, {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  labelVi: string;
  labelEn: string;
}> = {
  math: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-blue-200/70 dark:border-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-500 text-white dark:bg-blue-600 dark:text-white",
    badgeText: "text-blue-700 dark:text-blue-300",
    iconName: "Calculator",
    labelVi: "Toán",
    labelEn: "Math"
  },
  english: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-pink-200/70 dark:border-pink-900/50",
    text: "text-pink-600 dark:text-pink-400",
    badgeBg: "bg-pink-500 text-white dark:bg-pink-600 dark:text-white",
    badgeText: "text-pink-700 dark:text-pink-300",
    iconName: "Globe",
    labelVi: "English (Level 10)",
    labelEn: "English (Level 10)"
  },
  literature: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-rose-200/70 dark:border-rose-900/50",
    text: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-500 text-white dark:bg-rose-600 dark:text-white",
    badgeText: "text-rose-700 dark:text-rose-300",
    iconName: "BookOpen",
    labelVi: "Ngữ Văn",
    labelEn: "Literature"
  },
  physics: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-indigo-200/70 dark:border-indigo-900/50",
    text: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-500 text-white dark:bg-indigo-600 dark:text-white",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    iconName: "Zap",
    labelVi: "Vật Lý",
    labelEn: "Physics"
  },
  chemistry: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-emerald-200/70 dark:border-emerald-900/50",
    text: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    iconName: "FlaskConical",
    labelVi: "Hóa Học",
    labelEn: "Chemistry"
  },
  biology: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-green-200/70 dark:border-green-900/50",
    text: "text-green-600 dark:text-green-400",
    badgeBg: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
    badgeText: "text-green-700 dark:text-green-300",
    iconName: "Leaf",
    labelVi: "Sinh Học",
    labelEn: "Biology"
  },
  cs: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-amber-200/70 dark:border-amber-900/50",
    text: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500 text-white dark:bg-amber-600 dark:text-white",
    badgeText: "text-amber-700 dark:text-amber-300",
    iconName: "Laptop",
    labelVi: "Tin Học",
    labelEn: "Computer Science"
  },
  science: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-teal-200/70 dark:border-teal-900/50",
    text: "text-teal-600 dark:text-teal-400",
    badgeBg: "bg-teal-500 text-white dark:bg-teal-600 dark:text-white",
    badgeText: "text-teal-700 dark:text-teal-300",
    iconName: "Microscope",
    labelVi: "Science",
    labelEn: "Science"
  },
  pe: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-orange-200/70 dark:border-orange-900/50",
    text: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-500 text-white dark:bg-orange-600 dark:text-white",
    badgeText: "text-orange-700 dark:text-orange-300",
    iconName: "Activity",
    labelVi: "GDTC",
    labelEn: "P.E"
  },
  homeroom: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-purple-200/70 dark:border-purple-900/50",
    text: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-500 text-white dark:bg-purple-600 dark:text-white",
    badgeText: "text-purple-700 dark:text-purple-300",
    iconName: "HeartHandshake",
    labelVi: "Sinh Hoạt Lớp",
    labelEn: "Homeroom"
  },
  event: {
    bg: "bg-white/90 dark:bg-slate-900/90",
    border: "border-fuchsia-200/70 dark:border-fuchsia-900/50",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    badgeBg: "bg-fuchsia-500 text-white dark:bg-fuchsia-600 dark:text-white",
    badgeText: "text-fuchsia-700 dark:text-fuchsia-300",
    iconName: "Sparkles",
    labelVi: "Sự Kiện",
    labelEn: "Event"
  },
  break: {
    bg: "bg-slate-50/80 dark:bg-slate-900/40",
    border: "border-dashed border-slate-200 dark:border-slate-800",
    text: "text-slate-500 dark:text-slate-400",
    badgeBg: "bg-slate-200 dark:bg-slate-800",
    badgeText: "text-slate-600 dark:text-slate-400",
    iconName: "Coffee",
    labelVi: "Ra Chơi",
    labelEn: "Recess"
  }
};
