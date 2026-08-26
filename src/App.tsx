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
  const [isSyncing, setIsSyncing] = useState(false);
  const [language, setLanguage] = useState<Language>('vi');
  const [theme, setTheme] = useState<ThemeKey>('sakura');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [selectedDay, setSelectedDay] = useState<DayKey>('mon');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vnTime, setVnTime] = useState<VietnamTimeInfo>(getVietnamTime());
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const mouse = useParallaxMouse();

  // Sync with Google Sheet live
  const handleSyncLive = useCallback(async () => {
    setIsSyncing(true);
    try {
      const freshData = await fetchLiveSchedule();
      setScheduleData(freshData);
    } catch (e) {
      console.warn('Sync failed, keeping current data:', e);
    } finally {
      setIsSyncing(false);
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

  // Update root data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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
    <div className="min-h-screen relative text-slate-800 selection:bg-pink-200 selection:text-pink-900 transition-colors duration-500 font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* Non-intrusive First-Time Notification Permission & Install Prompt */}
      <NotificationPermissionModal language={language} />

      {/* iPhone Best Experience Guidance Screen (Request Desktop & Add to Home Screen) */}
      <IPhoneInstallGuideModal language={language} />

      {/* Interactive Parallax & Organic Floating Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print opacity-60">
        
        {/* Top-Left Pink Parallax Orb */}
        <motion.div
          animate={{
            x: [0, 30, -25, 0],
            y: [0, -35, 20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `translate(${mouse.x * 25}px, ${mouse.y * 25}px)`
          }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-200/50 blur-3xl transition-transform duration-300 ease-out"
        />

        {/* Right Purple Parallax Orb */}
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 40, -25, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `translate(${mouse.x * -30}px, ${mouse.y * -30}px)`
          }}
          className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-purple-200/45 blur-3xl transition-transform duration-300 ease-out"
        />

        {/* Bottom Orange Parallax Orb */}
        <motion.div
          animate={{
            x: [0, 25, -30, 0],
            y: [0, -25, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)`
          }}
          className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-orange-200/35 blur-3xl transition-transform duration-300 ease-out"
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
          isSyncing={isSyncing}
          onSyncLive={handleSyncLive}
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
