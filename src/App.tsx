import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, ThemeKey, ViewMode, DayKey, ScheduleData, WeekTabInfo, INITIAL_CLASSES } from './types/schedule';
import { SCHEDULE_DATA as INITIAL_DATA } from './data/scheduleData';
import { fetchLiveSchedule, getAllSheetTabs } from './services/googleSheetService';
import { Navbar } from './components/Navbar';
import { MinimalHeaderCard } from './components/MinimalHeaderCard';
import { TimelineView } from './components/TimelineView';
import { WeeklyMatrixView } from './components/WeeklyMatrixView';
import { TeacherModal } from './components/TeacherModal';
import { ClassSelectorModal } from './components/ClassSelectorModal';
import { IntroVideoLoader } from './components/IntroVideoLoader';
import { NotificationPermissionModal } from './components/NotificationPermissionModal';
import { getVietnamTime, VietnamTimeInfo, getDateStatus } from './utils/vietnamTime';
import { checkAndTriggerEveningReminder } from './utils/notificationService';

const VALID_CLASS_IDS = ['6', '7', '8', '9', '10-tn', '10-nt', '11-tn', '12-tn'];

const DAY_OF_WEEK_MAP: Record<number, DayKey> = {
  0: 'mon',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

function parsePath(pathname: string): { lang?: Language; classId?: string } {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!clean) return {};
  const segments = clean.split('/').filter(Boolean);

  let lang: Language | undefined;
  let classId: string | undefined;

  if (segments[0] === 'vi' || segments[0] === 'en') {
    lang = segments[0] as Language;
    if (segments[1] && VALID_CLASS_IDS.includes(segments[1])) {
      classId = segments[1];
    }
  } else if (VALID_CLASS_IDS.includes(segments[0])) {
    classId = segments[0];
  }

  return { lang, classId };
}

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState<ScheduleData>(() => {
    try {
      const route = parsePath(window.location.pathname);
      const targetClass = route.classId || localStorage.getItem('tis_selected_class_id') || '11-tn';
      const cached = localStorage.getItem(`tis_schedule_cache_${targetClass}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}
    return INITIAL_DATA;
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
  
  // Cinematic Intro Video Loader: skip if offline, slow connection, or already seen in session
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

  // Universal Class & Multi-Week State (from URL or localStorage)
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const route = parsePath(window.location.pathname);
    return route.classId || localStorage.getItem('tis_selected_class_id') || '';
  });
  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(() => {
    const route = parsePath(window.location.pathname);
    if (route.classId) return false;
    return !localStorage.getItem('tis_selected_class_id'); // Auto prompt on first visit if no class
  });
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [availableWeeks, setAvailableWeeks] = useState<WeekTabInfo[]>([]);
  const [selectedWeekGid, setSelectedWeekGid] = useState<string>('');

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

  // 1. Initialize day, load weeks & fetch schedule on startup immediately in parallel with video intro
  useEffect(() => {
    const currentVn = getVietnamTime();
    setVnTime(currentVn);
    
    const todayInSchedule = INITIAL_DATA.weekSchedule.find(d => getDateStatus(d.date, currentVn.dateStr) === 'today');
    if (todayInSchedule) {
      setSelectedDay(todayInSchedule.dayKey);
    } else {
      setSelectedDay(DAY_OF_WEEK_MAP[currentVn.dayOfWeek] || 'mon');
    }

    if (!selectedClassId) return;

    // Discover all available week tabs & fetch schedule immediately (ready before video ends)
    getAllSheetTabs().then((tabs) => {
      setAvailableWeeks(tabs);
      const latestGid = tabs[tabs.length - 1]?.gid || '676068602';
      setSelectedWeekGid(latestGid);
      
      // Fetch live schedule for user's selected class and latest week
      fetchLiveSchedule(latestGid, selectedClassId).then((freshData) => {
        if (freshData) {
          try {
            localStorage.setItem(`tis_schedule_cache_${selectedClassId}`, JSON.stringify(freshData));
          } catch (e) {}
          setScheduleData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(freshData)) {
              return prev;
            }
            return freshData;
          });
        }
      }).catch((e) => console.warn('Initial live sync fallback:', e));
    }).catch((e) => console.warn('Tabs fetch fallback:', e));
  }, [selectedClassId]);

  // Synchronize route changes from browser navigation / back / forward / deep links
  useEffect(() => {
    const route = parsePath(location.pathname);

    if (route.lang && route.lang !== language) {
      setLanguage(route.lang);
      localStorage.setItem('tis_language', route.lang);
    }

    if (route.classId && route.classId !== selectedClassId) {
      setSelectedClassId(route.classId);
      localStorage.setItem('tis_selected_class_id', route.classId);
      setIsClassModalOpen(false);
    }

    // If on root '/', normalize URL if we already have a selected class
    if (location.pathname === '/') {
      const savedClass = route.classId || selectedClassId || localStorage.getItem('tis_selected_class_id');
      if (savedClass && VALID_CLASS_IDS.includes(savedClass)) {
        navigate(`/${route.lang || language}/${savedClass}`, { replace: true });
      }
    }
  }, [location.pathname, language, selectedClassId, navigate]);

  // Handle Class Switch (instant cache load + background network sync)
  const handleSelectClass = (classId: string) => {
    const normalizedId = classId.toLowerCase();
    if (normalizedId === selectedClassId) {
      setIsClassModalOpen(false);
      return;
    }
    try {
      const cached = localStorage.getItem(`tis_schedule_cache_${normalizedId}`);
      if (cached) {
        setScheduleData(JSON.parse(cached));
      }
    } catch (e) {}
    setSelectedClassId(normalizedId);
    localStorage.setItem('tis_selected_class_id', normalizedId);
    setIsClassModalOpen(false);
    navigate(`/${language}/${normalizedId}`);
  };

  // Handle Language Switch with Route Sync
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('tis_language', newLang);
    if (selectedClassId) {
      navigate(`/${newLang}/${selectedClassId}`);
    } else {
      navigate(`/${newLang}`);
    }
  };

  // Handle Week Switch
  const handleSelectWeek = async (gid: string) => {
    setSelectedWeekGid(gid);
    try {
      const freshData = await fetchLiveSchedule(gid, selectedClassId);
      if (freshData) setScheduleData(freshData);
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

      // Maintain Safari Liquid Glass transparency
      const metaThemes = document.querySelectorAll('meta[name="theme-color"]');
      metaThemes.forEach(meta => meta.setAttribute('content', 'transparent'));
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

  // Priority load the video intro first before everything even the background
  if (showIntroVideo) {
    return <IntroVideoLoader onComplete={handleIntroComplete} />;
  }

  return (
    <div className={`min-h-[100dvh] bg-transparent relative text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans flex flex-col ${isMinimalMode ? 'justify-start md:justify-center items-center py-1 sm:py-3' : 'justify-between'}`}>
      
      {/* Non-intrusive First-Time Notification Permission & Install Prompt */}
      <NotificationPermissionModal language={language} />

      {/* Subtle Studio Ambient Lighting (Hardware-Accelerated & 60fps) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 no-print">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-slate-300/20 dark:bg-slate-800/20 blur-3xl transform-gpu pointer-events-none" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-slate-400/15 dark:bg-slate-800/15 blur-3xl transform-gpu pointer-events-none" />
      </div>

      {/* Main Fluid Responsive Container with Safe Area Support */}
      <div className={`relative z-10 w-full ${isMinimalMode ? 'max-w-full sm:max-w-[98%] xl:max-w-6xl 2xl:max-w-7xl md:my-auto justify-start md:justify-center' : 'max-w-[98%] sm:max-w-[95%] lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1550px] 3xl:max-w-[1850px] 4k:max-w-[2400px]'} mx-auto px-2 sm:px-4 lg:px-6 pt-1 sm:pt-3 pb-6 sm:pb-10 flex-1 flex flex-col transition-all duration-300`}>
        
        {/* Top Header Card: Minimal Hero Card in Minimal Mode / Full Navbar in Standard Mode */}
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
            onOpenClassModal={() => setIsClassModalOpen(true)}
            scheduleData={scheduleData}
            isMinimalMode={isMinimalMode}
            onToggleMinimalMode={handleToggleMinimalMode}
          />
        )}

        {/* Primary Schedule View (Auto-Centered in Minimal Mode) */}
        <main className={`flex-1 ${isMinimalMode ? 'flex flex-col md:justify-center md:my-auto w-full' : 'mt-1 sm:mt-1.5'} relative z-0`}>
          <AnimatePresence mode="wait">
            {viewMode === 'timeline' ? (
              <motion.div
                key={`timeline-${selectedDay}-${selectedWeekGid}-${selectedClassId}`}
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
                />
              </motion.div>
            ) : (
              <motion.div
                key={`matrix-${selectedWeekGid}-${selectedClassId}`}
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

        {/* Sleek Minimal Transparent Footer (Hidden in Minimal Mode) */}
        {!isMinimalMode && (
          <footer className="mt-auto pt-6 pb-3 text-center text-[11px] text-slate-400 dark:text-slate-500 no-print">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {language === 'vi' ? (scheduleData.gradeTitleVi || 'Lớp 11-TN') : (scheduleData.gradeTitleEn || 'Grade 11-TN')} • TIS Schedule
              </span>
              <span>•</span>
              <span>{language === 'vi' ? 'Phòng' : 'Room'} {scheduleData.room || '504'}</span>
              <span>•</span>
              <span>{language === 'vi' ? 'GVQN' : 'HR'}: {scheduleData.homeroomTeacher?.name}</span>
              <span>•</span>
              <span>{language === 'vi' ? 'Giờ Việt Nam (UTC+7)' : 'Vietnam Time (UTC+7)'}</span>
            </div>
          </footer>
        )}

        {/* Universal Class Selection Modal */}
        <ClassSelectorModal
          isOpen={isClassModalOpen}
          onClose={() => setIsClassModalOpen(false)}
          classes={INITIAL_CLASSES}
          selectedClassId={selectedClassId}
          onSelectClass={handleSelectClass}
          language={language}
          onLanguageChange={handleLanguageChange}
          allowClose={Boolean(localStorage.getItem('tis_selected_class_id'))}
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

