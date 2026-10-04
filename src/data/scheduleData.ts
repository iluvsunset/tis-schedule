import { ScheduleData, SubjectType } from '../types/schedule';

export const SCHEDULE_DATA: ScheduleData = {
  "classId": "11.1-tn",
  "grade": "11.1-TN",
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
          "type": "event",
          "room": "504",
          "note": "HĐTN: GOOD MORNING"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Sinh Học",
          "subjectEn": "Biology",
          "teacher": "Thầy Công",
          "type": "biology",
          "room": "504",
          "note": "SINH-CÔNG"
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
          "subjectEn": "Science",
          "teacher": "Ms. Hải Lý & Ms. Thư",
          "type": "science",
          "room": "504",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Thư"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "English (Eng 1)",
          "subjectEn": "English (Eng 1)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 1 • Ms. P Anh"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "English (Eng 2)",
          "subjectEn": "English (Eng 2)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 2 • Ms. P Anh"
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
          "teacher": "Thầy Thuận",
          "type": "physics",
          "room": "504",
          "note": "LÝ-THUẬN"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Tin Học",
          "subjectEn": "Computer Science",
          "teacher": "Thầy Quân",
          "type": "cs",
          "room": "504",
          "note": "TIN-QUÂN"
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
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "504",
          "note": "TOÁN-THÀNH"
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
          "subjectEn": "Science",
          "teacher": "Ms. Hải Lý & Ms. Hân",
          "type": "science",
          "room": "504",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Hân"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Toán Học",
          "subjectEn": "Mathematics",
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "504",
          "note": "TOÁN-THÀNH"
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
          "teacher": "Cô Tuyết",
          "type": "literature",
          "room": "504",
          "note": "GDĐP-TUYẾT"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Giáo Dục Thể Chất",
          "subjectEn": "Physical Education",
          "teacher": "Thầy Hải",
          "type": "pe",
          "room": "504",
          "note": "GDTC-HẢI"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Giáo Dục Thể Chất",
          "subjectEn": "Physical Education",
          "teacher": "Thầy Hải",
          "type": "pe",
          "room": "504",
          "note": "GDTC-HẢI"
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
          "subjectVi": "English (Eng 3)",
          "subjectEn": "English (Eng 3)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 3 • Mr. Steven"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "English (Eng 4)",
          "subjectEn": "English (Eng 4)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 4 • Mr. Steven"
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
          "teacher": "Cô Thương",
          "type": "literature",
          "room": "504",
          "note": "SỬ-THƯƠNG"
        },
        {
          "period": 4,
          "time": "16:10 - 16:55",
          "startTime": "16:10",
          "endTime": "16:55",
          "subjectVi": "Hoạt Động Trải Nghiệm",
          "subjectEn": "Experiential Activity",
          "teacher": "Cô Tiềng",
          "type": "homeroom",
          "room": "504",
          "note": "HĐTN-TIỀNG • (LMS)"
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
          "teacher": "Thầy Tân",
          "type": "chemistry",
          "room": "504",
          "note": "HÓA-TÂN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Hóa Học",
          "subjectEn": "Chemistry",
          "teacher": "Thầy Tân",
          "type": "chemistry",
          "room": "504",
          "note": "HÓA-TÂN"
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
          "subjectEn": "Science",
          "teacher": "Ms. Hải Lý & Ms. Thư",
          "type": "science",
          "room": "504",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Thư"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "English (Eng 5)",
          "subjectEn": "English (Eng 5)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 5 • Mr. Steven"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "English (Eng 6)",
          "subjectEn": "English (Eng 6)",
          "teacher": "Mr. Steven",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 6 • Mr. Steven"
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
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "504",
          "note": "VĂN-CAM"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Ngữ Văn",
          "subjectEn": "Literature",
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "504",
          "note": "VĂN-CAM"
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
          "subjectVi": "Chuyên Đề Hóa Học",
          "subjectEn": "Advanced Chemistry",
          "teacher": "Thầy Tân",
          "type": "chemistry",
          "room": "504",
          "note": "CĐ HÓA-TÂN"
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
          "teacher": "Thầy Quân",
          "type": "cs",
          "room": "504",
          "note": "TIN-QUÂN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Giáo Dục Quốc Phòng",
          "subjectEn": "National Defense Education",
          "teacher": "Thầy Trung",
          "type": "pe",
          "room": "504",
          "note": "GDQP-TRUNG"
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
          "subjectVi": "Toán Tiếng Anh (Math)",
          "subjectEn": "Mathematics",
          "teacher": "Ms. Hải Lý & Ms. Hạnh",
          "type": "math",
          "room": "504",
          "note": "MATH • Ms. Hải Lý • Ms. Hạnh"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Toán Học",
          "subjectEn": "Mathematics",
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "504",
          "note": "TOÁN-THÀNH"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Chuyên Đề Toán",
          "subjectEn": "Advanced Mathematics",
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "504",
          "note": "CĐ TOÁN-THÀNH"
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
          "subjectVi": "English (Eng 7)",
          "subjectEn": "English (Eng 7)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 7 • Ms. P Anh"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "English (Eng 8)",
          "subjectEn": "English (Eng 8)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 8 • Ms. P Anh"
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
          "teacher": "Cô Tiềng",
          "type": "homeroom",
          "room": "504",
          "note": "HĐTN-TIỀNG"
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
          "subjectVi": "Toán Tiếng Anh (Math)",
          "subjectEn": "Mathematics",
          "teacher": "Ms. Hải Lý & Mr. Hoàng Anh",
          "type": "math",
          "room": "504",
          "note": "MATH • Ms. Hải Lý • Mr. Hoàng Anh"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Vật Lý",
          "subjectEn": "Physics",
          "teacher": "Thầy Thuận",
          "type": "physics",
          "room": "504",
          "note": "LÝ-THUẬN"
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
          "teacher": "Thầy Công",
          "type": "biology",
          "room": "504",
          "note": "SINH-CÔNG"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "English (Eng 9)",
          "subjectEn": "English (Eng 9)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 9 • Ms. P Anh"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "English (Eng 10)",
          "subjectEn": "English (Eng 10)",
          "teacher": "Ms. P Anh",
          "type": "english",
          "room": "504",
          "note": "Level 10 - R504 • Eng 10 • Ms. P Anh"
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
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "504",
          "note": "VĂN-CAM"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Chuyên Đề Ngữ Văn",
          "subjectEn": "Advanced Literature",
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "504",
          "note": "CĐ VĂN-CAM"
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
          "teacher": "Cô Thương",
          "type": "literature",
          "room": "504",
          "note": "SỬ-THƯƠNG • (LMS-TIỀNG)"
        }
      ]
    }
  ],
  "teachers": [
    {
      "name": "Cô Tiềng",
      "role": "Giáo Viên Chủ Nhiệm (GVQN)",
      "subjectVi": "Sinh Hoạt Lớp (SHL) & GDKTPL",
      "subjectEn": "Homeroom & Economic/Legal",
      "room": "504",
      "color": "from-pink-500 to-rose-500"
    },
    {
      "name": "Thầy Thành",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Toán & CĐ Toán",
      "subjectEn": "Mathematics",
      "room": "504",
      "color": "from-blue-500 to-indigo-600"
    },
    {
      "name": "Cô Cam",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Ngữ Văn & CĐ Văn",
      "subjectEn": "Vietnamese Literature",
      "room": "504",
      "color": "from-rose-500 to-red-600"
    },
    {
      "name": "Thầy Tân",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Hóa Học & CĐ Hóa",
      "subjectEn": "Chemistry",
      "room": "504",
      "color": "from-emerald-500 to-teal-600"
    },
    {
      "name": "Thầy Thuận",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Vật Lý",
      "subjectEn": "Physics",
      "room": "504",
      "color": "from-indigo-500 to-purple-600"
    },
    {
      "name": "Thầy Công",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Sinh Học",
      "subjectEn": "Biology",
      "room": "504",
      "color": "from-green-500 to-emerald-600"
    },
    {
      "name": "Thầy Quân",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Tin Học",
      "subjectEn": "Computer Science",
      "room": "Lab Tin",
      "color": "from-amber-500 to-orange-500"
    },
    {
      "name": "Thầy Hải",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Giáo Dục Thể Chất",
      "subjectEn": "Physical Education (PE)",
      "room": "Sân thể thao",
      "color": "from-orange-500 to-amber-600"
    },
    {
      "name": "Thầy Trung",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Giáo Dục Quốc Phòng",
      "subjectEn": "National Defense Education",
      "room": "Sân trường",
      "color": "from-teal-500 to-cyan-600"
    },
    {
      "name": "Cô Thương",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Lịch Sử",
      "subjectEn": "History",
      "room": "504",
      "color": "from-amber-600 to-yellow-600"
    },
    {
      "name": "Cô Tuyết",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Giáo Dục Địa Phương",
      "subjectEn": "Local Education",
      "room": "504",
      "color": "from-lime-500 to-emerald-600"
    },
    {
      "name": "Ms. Hải Lý",
      "role": "Giáo Viên Tiếng Anh Bộ Môn",
      "subjectVi": "Khoa Học Tiếng Anh & Toán Tiếng Anh",
      "subjectEn": "Science & English Math",
      "room": "504",
      "color": "from-cyan-500 to-blue-500"
    },
    {
      "name": "Mr. Steven",
      "role": "Foreign Teacher",
      "subjectVi": "English (Eng 3, 4, 5, 6)",
      "subjectEn": "English (Level 10)",
      "room": "504",
      "color": "from-purple-500 to-indigo-500"
    },
    {
      "name": "Ms. Phương Anh",
      "role": "ESL Teacher",
      "subjectVi": "English (Eng 1, 2, 7, 8, 9, 10)",
      "subjectEn": "English (Level 10)",
      "room": "504",
      "color": "from-pink-500 to-rose-400"
    }
  ]
};

export const SCHEDULE_DATA_11_2: ScheduleData = {
  "classId": "11.2-xh",
  "grade": "11.2-TN & XH",
  "gradeTitleVi": "Lớp 11.2-TN & XH",
  "gradeTitleEn": "Grade 11.2-TN & XH",
  "room": "P. Tâm lý học đường",
  "roomId": "P. Tâm lý học đường",
  "roomNameVi": "P. Tâm lý học đường",
  "roomNameEn": "School Psychology Office",
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
          "type": "event",
          "room": "P. Tâm lý học đường",
          "note": "HĐTN: GOOD MORNING"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Sinh Học",
          "subjectEn": "Biology",
          "teacher": "Thầy Công",
          "type": "biology",
          "room": "P. Tâm lý học đường",
          "note": "SINH-CÔNG"
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
          "subjectEn": "Science",
          "teacher": "Ms. Hải Lý & Ms. Thư",
          "type": "science",
          "room": "P. Tâm lý học đường",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Thư"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
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
          "subjectVi": "Kinh Tế & Pháp Luật",
          "subjectEn": "Economic & Legal Education",
          "teacher": "Cô Tiềng",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "GDKTPL-TIỀNG"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Tin Học",
          "subjectEn": "Computer Science",
          "teacher": "Thầy Quân",
          "type": "cs",
          "room": "P. Tâm lý học đường",
          "note": "TIN-QUÂN"
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
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "P. Tâm lý học đường",
          "note": "TOÁN-THÀNH"
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
          "subjectEn": "Science",
          "teacher": "Ms. Hải Lý & Ms. Hân",
          "type": "science",
          "room": "P. Tâm lý học đường",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Hân"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Toán Học",
          "subjectEn": "Mathematics",
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "P. Tâm lý học đường",
          "note": "TOÁN-THÀNH"
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
          "teacher": "Cô Tuyết",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "GDĐP-TUYẾT"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Giáo Dục Thể Chất",
          "subjectEn": "Physical Education",
          "teacher": "Thầy Hải",
          "type": "pe",
          "room": "P. Tâm lý học đường",
          "note": "GDTC-HẢI"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Giáo Dục Thể Chất",
          "subjectEn": "Physical Education",
          "teacher": "Thầy Hải",
          "type": "pe",
          "room": "P. Tâm lý học đường",
          "note": "GDTC-HẢI"
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
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
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
          "teacher": "Cô Thương",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "SỬ-THƯƠNG"
        },
        {
          "period": 4,
          "time": "16:10 - 16:55",
          "startTime": "16:10",
          "endTime": "16:55",
          "subjectVi": "Hoạt Động Trải Nghiệm",
          "subjectEn": "Experiential Activity",
          "teacher": "Cô Tiềng",
          "type": "homeroom",
          "room": "P. Tâm lý học đường",
          "note": "HĐTN-TIỀNG • (LMS)"
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
          "teacher": "Thầy Tân",
          "type": "chemistry",
          "room": "P. Tâm lý học đường",
          "note": "HÓA-TÂN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Hóa Học",
          "subjectEn": "Chemistry",
          "teacher": "Thầy Tân",
          "type": "chemistry",
          "room": "P. Tâm lý học đường",
          "note": "HÓA-TÂN"
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
          "subjectEn": "Science",
          "teacher": "Ms. Hải Lý & Ms. Thư",
          "type": "science",
          "room": "P. Tâm lý học đường",
          "note": "SCIENCE • Ms. Hải Lý • Ms. Thư"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
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
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "VĂN-CAM"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Ngữ Văn",
          "subjectEn": "Literature",
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "VĂN-CAM"
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
          "subjectVi": "Chuyên Đề Hóa Học",
          "subjectEn": "Advanced Chemistry",
          "teacher": "Thầy Tân",
          "type": "chemistry",
          "room": "P. Tâm lý học đường",
          "note": "CĐ HÓA-TÂN"
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
          "teacher": "Thầy Quân",
          "type": "cs",
          "room": "P. Tâm lý học đường",
          "note": "TIN-QUÂN"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Giáo Dục Quốc Phòng",
          "subjectEn": "National Defense Education",
          "teacher": "Thầy Trung",
          "type": "pe",
          "room": "P. Tâm lý học đường",
          "note": "GDQP-TRUNG"
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
          "subjectVi": "Toán Tiếng Anh (Math)",
          "subjectEn": "Mathematics",
          "teacher": "Ms. Hải Lý & Ms. Hạnh",
          "type": "math",
          "room": "P. Tâm lý học đường",
          "note": "MATH • Ms. Hải Lý • Ms. Hạnh"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "Toán Học",
          "subjectEn": "Mathematics",
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "P. Tâm lý học đường",
          "note": "TOÁN-THÀNH"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "Chuyên Đề Toán",
          "subjectEn": "Advanced Mathematics",
          "teacher": "Thầy Thành",
          "type": "math",
          "room": "P. Tâm lý học đường",
          "note": "CĐ TOÁN-THÀNH"
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
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
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
          "teacher": "Cô Tiềng",
          "type": "homeroom",
          "room": "P. Tâm lý học đường",
          "note": "HĐTN-TIỀNG"
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
          "subjectVi": "Toán Tiếng Anh (Math)",
          "subjectEn": "Mathematics",
          "teacher": "Ms. Hải Lý & Mr. Hoàng Anh",
          "type": "math",
          "room": "P. Tâm lý học đường",
          "note": "MATH • Ms. Hải Lý • Mr. Hoàng Anh"
        },
        {
          "period": 2,
          "time": "08:30 - 09:15",
          "startTime": "08:30",
          "endTime": "09:15",
          "subjectVi": "Kinh Tế & Pháp Luật",
          "subjectEn": "Economic & Legal Education",
          "teacher": "Cô Tiềng",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "GDKTPL-TIỀNG"
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
          "teacher": "Thầy Công",
          "type": "biology",
          "room": "P. Tâm lý học đường",
          "note": "SINH-CÔNG"
        },
        {
          "period": 4,
          "time": "10:20 - 11:05",
          "startTime": "10:20",
          "endTime": "11:05",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
        },
        {
          "period": 5,
          "time": "11:10 - 11:55",
          "startTime": "11:10",
          "endTime": "11:55",
          "subjectVi": "English (Eng)",
          "subjectEn": "English (Eng)",
          "teacher": "GV Bản Ngữ / Việt Nam",
          "type": "english",
          "room": "P. Tâm lý học đường",
          "note": "Eng"
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
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "VĂN-CAM"
        },
        {
          "period": 2,
          "time": "14:20 - 15:05",
          "startTime": "14:20",
          "endTime": "15:05",
          "subjectVi": "Chuyên Đề Ngữ Văn",
          "subjectEn": "Advanced Literature",
          "teacher": "Cô Cam",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "CĐ VĂN-CAM"
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
          "teacher": "Cô Thương",
          "type": "literature",
          "room": "P. Tâm lý học đường",
          "note": "SỬ-THƯƠNG • (LMS-TIỀNG)"
        }
      ]
    }
  ],
  "teachers": [
    {
      "name": "Cô Tiềng",
      "role": "Giáo Viên Chủ Nhiệm (GVQN)",
      "subjectVi": "Sinh Hoạt Lớp (SHL) & GDKTPL",
      "subjectEn": "Homeroom & Economic/Legal",
      "room": "504",
      "color": "from-pink-500 to-rose-500"
    },
    {
      "name": "Thầy Thành",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Toán & CĐ Toán",
      "subjectEn": "Mathematics",
      "room": "504",
      "color": "from-blue-500 to-indigo-600"
    },
    {
      "name": "Cô Cam",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Ngữ Văn & CĐ Văn",
      "subjectEn": "Vietnamese Literature",
      "room": "504",
      "color": "from-rose-500 to-red-600"
    },
    {
      "name": "Thầy Tân",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Hóa Học & CĐ Hóa",
      "subjectEn": "Chemistry",
      "room": "504",
      "color": "from-emerald-500 to-teal-600"
    },
    {
      "name": "Thầy Thuận",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Vật Lý",
      "subjectEn": "Physics",
      "room": "504",
      "color": "from-indigo-500 to-purple-600"
    },
    {
      "name": "Thầy Công",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Sinh Học",
      "subjectEn": "Biology",
      "room": "504",
      "color": "from-green-500 to-emerald-600"
    },
    {
      "name": "Thầy Quân",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Tin Học",
      "subjectEn": "Computer Science",
      "room": "Lab Tin",
      "color": "from-amber-500 to-orange-500"
    },
    {
      "name": "Thầy Hải",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Giáo Dục Thể Chất",
      "subjectEn": "Physical Education (PE)",
      "room": "Sân thể thao",
      "color": "from-orange-500 to-amber-600"
    },
    {
      "name": "Thầy Trung",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Giáo Dục Quốc Phòng",
      "subjectEn": "National Defense Education",
      "room": "Sân trường",
      "color": "from-teal-500 to-cyan-600"
    },
    {
      "name": "Cô Thương",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Lịch Sử",
      "subjectEn": "History",
      "room": "504",
      "color": "from-amber-600 to-yellow-600"
    },
    {
      "name": "Cô Tuyết",
      "role": "Giáo Viên Bộ Môn",
      "subjectVi": "Giáo Dục Địa Phương",
      "subjectEn": "Local Education",
      "room": "504",
      "color": "from-lime-500 to-emerald-600"
    },
    {
      "name": "Ms. Hải Lý",
      "role": "Giáo Viên Tiếng Anh Bộ Môn",
      "subjectVi": "Khoa Học Tiếng Anh & Toán Tiếng Anh",
      "subjectEn": "Science & English Math",
      "room": "504",
      "color": "from-cyan-500 to-blue-500"
    },
    {
      "name": "Mr. Steven",
      "role": "Foreign Teacher",
      "subjectVi": "English (Eng 3, 4, 5, 6)",
      "subjectEn": "English (Level 10)",
      "room": "504",
      "color": "from-purple-500 to-indigo-500"
    },
    {
      "name": "Ms. Phương Anh",
      "role": "ESL Teacher",
      "subjectVi": "English (Eng 1, 2, 7, 8, 9, 10)",
      "subjectEn": "English (Level 10)",
      "room": "504",
      "color": "from-pink-500 to-rose-400"
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
    nameVi: "Tiếng Anh",
    nameEn: "English",
    badgeBg: "bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border-pink-200 dark:border-pink-800",
    bg: "bg-pink-500/5 dark:bg-pink-500/10",
    border: "border-pink-200 dark:border-pink-900/50",
    text: "text-pink-900 dark:text-pink-200",
    accent: "#ec4899"
  },
  literature: {
    nameVi: "Ngữ Văn & XH",
    nameEn: "Literature & Social Studies",
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
    nameVi: "Thể Chất & Quốc Phòng",
    nameEn: "PE & Defense",
    badgeBg: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    bg: "bg-orange-500/5 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-900/50",
    text: "text-orange-900 dark:text-orange-200",
    accent: "#f97316"
  },
  homeroom: {
    nameVi: "Sinh Hoạt Lớp / HĐTN",
    nameEn: "Homeroom & Activity",
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

export function getFallbackRoomSchedule(roomId: string = '504'): ScheduleData | null {
  const cleanId = (roomId || '').trim().toLowerCase().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  
  const is11_2 = cleanId.includes('11.2') || cleanId.includes('11-2') || cleanId.includes('xh') || cleanId.includes('tâm lý') || cleanId.includes('tam ly') || cleanId === 'tam-ly' || cleanId === 'tamly' || cleanId === 'tl';
  const is11_1 = cleanId === '504' || cleanId === '11' || cleanId === '11-tn' || cleanId === '11.1' || cleanId === '11.1-tn' || cleanId === '11-1-tn';

  if (is11_2) {
    return {
      ...SCHEDULE_DATA_11_2,
      teachers: SCHEDULE_DATA.teachers
    };
  }

  if (is11_1 || !cleanId) {
    return SCHEDULE_DATA;
  }

  // Not a recognized Grade 11 room
  return null;
}
