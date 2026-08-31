import React, { useState, useEffect } from 'react';
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
import { IPhoneInstallGuideModal } from './components/IPhoneInstallGuideModal';
import { getVietnamTime, VietnamTimeInfo, getDateStatus } from './utils/vietnamTime';
import { useParallaxMouse } from './hooks/useParallaxMouse';
import { checkAndTriggerEveningReminder } from './utils/notificationService';

export const App: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>(INITIAL_DATA);
  const [language, setLanguage] = useState<Language>('vi');
  const [theme, setTheme] = useState<ThemeKey>(() => {
    return (localStorage.getItem('tis_theme_pref') as ThemeKey) || 'system';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedDay, setSelectedDay] = useState<DayKey>('mon');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vnTime, setVnTime] = useState<VietnamTimeInfo>(getVietnamTime());
  
  // Cinematic Intro Video Loader (plays on first access)
  const [showIntroVideo, setShowIntroVideo] = useState<boolean>(() => {
    return !sessionStorage.getItem('tis_intro_seen');
  });

  // Universal Class & Multi-Week State
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    return localStorage.getItem('tis_selected_class_id') || '11-tn';
  });
  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem('tis_selected_class_id'); // Auto prompt on first visit
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

  const mouse = useParallaxMouse();

  const handleIntroComplete = () => {
    sessionStorage.setItem('tis_intro_seen', 'true');
    setShowIntroVideo(false);
  };

  // 1. Initialize day, load weeks & fetch schedule on startup
  useEffect(() => {
    const currentVn = getVietnamTime();
    setVnTime(currentVn);
    
    const todayInSchedule = INITIAL_DATA.weekSchedule.find(d => getDateStatus(d.date, currentVn.dateStr) === 'today');
    if (todayInSchedule) {
      setSelectedDay(todayInSchedule.dayKey);
    } else {
      setSelectedDay('mon');
    }

    // Discover all available week tabs
    getAllSheetTabs().then((tabs) => {
      setAvailableWeeks(tabs);
      const latestGid = tabs[tabs.length - 1]?.gid || '676068602';
      setSelectedWeekGid(latestGid);
      
      // Fetch live schedule for user's selected class and latest week
      fetchLiveSchedule(latestGid, selectedClassId).then((freshData) => {
        if (freshData) setScheduleData(freshData);
      }).catch((e) => console.warn('Initial live sync fallback:', e));
    }).catch((e) => console.warn('Tabs fetch fallback:', e));
  }, [selectedClassId]);

  // Handle Class Switch
  const handleSelectClass = async (classId: string) => {
    setSelectedClassId(classId);
    localStorage.setItem('tis_selected_class_id', classId);
    try {
      const freshData = await fetchLiveSchedule(selectedWeekGid, classId);
      if (freshData) setScheduleData(freshData);
    } catch (e) {
      console.warn('Class switch fetch fallback:', e);
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
      let isDark = false;
      if (theme === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Synchronize mobile Safari theme-color meta tag
      const activeColor = isDark ? '#080c14' : '#f8fafc';
      const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');
      metaThemeColors.forEach(meta => meta.setAttribute('content', activeColor));
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
        localStorage.setItem('tis_minimal_mode', 'false');
      } else if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        handleToggleMinimalMode();
      } else if (isMinimalMode && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
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

  return (
    <div className={`min-h-screen min-h-[100dvh] relative text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 transition-colors duration-300 font-sans flex flex-col ${isMinimalMode ? 'justify-start md:justify-center items-center py-1 sm:py-3' : 'justify-between'} overflow-x-hidden`}>
      
      {/* Cinematic First-Access Video Intro / Loading Screen */}
      {showIntroVideo && (
        <IntroVideoLoader onComplete={handleIntroComplete} />
      )}

      {/* Non-intrusive First-Time Notification Permission & Install Prompt */}
      <NotificationPermissionModal language={language} />

      {/* iPhone Best Experience Guidance Screen (Add to Home Screen) */}
      <IPhoneInstallGuideModal language={language} onLanguageChange={setLanguage} />

      {/* Subtle Studio Ambient Lighting (Clean & Luxury) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
        <motion.div
          animate={{
            x: [0, 15, -15, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `translate(${mouse.x * 12}px, ${mouse.y * 12}px)`
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-slate-200/30 dark:bg-slate-800/20 blur-[120px] transition-transform duration-500 ease-out"
        />
        <motion.div
          animate={{
            x: [0, -15, 10, 0],
            y: [0, 20, -15, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `translate(${mouse.x * -15}px, ${mouse.y * -15}px)`
          }}
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-slate-300/20 dark:bg-slate-800/15 blur-[140px] transition-transform duration-500 ease-out"
        />
      </div>

      {/* Main Fluid Responsive Container with Safe Area Support */}
      <div className={`relative z-10 w-full ${isMinimalMode ? 'max-w-full sm:max-w-[98%] xl:max-w-6xl 2xl:max-w-7xl md:my-auto justify-start md:justify-center' : 'max-w-[98%] sm:max-w-[95%] lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1550px] 3xl:max-w-[1850px] 4k:max-w-[2400px]'} mx-auto px-2 sm:px-4 lg:px-6 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] flex-1 flex flex-col transition-all duration-300`}>
        
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
            onLanguageChange={setLanguage}
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
                {scheduleData.gradeTitleVi || 'Lớp 11-TN'} • TIS Schedule
              </span>
              <span>•</span>
              <span>Phòng {scheduleData.room || '504'}</span>
              <span>•</span>
              <span>GVQN: {scheduleData.homeroomTeacher?.name}</span>
              <span>•</span>
              <span>Giờ Việt Nam (UTC+7)</span>
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

