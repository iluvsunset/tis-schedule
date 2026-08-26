import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Language, ThemeKey, ViewMode, DayKey, ScheduleData } from './types/schedule';
import { SCHEDULE_DATA as INITIAL_DATA } from './data/scheduleData';
import { fetchLiveSchedule } from './services/googleSheetService';
import { Navbar } from './components/Navbar';
import { TimelineView } from './components/TimelineView';
import { WeeklyMatrixView } from './components/WeeklyMatrixView';
import { TeacherModal } from './components/TeacherModal';
import { NotificationPermissionModal } from './components/NotificationPermissionModal';
import { IPhoneInstallGuideModal } from './components/IPhoneInstallGuideModal';
import { getVietnamTime, VietnamTimeInfo } from './utils/vietnamTime';
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
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const mouse = useParallaxMouse();

  // Sync with Google Sheet live on background startup
  const handleSyncLive = useCallback(async () => {
    try {
      const freshData = await fetchLiveSchedule();
      setScheduleData(freshData);
    } catch (e) {
      console.warn('Sync failed, keeping current data:', e);
    }
  }, []);

  // Initialize day based on Vietnam Time & fetch live on start
  useEffect(() => {
    const currentVn = getVietnamTime();
    setVnTime(currentVn);
    if (currentVn.dayOfWeek >= 1 && currentVn.dayOfWeek <= 5) {
      const map: Record<number, DayKey> = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
      setSelectedDay(map[currentVn.dayOfWeek]);
    }
    handleSyncLive();
  }, [handleSyncLive]);

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

  return (
    <div className="min-h-screen relative text-slate-900 dark:text-slate-100 selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 transition-colors duration-300 font-sans flex flex-col justify-between overflow-x-hidden">
      
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

      {/* Main Fluid Responsive Container */}
      <div className="relative z-10 w-full max-w-[98%] sm:max-w-[95%] lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1550px] 3xl:max-w-[1850px] 4k:max-w-[2400px] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3.5 2xl:py-5 flex-1 flex flex-col transition-all duration-300">
        
        {/* Streamlined Unified Top Bar */}
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
        />

        {/* Primary Schedule View */}
        <main className="flex-1 mt-1 sm:mt-1.5">
          {viewMode === 'timeline' ? (
            <TimelineView
              selectedDay={selectedDay}
              language={language}
              activeFilter="all"
              searchQuery={searchQuery}
              vnTime={vnTime}
            />
          ) : (
            <WeeklyMatrixView
              language={language}
              activeFilter="all"
              searchQuery={searchQuery}
              vnTime={vnTime}
            />
          )}
        </main>

        {/* Teacher Roster Modal */}
        <TeacherModal
          isOpen={isTeacherModalOpen}
          onClose={() => setIsTeacherModalOpen(false)}
          language={language}
        />

      </div>

      {/* Sleek Minimal Footer */}
      <footer className="relative z-10 py-1.5 text-center text-[10px] text-slate-400 no-print border-t border-slate-100 bg-white/40 backdrop-blur-xs">
        <span className="font-semibold text-slate-600">Lớp 11-TN • TIS Schedule</span>
        <span className="mx-2">•</span>
        <span>Phòng {scheduleData.room || '504'} • GVQN: {scheduleData.homeroomTeacher.name}</span>
        <span className="mx-2">•</span>
        <span>Giờ Việt Nam (UTC+7)</span>
      </footer>

    </div>
  );
};
