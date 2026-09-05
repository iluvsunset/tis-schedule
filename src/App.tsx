import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, ThemeKey, ViewMode, DayKey, ScheduleData, WeekTabInfo, INITIAL_ROOMS, INITIAL_CLASSES, RoomInfo } from './types/schedule';
import { getFallbackRoomSchedule } from './data/scheduleData';
import { fetchLiveRoomSchedule, getAllSheetTabs } from './services/googleSheetService';
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

// Legacy class ID to primary room mapping for backward compatibility
const CLASS_TO_ROOM_MAP: Record<string, string> = {
  '6': '501',
  '7': '502',
  '8': '4010',
  '9': '4011',
  '10-tn': '4012',
  '10-nt': '307',
  '11-tn': '504',
  '12-tn': '503'
};

function parsePath(pathname: string): { lang?: Language; roomId?: string; classId?: string; isLive?: boolean } {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean) return {};
  const segments = clean.split('/').filter(Boolean);

  let lang: Language | undefined;
  let roomId: string | undefined;
  let classId: string | undefined;
  let isLive = false;

  let idx = 0;
  if (segments[idx] === 'vi' || segments[idx] === 'en') {
    lang = segments[idx] as Language;
    idx++;
  }

  if (segments[idx] === 'room' && segments[idx + 1]) {
    roomId = segments[idx + 1];
    idx += 2;
  } else if (segments[idx] === 'class' && segments[idx + 1]) {
    classId = segments[idx + 1];
    roomId = CLASS_TO_ROOM_MAP[classId] || classId;
    idx += 2;
  } else if (segments[idx] && CLASS_TO_ROOM_MAP[segments[idx]]) {
    classId = segments[idx];
    roomId = CLASS_TO_ROOM_MAP[segments[idx]];
    idx++;
  } else if (segments[idx] && /^\d+/.test(segments[idx])) {
    roomId = segments[idx];
    idx++;
  }

  if (segments[idx] === 'live' || segments[idx] === 'focus') {
    isLive = true;
  }

  return { lang, roomId, classId, isLive };
}

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Universal Room State (from URL or localStorage)
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    const route = parsePath(window.location.pathname);
    return route.roomId || localStorage.getItem('tis_selected_room') || '504';
  });

  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const route = parsePath(window.location.pathname);
    return route.classId || localStorage.getItem('tis_selected_class') || '11-tn';
  });

  // Screen Mode: 'schedule' (full timetable) vs 'live-focus' (1 starting subject display)
  const [screenMode, setScreenMode] = useState<'schedule' | 'live-focus'>(() => {
    const route = parsePath(window.location.pathname);
    if (route.isLive) return 'live-focus';
    return (localStorage.getItem('tis_screen_mode') as 'schedule' | 'live-focus') || 'schedule';
  });

  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(() => {
    try {
      const route = parsePath(window.location.pathname);
      const targetRoom = route.roomId || localStorage.getItem('tis_selected_room') || '504';
      const cached = localStorage.getItem(`tis_room_cache_${targetRoom}`);
      if (cached) {
        return JSON.parse(cached);
      }
      return getFallbackRoomSchedule(targetRoom);
    } catch (e) {
      return getFallbackRoomSchedule('504');
    }
  });

  const [language, setLanguage] = useState<Language>(() => {
    const route = parsePath(window.location.pathname);
    return route.lang || (localStorage.getItem('tis_language') as Language) || 'vi';
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
    if (route.roomId) return false;
    return !localStorage.getItem('tis_selected_room');
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

  // 1. Initialize day, load weeks & fetch room schedule on startup immediately
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

    if (!selectedRoomId) return;

    // Discover all available week tabs & fetch room schedule immediately
    getAllSheetTabs().then((tabs) => {
      setAvailableWeeks(tabs);
      const latestGid = tabs[tabs.length - 1]?.gid || '676068602';
      setSelectedWeekGid(latestGid);
      
      // Fetch live room schedule for selected room
      fetchLiveRoomSchedule(latestGid, selectedRoomId).then((freshData) => {
        if (freshData) {
          try {
            localStorage.setItem(`tis_room_cache_${selectedRoomId}`, JSON.stringify(freshData));
          } catch (e) {}
          setScheduleData(freshData);
        } else {
          const fallback = getFallbackRoomSchedule(selectedRoomId);
          setScheduleData(fallback);
        }
      }).catch((e) => {
        console.warn('Initial live room sync fallback:', e);
        const fallback = getFallbackRoomSchedule(selectedRoomId);
        setScheduleData(fallback);
      });
    }).catch((e) => console.warn('Tabs fetch fallback:', e));
  }, [selectedRoomId]);

  // Synchronize route changes from browser navigation / back / forward / deep links
  useEffect(() => {
    const route = parsePath(location.pathname);

    if (route.lang && route.lang !== language) {
      setLanguage(route.lang);
      localStorage.setItem('tis_language', route.lang);
    }

    if (route.roomId && route.roomId !== selectedRoomId) {
      setSelectedRoomId(route.roomId);
      localStorage.setItem('tis_selected_room', route.roomId);
      setIsRoomModalOpen(false);
    }

    if (route.classId && route.classId !== selectedClassId) {
      setSelectedClassId(route.classId);
      localStorage.setItem('tis_selected_class', route.classId);
    }

    if (route.isLive !== (screenMode === 'live-focus')) {
      setScreenMode(route.isLive ? 'live-focus' : 'schedule');
    }

    // Normalize URL
    if (location.pathname === '/') {
      const room = route.roomId || selectedRoomId || '504';
      navigate(`/${route.lang || language}/room/${room}`, { replace: true });
    }
  }, [location.pathname, language, selectedRoomId, selectedClassId, screenMode, navigate]);

  // Handle Room Selection
  const handleSelectRoom = (roomId: string) => {
    const cleanId = roomId.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
    setSelectedRoomId(cleanId);
    localStorage.setItem('tis_selected_room', cleanId);
    setIsRoomModalOpen(false);

    // Immediate optimistic fallback display
    const fallback = getFallbackRoomSchedule(cleanId);
    setScheduleData(fallback);

    const targetUrl = `/${language}/room/${cleanId}${screenMode === 'live-focus' ? '/live' : ''}`;
    navigate(targetUrl);

    // Background network sync
    fetchLiveRoomSchedule(selectedWeekGid, cleanId).then((freshData) => {
      if (freshData) {
        try {
          localStorage.setItem(`tis_room_cache_${cleanId}`, JSON.stringify(freshData));
        } catch (e) {}
        setScheduleData(freshData);
      } else {
        if (!fallback) {
          setScheduleData(null);
        }
      }
    }).catch(err => {
      console.warn('Room fetch live error:', err);
      if (!fallback) setScheduleData(null);
    });
  };

  // Handle Class Selection
  const handleSelectClass = (classId: string, mappedRoomId?: string) => {
    const cleanRoom = mappedRoomId || CLASS_TO_ROOM_MAP[classId] || '504';
    setSelectedClassId(classId);
    setSelectedRoomId(cleanRoom);
    localStorage.setItem('tis_selected_class', classId);
    localStorage.setItem('tis_selected_room', cleanRoom);
    setIsRoomModalOpen(false);

    const fallback = getFallbackRoomSchedule(cleanRoom);
    setScheduleData(fallback);

    const targetUrl = `/${language}/room/${cleanRoom}${screenMode === 'live-focus' ? '/live' : ''}`;
    navigate(targetUrl);

    fetchLiveRoomSchedule(selectedWeekGid, cleanRoom).then((freshData) => {
      if (freshData) {
        try {
          localStorage.setItem(`tis_room_cache_${cleanRoom}`, JSON.stringify(freshData));
        } catch (e) {}
        setScheduleData(freshData);
      }
    }).catch(err => console.warn('Class fetch live error:', err));
  };

  // Handle Screen Mode Switch
  const handleScreenModeChange = (mode: 'schedule' | 'live-focus') => {
    setScreenMode(mode);
    localStorage.setItem('tis_screen_mode', mode);
    const targetUrl = `/${language}/room/${selectedRoomId}${mode === 'live-focus' ? '/live' : ''}`;
    navigate(targetUrl);
  };

  // Handle Language Switch with Route Sync
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('tis_language', newLang);
    const targetUrl = `/${newLang}/room/${selectedRoomId}${screenMode === 'live-focus' ? '/live' : ''}`;
    navigate(targetUrl);
  };

  // Handle Week Switch
  const handleSelectWeek = async (gid: string) => {
    setSelectedWeekGid(gid);
    try {
      const freshData = await fetchLiveRoomSchedule(gid, selectedRoomId);
      if (freshData) setScheduleData(freshData);
    } catch (e) {
      console.warn('Week switch room fetch fallback:', e);
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
            screenMode={screenMode}
            onScreenModeChange={handleScreenModeChange}
          />
        )}

        {/* Primary Schedule View: Choice between Single Starting Subject Screen, Full Timetable, or Room Not Found Screen */}
        <main className={`flex-1 ${isMinimalMode ? 'flex flex-col md:justify-center md:my-auto w-full' : 'mt-1 sm:mt-1.5'} relative z-0`}>
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
            ) : screenMode === 'live-focus' ? (
              <motion.div
                key={`live-focus-${selectedRoomId}-${selectedDay}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <SingleSubjectFocusScreen
                  scheduleData={scheduleData}
                  language={language}
                  vnTime={vnTime}
                  selectedDay={selectedDay}
                  onOpenRoomSelector={() => setIsRoomModalOpen(true)}
                  onSwitchToTableView={() => handleScreenModeChange('schedule')}
                />
              </motion.div>
            ) : viewMode === 'timeline' ? (
              <motion.div
                key={`timeline-${selectedDay}-${selectedWeekGid}-${selectedRoomId}`}
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
                  onSwitchToLiveFocus={() => handleScreenModeChange('live-focus')}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`matrix-${selectedWeekGid}-${selectedRoomId}`}
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

        {/* Sleek Hotel Luxury Minimalist Footer (Zero Icons) */}
        {!isMinimalMode && scheduleData && (
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
