import { ScheduleData, SubjectType } from '../types/schedule';

export const SCHEDULE_DATA: ScheduleData = {
  grade: "11-TN",
  gradeTitleVi: "Lớp 11-TN",
  gradeTitleEn: "Grade 11-TN",
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
      date: "31/8/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        }
      ]
    },
    {
      dayKey: "tue",
      dayNameVi: "Thứ Ba",
      dayNameEn: "Tuesday",
      date: "1/9/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        }
      ]
    },
    {
      dayKey: "wed",
      dayNameVi: "Thứ Tư",
      dayNameEn: "Wednesday",
      date: "2/9/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 08:45",
          startTime: "08:00",
          endTime: "08:45",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 2,
          time: "08:50 - 09:35",
          startTime: "08:50",
          endTime: "09:35",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 4,
          time: "10:45 - 11:30",
          startTime: "10:45",
          endTime: "11:30",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        },
        {
          period: 2,
          time: "14:20 - 15:05",
          startTime: "14:20",
          endTime: "15:05",
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
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
          subjectVi: "Nghỉ Lễ 2/9",
          subjectEn: "National Day Holiday",
          teacher: "Nghỉ toàn trường",
          type: "event",
          room: "TIS",
          note: "Nghỉ Lễ Quốc Khánh 2/9"
        }
      ]
    },
    {
      dayKey: "thu",
      dayNameVi: "Thứ Năm",
      dayNameEn: "Thursday",
      date: "3/9/2026",
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
          teacher: "Mr. Steven",
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
          teacher: "Mr. Steven",
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
          subjectVi: "Ngữ Văn",
          subjectEn: "Vietnamese Literature",
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
          subjectEn: "Vietnamese Literature",
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
      dayKey: "fri",
      dayNameVi: "Thứ Sáu",
      dayNameEn: "Friday",
      date: "4/9/2026",
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
          subjectVi: "Vật Lý",
          subjectEn: "Physics",
          teacher: "Cô Thuận",
          type: "physics",
          room: "504",
          note: "LÝ-THUẬN"
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
          subjectVi: "Rehearsal Lễ Khai Giảng",
          subjectEn: "Opening Ceremony Rehearsal",
          teacher: "Toàn Trường (School Rehearsal)",
          type: "event",
          room: "Hội trường",
          note: "Rehearsal Lễ Khai Giảng Năm Học 2026-2027"
        }
      ]
    },
    {
      dayKey: "sat",
      dayNameVi: "Thứ Bảy",
      dayNameEn: "Saturday",
      date: "5/9/2026",
      morning: [
        {
          period: 1,
          time: "08:00 - 11:30",
          startTime: "08:00",
          endTime: "11:30",
          subjectVi: "Lễ Khai Giảng Năm Học 2026 - 2027",
          subjectEn: "School Year Opening Ceremony",
          teacher: "Toàn Trường (All School)",
          type: "event",
          room: "Hội trường / Sân trường",
          note: "LỄ KHAI GIẢNG NĂM HỌC 2026 - 2027"
        }
      ],
      lunch: {
        time: "11:30 - 13:30",
        startTime: "11:30",
        endTime: "13:30",
        titleVi: "Nghỉ trưa & Dùng bữa",
        titleEn: "Lunch Break & Rest"
      },
      afternoon: []
    }
  ],
  teachers: [
    {
      name: "Cô Tiềng",
      role: "Giáo Viên Chủ Nhiệm (GVQN)",
      subjectVi: "Sinh Hoạt Lớp (SHL)",
      subjectEn: "Homeroom & Class Activity",
      room: "504",
      color: "from-pink-500 to-rose-500"
    },
    {
      name: "Thầy Thành",
      role: "Giáo Viên Bộ Môn",
      subjectVi: "Toán (Math)",
      subjectEn: "Mathematics",
      room: "504",
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Mr. Steven",
      role: "Foreign Teacher",
      subjectVi: "English (Level 10 - Eng 7, 8)",
      subjectEn: "English (Level 10 - Eng 7, 8)",
      room: "504",
      color: "from-purple-500 to-indigo-500"
    },
    {
      name: "Ms. Phương Anh",
      role: "Foreign & ESL Teacher",
      subjectVi: "English (Level 10 - Eng 9, 10)",
      subjectEn: "English (Level 10 - Eng 9, 10)",
      room: "504",
      color: "from-pink-500 to-rose-400"
    },
    {
      name: "Cô Cam",
      role: "Giáo Viên Bộ Môn",
      subjectVi: "Ngữ Văn",
      subjectEn: "Vietnamese Literature",
      room: "504",
      color: "from-rose-500 to-red-600"
    },
    {
      name: "Thầy Tân",
      role: "Giáo Viên Bộ Môn",
      subjectVi: "Hóa Học",
      subjectEn: "Chemistry",
      room: "504",
      color: "from-emerald-500 to-teal-600"
    },
    {
      name: "Thầy Công",
      role: "Giáo Viên Bộ Môn",
      subjectVi: "Sinh Học",
      subjectEn: "Biology",
      room: "504",
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Thầy Quân",
      role: "Giáo Viên Bộ Môn",
      subjectVi: "Tin Học",
      subjectEn: "Computer Science",
      room: "Lab Tin",
      color: "from-amber-500 to-orange-500"
    },
    {
      name: "Cô Thuận",
      role: "Giáo Viên Bộ Môn",
      subjectVi: "Vật Lý",
      subjectEn: "Physics",
      room: "504",
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "Thầy Hải",
      role: "Giáo Viên Bộ Môn",
      subjectVi: "Giáo Dục Thể Chất",
      subjectEn: "Physical Education (PE)",
      room: "Sân thể thao",
      color: "from-orange-500 to-amber-600"
    }
  ]
};

export const SUBJECT_METADATA: Record<SubjectType, {
  nameVi: string;
  nameEn: string;
  badgeBg: string;
  bg: string;
  border: string;
  text: string;
  accent: string;
}> = {
  math: {
    nameVi: "Toán",
    nameEn: "Math",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    bg: "bg-blue-500/5 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-900/50",
    text: "text-blue-900 dark:text-blue-200",
    accent: "#3b82f6"
  },
  english: {
    nameVi: "English (Level 10)",
    nameEn: "English (Level 10)",
    badgeBg: "bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    bg: "bg-pink-500/5 dark:bg-pink-500/10",
    border: "border-pink-200 dark:border-pink-900/50",
    text: "text-pink-900 dark:text-pink-200",
    accent: "#ec4899"
  },
  literature: {
    nameVi: "Ngữ Văn",
    nameEn: "Literature",
    badgeBg: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    bg: "bg-rose-500/5 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-900/50",
    text: "text-rose-900 dark:text-rose-200",
    accent: "#f43f5e"
  },
  physics: {
    nameVi: "Vật Lý",
    nameEn: "Physics",
    badgeBg: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
    border: "border-indigo-200 dark:border-indigo-900/50",
    text: "text-indigo-900 dark:text-indigo-200",
    accent: "#6366f1"
  },
  chemistry: {
    nameVi: "Hóa Học",
    nameEn: "Chemistry",
    badgeBg: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-900/50",
    text: "text-emerald-900 dark:text-emerald-200",
    accent: "#10b981"
  },
  biology: {
    nameVi: "Sinh Học",
    nameEn: "Biology",
    badgeBg: "bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    bg: "bg-teal-500/5 dark:bg-teal-500/10",
    border: "border-teal-200 dark:border-teal-900/50",
    text: "text-teal-900 dark:text-teal-200",
    accent: "#14b8a6"
  },
  cs: {
    nameVi: "Tin Học",
    nameEn: "Computer Science",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    bg: "bg-amber-500/5 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-900/50",
    text: "text-amber-900 dark:text-amber-200",
    accent: "#f59e0b"
  },
  science: {
    nameVi: "Science",
    nameEn: "Science",
    badgeBg: "bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
    bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
    border: "border-cyan-200 dark:border-cyan-900/50",
    text: "text-cyan-900 dark:text-cyan-200",
    accent: "#06b6d4"
  },
  pe: {
    nameVi: "Giáo Dục Thể Chất",
    nameEn: "Physical Education",
    badgeBg: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    bg: "bg-orange-500/5 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-900/50",
    text: "text-orange-900 dark:text-orange-200",
    accent: "#f97316"
  },
  homeroom: {
    nameVi: "Sinh Hoạt Lớp",
    nameEn: "Homeroom Activity",
    badgeBg: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    bg: "bg-purple-500/5 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-900/50",
    text: "text-purple-900 dark:text-purple-200",
    accent: "#a855f7"
  },
  event: {
    nameVi: "Sự Kiện Toàn Trường",
    nameEn: "School Event / Activity",
    badgeBg: "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    bg: "bg-rose-500/5 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-900/50",
    text: "text-rose-900 dark:text-rose-200",
    accent: "#f43f5e"
  },
  break: {
    nameVi: "Giờ Ra Chơi",
    nameEn: "Recess Break",
    badgeBg: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 border-slate-200 dark:border-slate-800",
    bg: "bg-slate-500/5 dark:bg-slate-500/10",
    border: "border-slate-200 dark:border-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    accent: "#64748b"
  }
};
