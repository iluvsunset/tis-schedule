import { ScheduleData } from '../types/schedule';

export const SCHEDULE_DATA: ScheduleData = {
  "grade": "11-tn",
  "gradeTitleVi": "Lớp 11.1-TN",
  "gradeTitleEn": "Grade 11.1-TN",
  "room": "504",
  "roomNameVi": "Phòng 504",
  "roomNameEn": "Room 504",
  "floorVi": "Tầng 5",
  "floorEn": "Floor 5",
  "homeroomTeacher": {
    "name": "Cô Tiềng",
    "titleVi": "Giáo Viên Chủ Nhiệm (GVQN)",
    "titleEn": "Homeroom Teacher",
    "subject": "Sinh Hoạt Lớp"
  },
  "weekSchedule": [
    {
      "dayKey": "mon",
      "dayNameVi": "Thứ Hai",
      "dayNameEn": "Monday",
      "date": "5/10/2026",
      "morning": [
        {
          "period": 1,
          "time": "07:40 - 08:25",
          "startTime": "07:40",
          "endTime": "08:25",
          "subjectVi": "Sinh Hoạt Đầu Tuần (Good Morning)",
          "subjectEn": "Morning Assembly (Good Morning)",
          "teacher": "Toàn Trường",
          "type": "homeroom",
          "room": "504",
          "note": "HĐTN: GOOD MORNING",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Sinh Học",
          "subjectEn": "Biology",
          "teacher": "Thầy/Cô CÔNG",
          "type": "biology",
          "room": "504",
          "note": "SINH-CÔNG",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "09:15 - 09:30",
          "startTime": "09:15",
          "endTime": "09:30",
          "subjectVi": "Ra chơi sáng",
          "subjectEn": "Morning Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "09:30 - 10:15",
          "startTime": "09:30",
          "endTime": "10:15",
          "subjectVi": "Khoa Học Tiếng Anh (Science)",
          "subjectEn": "Science in English",
          "teacher": "Ms. Hải Lý & Ms. Thư",
          "type": "science",
          "room": "504",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Thư",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 1 • Ms. P Anh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 2 • Ms. P Anh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ],
      "lunch": {
        "time": "11:30 - 13:30",
        "startTime": "11:30",
        "endTime": "13:30",
        "titleVi": "Nghỉ trưa & Dùng bữa",
        "titleEn": "Lunch Break & Rest"
      },
      "afternoon": [
        {
          "period": 1,
          "time": "13:30 - 14:15",
          "startTime": "13:30",
          "endTime": "14:15",
          "subjectVi": "Vật Lý",
          "subjectEn": "Physics",
          "teacher": "Thầy/Cô THUẬN",
          "type": "physics",
          "room": "504",
          "note": "LÝ-THUẬN",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Tin Học",
          "subjectEn": "Computer Science",
          "teacher": "Thầy/Cô QUÂN",
          "type": "cs",
          "room": "504",
          "note": "TIN-QUÂN",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "15:05 - 15:20",
          "startTime": "15:05",
          "endTime": "15:20",
          "subjectVi": "Ra chơi chiều",
          "subjectEn": "Afternoon Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "15:20 - 16:05",
          "startTime": "15:20",
          "endTime": "16:05",
          "subjectVi": "Toán Học",
          "subjectEn": "Mathematics",
          "teacher": "Thầy/Cô THÀNH",
          "type": "math",
          "room": "504",
          "note": "TOÁN-THÀNH",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ]
    },
    {
      "dayKey": "tue",
      "dayNameVi": "Thứ Ba",
      "dayNameEn": "Tuesday",
      "date": "6/10/2026",
      "morning": [
        {
          "period": 1,
          "time": "07:40 - 08:25",
          "startTime": "07:40",
          "endTime": "08:25",
          "subjectVi": "Khoa Học Tiếng Anh (Science)",
          "subjectEn": "Science in English",
          "teacher": "Ms. Hải Lý & Ms. Hân",
          "type": "science",
          "room": "504",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Hân",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Toán Học",
          "subjectEn": "Mathematics",
          "teacher": "Thầy/Cô THÀNH",
          "type": "math",
          "room": "504",
          "note": "TOÁN-THÀNH",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "09:15 - 09:30",
          "startTime": "09:15",
          "endTime": "09:30",
          "subjectVi": "Ra chơi sáng",
          "subjectEn": "Morning Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "09:30 - 10:15",
          "startTime": "09:30",
          "endTime": "10:15",
          "subjectVi": "Giáo Dục Địa Phương",
          "subjectEn": "Local Education",
          "teacher": "Thầy/Cô TUYẾT",
          "type": "activity",
          "room": "504",
          "note": "GDĐP-TUYẾT",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Giáo Dục Thể Chất",
          "subjectEn": "Physical Education",
          "teacher": "Thầy/Cô HẢI",
          "type": "pe",
          "room": "504",
          "note": "GDTC-HẢI",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Giáo Dục Thể Chất",
          "subjectEn": "Physical Education",
          "teacher": "Thầy/Cô HẢI",
          "type": "pe",
          "room": "504",
          "note": "GDTC-HẢI",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ],
      "lunch": {
        "time": "11:30 - 13:30",
        "startTime": "11:30",
        "endTime": "13:30",
        "titleVi": "Nghỉ trưa & Dùng bữa",
        "titleEn": "Lunch Break & Rest"
      },
      "afternoon": [
        {
          "period": 1,
          "time": "13:30 - 14:15",
          "startTime": "13:30",
          "endTime": "14:15",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 3 • Mr. Steven",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 4 • Mr. Steven",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "15:05 - 15:20",
          "startTime": "15:05",
          "endTime": "15:20",
          "subjectVi": "Ra chơi chiều",
          "subjectEn": "Afternoon Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "15:20 - 16:05",
          "startTime": "15:20",
          "endTime": "16:05",
          "subjectVi": "Lịch Sử",
          "subjectEn": "History",
          "teacher": "Thầy/Cô THƯƠNG",
          "type": "humanities",
          "room": "504",
          "note": "SỬ-THƯƠNG",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 4,
          "time": "16:10 - 16:55",
          "startTime": "16:10",
          "endTime": "16:55",
          "subjectVi": "Hoạt Động Trải Nghiệm",
          "subjectEn": "Experiential Activity",
          "teacher": "Thầy/Cô TIỀNG",
          "type": "homeroom",
          "room": "504",
          "note": "HĐTN-TIỀNG",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ]
    },
    {
      "dayKey": "wed",
      "dayNameVi": "Thứ Tư",
      "dayNameEn": "Wednesday",
      "date": "7/10/2026",
      "morning": [
        {
          "period": 1,
          "time": "07:40 - 08:25",
          "startTime": "07:40",
          "endTime": "08:25",
          "subjectVi": "Hóa Học",
          "subjectEn": "Chemistry",
          "teacher": "Thầy/Cô TÂN",
          "type": "chemistry",
          "room": "504",
          "note": "HÓA-TÂN",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Hóa Học",
          "subjectEn": "Chemistry",
          "teacher": "Thầy/Cô TÂN",
          "type": "chemistry",
          "room": "504",
          "note": "HÓA-TÂN",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "09:15 - 09:30",
          "startTime": "09:15",
          "endTime": "09:30",
          "subjectVi": "Ra chơi sáng",
          "subjectEn": "Morning Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "09:30 - 10:15",
          "startTime": "09:30",
          "endTime": "10:15",
          "subjectVi": "Khoa Học Tiếng Anh (Science)",
          "subjectEn": "Science in English",
          "teacher": "Ms. Hải Lý & Ms. Thư",
          "type": "science",
          "room": "504",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Thư",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 5 • Mr. Steven",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 6 • Mr. Steven",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ],
      "lunch": {
        "time": "11:30 - 13:30",
        "startTime": "11:30",
        "endTime": "13:30",
        "titleVi": "Nghỉ trưa & Dùng bữa",
        "titleEn": "Lunch Break & Rest"
      },
      "afternoon": [
        {
          "period": 1,
          "time": "13:30 - 14:15",
          "startTime": "13:30",
          "endTime": "14:15",
          "subjectVi": "Ngữ Văn",
          "subjectEn": "Literature",
          "teacher": "Thầy/Cô CAM",
          "type": "literature",
          "room": "504",
          "note": "VĂN-CAM",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Ngữ Văn",
          "subjectEn": "Literature",
          "teacher": "Thầy/Cô CAM",
          "type": "literature",
          "room": "504",
          "note": "VĂN-CAM",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "15:05 - 15:20",
          "startTime": "15:05",
          "endTime": "15:20",
          "subjectVi": "Ra chơi chiều",
          "subjectEn": "Afternoon Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "15:20 - 16:05",
          "startTime": "15:20",
          "endTime": "16:05",
          "subjectVi": "CĐ HÓA",
          "subjectEn": "CĐ HÓA",
          "teacher": "Thầy/Cô TÂN",
          "type": "activity",
          "room": "504",
          "note": "CĐ HÓA-TÂN",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ]
    },
    {
      "dayKey": "thu",
      "dayNameVi": "Thứ Năm",
      "dayNameEn": "Thursday",
      "date": "8/10/2026",
      "morning": [
        {
          "period": 1,
          "time": "07:40 - 08:25",
          "startTime": "07:40",
          "endTime": "08:25",
          "subjectVi": "Tin Học",
          "subjectEn": "Computer Science",
          "teacher": "Thầy/Cô QUÂN",
          "type": "cs",
          "room": "504",
          "note": "TIN-QUÂN",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "GDQP",
          "subjectEn": "GDQP",
          "teacher": "Thầy/Cô TRUNG",
          "type": "activity",
          "room": "504",
          "note": "GDQP-TRUNG",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "09:15 - 09:30",
          "startTime": "09:15",
          "endTime": "09:30",
          "subjectVi": "Ra chơi sáng",
          "subjectEn": "Morning Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "09:30 - 10:15",
          "startTime": "09:30",
          "endTime": "10:15",
          "subjectVi": "MATH",
          "subjectEn": "MATH",
          "teacher": "Ms. Hải Lý",
          "type": "event",
          "room": "504",
          "note": "MATH • Ms. Hải Lý • Ms. Hạnh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Toán Học",
          "subjectEn": "Mathematics",
          "teacher": "Thầy/Cô THÀNH",
          "type": "math",
          "room": "504",
          "note": "TOÁN-THÀNH",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "CĐ TOÁN",
          "subjectEn": "CĐ TOÁN",
          "teacher": "Thầy/Cô THÀNH",
          "type": "activity",
          "room": "504",
          "note": "CĐ TOÁN-THÀNH",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ],
      "lunch": {
        "time": "11:30 - 13:30",
        "startTime": "11:30",
        "endTime": "13:30",
        "titleVi": "Nghỉ trưa & Dùng bữa",
        "titleEn": "Lunch Break & Rest"
      },
      "afternoon": [
        {
          "period": 1,
          "time": "13:30 - 14:15",
          "startTime": "13:30",
          "endTime": "14:15",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 7 • Ms. P Anh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 8 • Ms. P Anh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "15:05 - 15:20",
          "startTime": "15:05",
          "endTime": "15:20",
          "subjectVi": "Ra chơi chiều",
          "subjectEn": "Afternoon Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "15:20 - 16:05",
          "startTime": "15:20",
          "endTime": "16:05",
          "subjectVi": "Hoạt Động Trải Nghiệm",
          "subjectEn": "Experiential Activity",
          "teacher": "Thầy/Cô TIỀNG",
          "type": "homeroom",
          "room": "504",
          "note": "HĐTN-TIỀNG",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ]
    },
    {
      "dayKey": "fri",
      "dayNameVi": "Thứ Sáu",
      "dayNameEn": "Friday",
      "date": "9/10/2026",
      "morning": [
        {
          "period": 1,
          "time": "07:40 - 08:25",
          "startTime": "07:40",
          "endTime": "08:25",
          "subjectVi": "MATH",
          "subjectEn": "MATH",
          "teacher": "Ms. Hải Lý",
          "type": "event",
          "room": "504",
          "note": "MATH • Ms. Hải Lý • Mr. Hoàng Anh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Vật Lý",
          "subjectEn": "Physics",
          "teacher": "Thầy/Cô THUẬN",
          "type": "physics",
          "room": "504",
          "note": "LÝ-THUẬN",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "09:15 - 09:30",
          "startTime": "09:15",
          "endTime": "09:30",
          "subjectVi": "Ra chơi sáng",
          "subjectEn": "Morning Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "09:30 - 10:15",
          "startTime": "09:30",
          "endTime": "10:15",
          "subjectVi": "Sinh Học",
          "subjectEn": "Biology",
          "teacher": "Thầy/Cô CÔNG",
          "type": "biology",
          "room": "504",
          "note": "SINH-CÔNG",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 9 • Ms. P Anh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Tiếng Anh (Level 10 - R504)",
          "subjectEn": "English (Level 10 - R504)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 10 • Ms. P Anh",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ],
      "lunch": {
        "time": "11:30 - 13:30",
        "startTime": "11:30",
        "endTime": "13:30",
        "titleVi": "Nghỉ trưa & Dùng bữa",
        "titleEn": "Lunch Break & Rest"
      },
      "afternoon": [
        {
          "period": 1,
          "time": "13:30 - 14:15",
          "startTime": "13:30",
          "endTime": "14:15",
          "subjectVi": "Ngữ Văn",
          "subjectEn": "Literature",
          "teacher": "Thầy/Cô CAM",
          "type": "literature",
          "room": "504",
          "note": "VĂN-CAM",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "CĐ VĂN",
          "subjectEn": "CĐ VĂN",
          "teacher": "Thầy/Cô CAM",
          "type": "activity",
          "room": "504",
          "note": "CĐ VĂN-CAM",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        },
        {
          "period": "recess",
          "time": "15:05 - 15:20",
          "startTime": "15:05",
          "endTime": "15:20",
          "subjectVi": "Ra chơi chiều",
          "subjectEn": "Afternoon Recess",
          "teacher": "",
          "type": "break",
          "room": "",
          "note": "15 phút giải lao"
        },
        {
          "period": 3,
          "time": "15:20 - 16:05",
          "startTime": "15:20",
          "endTime": "16:05",
          "subjectVi": "Lịch Sử",
          "subjectEn": "History",
          "teacher": "Thầy/Cô THƯƠNG",
          "type": "humanities",
          "room": "504",
          "note": "SỬ-THƯƠNG",
          "classNameVi": "Lớp 11.1-TN",
          "classNameEn": "Grade 11.1-TN"
        }
      ]
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

export function getFallbackRoomSchedule(roomId: string = '504'): ScheduleData | null {
  const cleanId = roomId.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  const classToRoomFallback: Record<string, string> = {
    '6': '501',
    '7': '502',
    '8': '4010',
    '9': '4011',
    '10-tn': '4012',
    '10.1-tn': '4012',
    '10-nt': '307',
    '10.2-nt': '307',
    '11-tn': '504',
    '11.1-tn': '504',
    '11.2-xh': 'P. Tâm lý học đường',
    '11.2-tn': 'P. Tâm lý học đường',
    '12-tn': '503'
  };

  const resolvedRoomId = classToRoomFallback[cleanId.toLowerCase()] || cleanId;
  const roomMeta: Record<string, { floorVi: string; floorEn: string; classVi: string; classEn: string; teacher: string }> = {
    '504': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 11.1-TN', classEn: 'Grade 11.1-TN', teacher: 'Cô Tiềng' },
    'P. Tâm lý học đường': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 11.2-TN & XH', classEn: 'Grade 11.2-TN & XH', teacher: 'Cô Tiềng' },
    'p. tâm lý học đường': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 11.2-TN & XH', classEn: 'Grade 11.2-TN & XH', teacher: 'Cô Tiềng' },
    'tâm lý học đường': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 11.2-TN & XH', classEn: 'Grade 11.2-TN & XH', teacher: 'Cô Tiềng' },
    'tam-ly': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 11.2-TN & XH', classEn: 'Grade 11.2-TN & XH', teacher: 'Cô Tiềng' },
    '4012': { floorVi: 'Tầng 4', floorEn: 'Floor 4', classVi: 'Lớp 10.1-TN', classEn: 'Grade 10.1-TN', teacher: 'Cô Đặng' },
    '307': { floorVi: 'Tầng 3', floorEn: 'Floor 3', classVi: 'Lớp 10.2-TN & NT', classEn: 'Grade 10.2-TN & NT', teacher: 'Cô Đặng' },
    '4010': { floorVi: 'Tầng 4', floorEn: 'Floor 4', classVi: 'Lớp 8', classEn: 'Grade 8', teacher: 'Cô Thuận' },
    '4011': { floorVi: 'Tầng 4', floorEn: 'Floor 4', classVi: 'Lớp 9', classEn: 'Grade 9', teacher: 'Thầy Quân' },
    '503': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 12-TN', classEn: 'Grade 12-TN', teacher: 'Thầy Kiên' },
    '502': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 7', classEn: 'Grade 7', teacher: 'Cô Thảo' },
    '501': { floorVi: 'Tầng 5', floorEn: 'Floor 5', classVi: 'Lớp 6', classEn: 'Grade 6', teacher: 'Cô Uyển Nhi' },
  };

  const meta = roomMeta[resolvedRoomId];
  if (!meta) {
    // Room is not in the recognized roster; do not generate fake schedule
    return null;
  }

  const isPsychology = cleanId.toLowerCase().includes('tâm lý') || cleanId.toLowerCase().includes('tam ly') || cleanId.toLowerCase() === 'tam-ly';
  const displayRoomId = isPsychology ? 'P. Tâm lý học đường' : cleanId;
  const roomNameVi = isPsychology ? 'P. Tâm lý học đường' : `Phòng ${cleanId}`;
  const roomNameEn = isPsychology ? 'School Psychology Office' : `Room ${cleanId}`;

  return {
    ...SCHEDULE_DATA,
    roomId: displayRoomId,
    room: displayRoomId,
    roomNameVi,
    roomNameEn,
    floorVi: meta.floorVi,
    floorEn: meta.floorEn,
    gradeTitleVi: meta.classVi,
    gradeTitleEn: meta.classEn,
    homeroomTeacher: {
      ...SCHEDULE_DATA.homeroomTeacher,
      name: meta.teacher
    },
    weekSchedule: SCHEDULE_DATA.weekSchedule.map(day => ({
      ...day,
      morning: day.morning.map(item => ({
        ...item,
        room: cleanId,
        classNameVi: meta.classVi,
        classNameEn: meta.classEn
      })),
      afternoon: day.afternoon.map(item => ({
        ...item,
        room: cleanId,
        classNameVi: meta.classVi,
        classNameEn: meta.classEn
      }))
    }))
  };
}
