import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, ThemeKey, ViewMode, DayKey, ScheduleData, WeekTabInfo, INITIAL_ROOMS, INITIAL_CLASSES, RoomInfo } from './types/schedule';
import { getFallbackRoomSchedule } from './data/scheduleData';
import { fetchLiveRoomSchedule, fetchLiveSchedule, getAllSheetTabs } from './services/googleSheetService';
import { Navbar } from './components/Navbar';
import { MinimalHeaderCard } from './components/MinimalHeaderCard';
import { TimelineView } from './components/TimelineView';
import { WeeklyMatrixView } from './components/WeeklyMatrixView';
import { TeacherModal } from './components/TeacherModal';
import { RoomSelectorModal } from './components/RoomSelectorModal';
import { SingleSubjectFocusScreen } from './components/SingleSubjectFocusScreen';
import { IntroVideoLoader } from './components/IntroVideoLoader';
import { NotificationPermissionModal } from './components/NotificationPermissionModal';
import { getVietnamTime, VietnamTimeInfo, getDateStatus } from './utils/vietnamTime';
import { checkAndTriggerEveningReminder } from './utils/notificationService';

const DAY_OF_WEEK_MAP: Record<number, DayKey> = {
  0: 'mon',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

// Bidirectional mappings between Class ID and primary Room ID
export const CLASS_TO_ROOM_MAP: Record<string, string> = {
  '6': '501',
  '7': '502',
  '8': '4010',
  '9': '4011',
  '10-tn': '4012',
  '10-nt': '307',
  '11-tn': '504',
  '12-tn': '503'
};

export const ROOM_TO_CLASS_MAP: Record<string, string> = {
  '501': '6',
  '502': '7',
  '4010': '8',
  '4011': '9',
  '4012': '10-tn',
  '307': '10-nt',
  '504': '11-tn',
  '503': '12-tn'
};

export function isKnownRoom(roomId: string): boolean {
  const clean = roomId.trim().toLowerCase().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  return Boolean(ROOM_TO_CLASS_MAP[clean] || INITIAL_ROOMS.some(r => r.id.toLowerCase() === clean));
}

export function isKnownClass(classId: string): boolean {
  const clean = classId.trim().toLowerCase();
  return Boolean(CLASS_TO_ROOM_MAP[clean] || INITIAL_CLASSES.some(c => c.id.toLowerCase() === clean));
}

export interface ParsedRoute {
  lang: Language;
  viewType: 'room' | 'class';
  roomId: string;
  classId: string;
  isLive: boolean;
  isValid: boolean;
}

export function parsePath(pathname: string): ParsedRoute {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean) {
    return {
      lang: 'vi',
      viewType: 'class',
      roomId: '504',
      classId: '11-tn',
      isLive: false,
      isValid: true
    };
  }

  const segments = clean.split('/').filter(Boolean);
  let lang: Language = 'vi';
  let idx = 0;

  if (segments[idx] === 'vi' || segments[idx] === 'en') {
    lang = segments[idx] as Language;
    idx++;
  }

  const remaining = segments.slice(idx);

  // 1. Explicit Room Route: /room/:roomId or /room/:roomId/live
  if (remaining[0] === 'room' && remaining[1]) {
    const rawRoom = remaining[1].replace(/^p\.?\s*/i, '');
    const valid = isKnownRoom(rawRoom);
    return {
      lang,
      viewType: 'room',
      roomId: rawRoom,
      classId: ROOM_TO_CLASS_MAP[rawRoom] || '11-tn',
      isLive: true,
      isValid: valid
    };
  }

  // 2. Explicit Class Route: /class/:classId
  if (remaining[0] === 'class' && remaining[1]) {
    const cId = remaining[1];
    const valid = isKnownClass(cId);
    return {
      lang,
      viewType: 'class',
      roomId: CLASS_TO_ROOM_MAP[cId] || '504',
      classId: cId,
      isLive: false,
      isValid: valid
    };
  }

  // 3. Single Segment after lang: e.g. /vi/11-tn or /vi/504
  if (remaining[0]) {
    const seg = remaining[0];
    if (isKnownClass(seg)) {
      return {
        lang,
        viewType: 'class',
        roomId: CLASS_TO_ROOM_MAP[seg] || '504',
        classId: seg,
        isLive: false,
        isValid: true
      };
    }
    if (isKnownRoom(seg)) {
      return {
        lang,
        viewType: 'room',
        roomId: seg,
        classId: ROOM_TO_CLASS_MAP[seg] || '11-tn',
        isLive: true,
        isValid: true
      };
    }
    // Unrecognized ID: treat as room number to check (will show 404 Room Not Found if invalid)
    return {
      lang,
      viewType: 'room',
      roomId: seg,
      classId: '11-tn',
      isLive: true,
      isValid: false
    };
  }

  return {
    lang,
    viewType: 'class',
    roomId: '504',
    classId: '11-tn',
    isLive: false,
    isValid: true
  };
}

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialRoute = parsePath(window.location.pathname);

  // View Type: 'room' (single live subject only) vs 'class' (full timetable schedule like normal)
  const [viewType, setViewType] = useState<'room' | 'class'>(initialRoute.viewType);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoute.roomId);
  const [selectedClassId, setSelectedClassId] = useState<string>(initialRoute.classId);
  const [language, setLanguage] = useState<Language>(initialRoute.lang);

  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(() => {
    try {
      const route = parsePath(window.location.pathname);
      if (!route.isValid) {
        return null;
      }
      const target = route.viewType === 'room' ? route.roomId : (CLASS_TO_ROOM_MAP[route.classId] || route.roomId);
      const cached = localStorage.getItem(`tis_room_cache_${target}`);
      if (cached) {
        return JSON.parse(cached);
      }
      return getFallbackRoomSchedule(target);
    } catch (e) {
      return getFallbackRoomSchedule('504');
    }
  });

  const [theme, setTheme] = useState<ThemeKey>(() => {
    return (localStorage.getItem('tis_theme_pref') as ThemeKey) || 'system';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedDay, setSelectedDay] = useState<DayKey>(() => {
    const currentVn = getVietnamTime();
    return DAY_OF_WEEK_MAP[currentVn.dayOfWeek] || 'mon';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vnTime, setVnTime] = useState<VietnamTimeInfo>(getVietnamTime());
  
  // Cinematic Intro Video Loader
  const [showIntroVideo, setShowIntroVideo] = useState<boolean>(() => {
    try {
      if (sessionStorage.getItem('tis_intro_seen') === 'true') return false;
      if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
      const conn = (navigator as any)?.connection;
      if (conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) {
        return false;
      }
    } catch (e) {}
    return true;
  });

  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(() => {
    const route = parsePath(window.location.pathname);
    if (route.roomId || route.classId) return false;
    return !localStorage.getItem('tis_selected_room') && !localStorage.getItem('tis_selected_class');
  });

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [availableWeeks, setAvailableWeeks] = useState<WeekTabInfo[]>([]);
  const [selectedWeekGid, setSelectedWeekGid] = useState<string>('');
  const [rooms] = useState<RoomInfo[]>(INITIAL_ROOMS);

  // Full-Screen Minimal Focus Mode State
  const [isMinimalMode, setIsMinimalMode] = useState<boolean>(() => {
    return localStorage.getItem('tis_minimal_mode') === 'true';
  });

  const handleToggleMinimalMode = () => {
    setIsMinimalMode(prev => {
      const next = !prev;
      localStorage.setItem('tis_minimal_mode', String(next));
      return next;
    });
  };

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('tis_intro_seen', 'true');
    } catch (e) {}
    setShowIntroVideo(false);
  };

  // 1. Initialize day, load weeks & sync live schedule
  useEffect(() => {
    const currentVn = getVietnamTime();
    setVnTime(currentVn);
    
    if (scheduleData) {
      const todayInSchedule = scheduleData.weekSchedule.find(d => getDateStatus(d.date, currentVn.dateStr) === 'today');
      if (todayInSchedule) {
        setSelectedDay(todayInSchedule.dayKey);
      } else {
        setSelectedDay(DAY_OF_WEEK_MAP[currentVn.dayOfWeek] || 'mon');
      }
    } else {
      setSelectedDay(DAY_OF_WEEK_MAP[currentVn.dayOfWeek] || 'mon');
    }

    // Discover all available week tabs & fetch schedule
    getAllSheetTabs().then((tabs) => {
      setAvailableWeeks(tabs);
      const latestGid = tabs[tabs.length - 1]?.gid || '676068602';
      setSelectedWeekGid(latestGid);
      
      if (viewType === 'room') {
        if (!isKnownRoom(selectedRoomId)) return;
        fetchLiveRoomSchedule(latestGid, selectedRoomId).then((freshData) => {
          if (freshData) {
            try {
              localStorage.setItem(`tis_room_cache_${selectedRoomId}`, JSON.stringify(freshData));
            } catch (e) {}
            setScheduleData(freshData);
          }
        }).catch((e) => console.warn('Initial live room sync fallback:', e));
      } else {
        if (!isKnownClass(selectedClassId)) return;
        fetchLiveSchedule(latestGid, selectedClassId).then((freshData) => {
          if (freshData) {
            try {
              localStorage.setItem(`tis_room_cache_${selectedRoomId}`, JSON.stringify(freshData));
            } catch (e) {}
            setScheduleData(freshData);
          }
        }).catch((e) => console.warn('Initial live class sync fallback:', e));
      }
    }).catch((e) => console.warn('Tabs fetch fallback:', e));
  }, [selectedRoomId, selectedClassId, viewType]);

  // Synchronize route changes from browser navigation / back / forward / deep links
  useEffect(() => {
    const route = parsePath(location.pathname);

    if (route.lang !== language) {
      setLanguage(route.lang);
      localStorage.setItem('tis_language', route.lang);
    }

    if (route.viewType !== viewType) {
      setViewType(route.viewType);
    }

    if (route.roomId !== selectedRoomId) {
      setSelectedRoomId(route.roomId);
      localStorage.setItem('tis_selected_room', route.roomId);
      setIsRoomModalOpen(false);
    }

    if (route.classId !== selectedClassId) {
      setSelectedClassId(route.classId);
      localStorage.setItem('tis_selected_class', route.classId);
    }

    // Synchronously resolve fallback schedule data to avoid 404 flash
    if (route.isValid) {
      const target = route.viewType === 'room' ? route.roomId : (CLASS_TO_ROOM_MAP[route.classId] || route.roomId);
      const cached = localStorage.getItem(`tis_room_cache_${target}`);
      if (cached) {
        try {
          setScheduleData(JSON.parse(cached));
        } catch (e) {
          setScheduleData(getFallbackRoomSchedule(target));
        }
      } else {
        const fallback = getFallbackRoomSchedule(target);
        if (fallback) {
          setScheduleData(fallback);
        }
      }
    } else {
      setScheduleData(null);
    }

    // Normalize URL
    if (location.pathname === '/' || location.pathname === `/${route.lang}`) {
      navigate(`/${route.lang}/11-tn`, { replace: true });
    }
  }, [location.pathname, navigate]);

  // Handle Room Selection: Navigates directly to Room Live View (Single live subject only)
  const handleSelectRoom = (roomId: string) => {
    const cleanId = roomId.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
    setSelectedRoomId(cleanId);
    setViewType('room');
    localStorage.setItem('tis_selected_room', cleanId);
    setIsRoomModalOpen(false);

    const valid = isKnownRoom(cleanId);
    if (valid) {
      const fallback = getFallbackRoomSchedule(cleanId);
      setScheduleData(fallback);
    } else {
      setScheduleData(null);
    }

    const targetUrl = `/${language}/room/${cleanId}/live`;
    navigate(targetUrl);

    if (valid) {
      fetchLiveRoomSchedule(selectedWeekGid, cleanId).then((freshData) => {
        if (freshData) {
          try {
            localStorage.setItem(`tis_room_cache_${cleanId}`, JSON.stringify(freshData));
          } catch (e) {}
          setScheduleData(freshData);
        }
      }).catch(err => console.warn('Room fetch live error:', err));
    }
  };

  // Handle Class Selection: Navigates to Class Timetable View (Full schedule as normal)
  const handleSelectClass = (classId: string, mappedRoomId?: string) => {
    const cleanRoom = mappedRoomId || CLASS_TO_ROOM_MAP[classId] || '504';
    setSelectedClassId(classId);
    setSelectedRoomId(cleanRoom);
    setViewType('class');
    localStorage.setItem('tis_selected_class', classId);
    localStorage.setItem('tis_selected_room', cleanRoom);
    setIsRoomModalOpen(false);

    const fallback = getFallbackRoomSchedule(cleanRoom);
    setScheduleData(fallback);

    const targetUrl = `/${language}/${classId}`;
    navigate(targetUrl);

    fetchLiveSchedule(selectedWeekGid, classId).then((freshData) => {
      if (freshData) {
        try {
          localStorage.setItem(`tis_room_cache_${cleanRoom}`, JSON.stringify(freshData));
        } catch (e) {}
        setScheduleData(freshData);
      }
    }).catch(err => console.warn('Class fetch live error:', err));
  };

  // Handle Language Switch with Route Sync
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('tis_language', newLang);
    if (viewType === 'room') {
      navigate(`/${newLang}/room/${selectedRoomId}/live`);
    } else {
      navigate(`/${newLang}/${selectedClassId}`);
    }
  };

  // Handle Week Switch
  const handleSelectWeek = async (gid: string) => {
    setSelectedWeekGid(gid);
    try {
      if (viewType === 'room') {
        const freshData = await fetchLiveRoomSchedule(gid, selectedRoomId);
        if (freshData) setScheduleData(freshData);
      } else {
        const freshData = await fetchLiveSchedule(gid, selectedClassId);
        if (freshData) setScheduleData(freshData);
      }
    } catch (e) {
      console.warn('Week switch fetch fallback:', e);
    }
  };

  // Update root data-theme attribute & auto-detect device dark mode
  useEffect(() => {
    localStorage.setItem('tis_theme_pref', theme);

    const applyTheme = () => {
      let isDark = true;
      if (theme === 'light') {
        isDark = false;
      } else if (theme === 'system') {
        isDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
      } else {
        isDark = true;
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    applyTheme();

    if (theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Real-time ticker strictly in Vietnam Time (UTC+7) + Evening Reminder Check
  useEffect(() => {
    const interval = setInterval(() => {
      setVnTime(getVietnamTime());
      checkAndTriggerEveningReminder(language);
    }, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Keyboard shortcut listener for Full-Screen Minimal Mode (F / Escape) + Day Navigation (Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape' && isMinimalMode) {
        setIsMinimalMode(false);
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleMinimalMode();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const dayKeys: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const currentIndex = dayKeys.indexOf(selectedDay);
        if (e.key === 'ArrowRight') {
          const nextIndex = (currentIndex + 1) % dayKeys.length;
          setSelectedDay(dayKeys[nextIndex]);
        } else if (e.key === 'ArrowLeft') {
          const prevIndex = (currentIndex - 1 + dayKeys.length) % dayKeys.length;
          setSelectedDay(dayKeys[prevIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMinimalMode, selectedDay]);

  // Priority load the video intro first before everything
  if (showIntroVideo) {
    return <IntroVideoLoader onComplete={handleIntroComplete} />;
  }

  return (
    <div className={`min-h-[100dvh] bg-transparent relative text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans flex flex-col ${isMinimalMode ? 'justify-start md:justify-center items-center py-1 sm:py-3' : 'justify-between'}`}>
      
      {/* Non-intrusive First-Time Notification Permission Prompt */}
      <NotificationPermissionModal language={language} />

      {/* Subtle Studio Ambient Lighting (Hardware-Accelerated & 60fps) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 no-print">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-slate-300/20 dark:bg-slate-800/20 blur-3xl transform-gpu pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-slate-400/15 dark:bg-slate-800/15 blur-3xl transform-gpu pointer-events-none" />
      </div>

      {/* Main Responsive Container */}
      <div className={`relative z-10 w-full ${isMinimalMode ? 'max-w-full sm:max-w-[98%] xl:max-w-6xl 2xl:max-w-7xl md:my-auto justify-start md:justify-center' : 'max-w-[98%] sm:max-w-[95%] lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1550px]'} mx-auto px-2 sm:px-4 lg:px-6 pt-1 sm:pt-3 pb-6 sm:pb-10 flex-1 flex flex-col transition-all duration-300`}>
        
        {/* Top Header Card */}
        {isMinimalMode ? (
          <MinimalHeaderCard
            vnTime={vnTime}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            language={language}
            theme={theme}
            onThemeChange={setTheme}
            scheduleData={scheduleData}
            availableWeeks={availableWeeks}
            selectedWeekGid={selectedWeekGid}
            onSelectWeek={handleSelectWeek}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onToggleMinimalMode={handleToggleMinimalMode}
          />
        ) : (
          <Navbar
            language={language}
            onLanguageChange={handleLanguageChange}
            theme={theme}
            onThemeChange={setTheme}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            vnTime={vnTime}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
            onOpenClassModal={() => setIsRoomModalOpen(true)}
            onOpenRoomSelector={() => setIsRoomModalOpen(true)}
            scheduleData={scheduleData}
            isMinimalMode={isMinimalMode}
            onToggleMinimalMode={handleToggleMinimalMode}
            viewType={viewType}
          />
        )}

        {/* Primary Schedule View: Choice between Single Starting Subject Screen, Full Timetable, or Room Not Found Screen */}
        <main className={`flex-1 ${viewType === 'room' || isMinimalMode ? 'flex flex-col justify-center items-center my-auto w-full' : 'mt-1 sm:mt-1.5'} relative z-0`}>
          <AnimatePresence mode="wait">
            {!scheduleData ? (
              /* Room Not Found Screen (Zero Icons, Pure High-Contrast Typography) */
              <motion.div
                key={`not-found-${selectedRoomId}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg mx-auto my-auto py-16 px-6 text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center font-mono font-black text-2xl text-slate-500 dark:text-slate-400 select-none">
                  404
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-rose-500 dark:text-rose-400 font-bold block">
                    {language === 'vi' ? 'PHÒNG HỌC KHÔNG TỒN TẠI' : 'ROOM NOT FOUND'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {language === 'vi' ? `Không tìm thấy phòng "${selectedRoomId}"` : `Room "${selectedRoomId}" not found`}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {language === 'vi'
                      ? 'Số phòng này không có trong danh sách thời khóa biểu của trường. Vui lòng kiểm tra lại hoặc thử chọn trực tiếp theo Lớp học của bạn.'
                      : 'This room number was not found in the timetable. Please check the room number or choose your class.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRoomModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
                  >
                    {language === 'vi' ? 'Chọn theo Lớp học' : 'Choose by Class'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRoomModalOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-semibold text-xs uppercase tracking-wider transition cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    {language === 'vi' ? 'Nhập lại số phòng' : 'Re-enter Room'}
                  </button>
                </div>
              </motion.div>
            ) : viewType === 'room' ? (
              /* Dedicated Room Live View: ONLY single live subject, no calendar for whole day */
              <motion.div
                key={`room-live-${selectedRoomId}-${selectedDay}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex justify-center items-center my-auto"
              >
                <SingleSubjectFocusScreen
                  scheduleData={scheduleData}
                  language={language}
                  vnTime={vnTime}
                  selectedDay={selectedDay}
                  onOpenRoomSelector={() => setIsRoomModalOpen(true)}
                />
              </motion.div>
            ) : viewMode === 'timeline' ? (
              /* Class View: Full Timetable Schedule like normal in the old code */
              <motion.div
                key={`class-timeline-${selectedDay}-${selectedWeekGid}-${selectedClassId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={isMinimalMode ? 'w-full md:my-auto' : ''}
              >
                <TimelineView
                  selectedDay={selectedDay}
                  language={language}
                  activeFilter="all"
                  searchQuery={searchQuery}
                  vnTime={vnTime}
                  scheduleData={scheduleData}
                  availableWeeks={availableWeeks}
                  selectedWeekGid={selectedWeekGid}
                  onSelectWeek={handleSelectWeek}
                  isMinimalMode={isMinimalMode}
                  onToggleMinimalMode={handleToggleMinimalMode}
                  onOpenRoomSelector={() => setIsRoomModalOpen(true)}
                />
              </motion.div>
            ) : (
              /* Class View: Full Week Grid Matrix */
              <motion.div
                key={`class-matrix-${selectedWeekGid}-${selectedClassId}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={isMinimalMode ? 'w-full my-auto' : ''}
              >
                <WeeklyMatrixView
                  language={language}
                  activeFilter="all"
                  searchQuery={searchQuery}
                  vnTime={vnTime}
                  scheduleData={scheduleData}
                  availableWeeks={availableWeeks}
                  selectedWeekGid={selectedWeekGid}
                  onSelectWeek={handleSelectWeek}
                  isMinimalMode={isMinimalMode}
                  onToggleMinimalMode={handleToggleMinimalMode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Sleek Hotel Luxury Minimalist Footer (Zero Icons - Only in Class View) */}
        {!isMinimalMode && scheduleData && viewType === 'class' && (
          <footer className="mt-auto pt-8 pb-3 text-center text-[11px] font-mono text-slate-400 dark:text-white/40 no-print">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="font-semibold text-slate-600 dark:text-white/70">
                {language === 'vi' ? (scheduleData.roomNameVi || `Phòng ${selectedRoomId}`) : (scheduleData.roomNameEn || `Room ${selectedRoomId}`)}
              </span>
              <span>·</span>
              <span>{language === 'vi' ? (scheduleData.floorVi || 'Tầng 5') : (scheduleData.floorEn || 'Floor 5')}</span>
              <span>·</span>
              <span>{language === 'vi' ? (scheduleData.gradeTitleVi || 'Lớp 11-TN') : (scheduleData.gradeTitleEn || 'Grade 11-TN')}</span>
              <span>·</span>
              <span>{language === 'vi' ? 'GV Phụ trách' : 'Overseer'}: {scheduleData.homeroomTeacher?.name}</span>
            </div>
          </footer>
        )}

        {/* Two-Panel Horizontal Room Selection & Class Choosing Modal */}
        <RoomSelectorModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          rooms={rooms}
          classes={INITIAL_CLASSES}
          selectedRoomId={selectedRoomId}
          selectedClassId={selectedClassId}
          onSelectRoom={handleSelectRoom}
          onSelectClass={handleSelectClass}
          language={language}
          onLanguageChange={handleLanguageChange}
          allowClose={Boolean(localStorage.getItem('tis_selected_room')) && scheduleData !== null}
        />

        {/* Teacher Roster Modal */}
        <TeacherModal
          isOpen={isTeacherModalOpen}
          onClose={() => setIsTeacherModalOpen(false)}
          language={language}
        />

      </div>

    </div>
  );
};
