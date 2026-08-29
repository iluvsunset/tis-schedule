import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  MoreVertical, 
  CalendarPlus, 
  Printer, 
  Users, 
  Globe, 
  Bell, 
  BellRing, 
  Sun, 
  Moon, 
  Laptop,
  ChevronDown,
  School
} from 'lucide-react';
import { Language, ThemeKey, ViewMode, DayKey, ScheduleData } from '../types/schedule';
import { exportScheduleToICS } from '../utils/icsExport';
import { VietnamTimeInfo } from '../utils/vietnamTime';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { 
  isNotificationEnabled, 
  requestNotificationPermission, 
  disableNotifications, 
  sendTestNotification, 
  isNotificationSupported 
} from '../utils/notificationService';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  vnTime: VietnamTimeInfo;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenTeacherModal: () => void;
  onOpenClassModal?: () => void;
  scheduleData?: ScheduleData;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  searchQuery,
  onSearchChange,
  vnTime,
  selectedDay,
  onSelectDay,
  viewMode,
  onViewModeChange,
  onOpenTeacherModal,
  onOpenClassModal,
  scheduleData
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [notifActive, setNotifActive] = useState(isNotificationEnabled());
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const days = (scheduleData || SCHEDULE_DATA).weekSchedule;
  const currentClassName = language === 'vi' 
    ? (scheduleData?.gradeTitleVi || 'Lớp 11-TN') 
    : (scheduleData?.gradeTitleEn || 'Grade 11-TN');
  const currentRoom = scheduleData?.room || '504';
  const currentTeacher = scheduleData?.homeroomTeacher?.name || 'Cô Tiềng';

  const dayLabelsVi: Record<DayKey, string> = { mon: 'T2', tue: 'T3', wed: 'T4', thu: 'T5', fri: 'T6', sat: 'T7' };
  const dayLabelsEn: Record<DayKey, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat' };

  const clearCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setTestCountdown(null);
  };

  const handleToggleNotification = async () => {
    if (notifActive) {
      clearCountdown();
      disableNotifications();
      setNotifActive(false);
    } else {
      const granted = await requestNotificationPermission();
      if (granted) {
        setNotifActive(true);
        trigger5sTestNotification();
      } else {
        alert(language === 'vi' 
          ? 'Trình duyệt chưa cấp quyền thông báo. Vui lòng cho phép trong cài đặt trình duyệt!' 
          : 'Please allow notification permissions in your browser settings.');
      }
    }
  };

  const trigger5sTestNotification = () => {
    if (testCountdown !== null) {
      clearCountdown();
      return;
    }

    setTestCountdown(5);
    let count = 5;

    countdownIntervalRef.current = window.setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearCountdown();
        sendTestNotification(language);
      } else {
        setTestCountdown(count);
      }
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearCountdown();
  }, []);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCycleTheme = () => {
    if (theme === 'system') onThemeChange('light');
    else if (theme === 'light') onThemeChange('dark');
    else onThemeChange('system');
  };

  return (
    <header className="relative z-50 no-print mb-3">
      <div className="glass-card border rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: TIS Logo, Interactive Class Switcher & Live Clock */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* TIS Logo */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenClassModal}
            title={language === 'vi' ? "Đổi lớp học" : "Change class"}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-800 p-0.5 shadow-xs border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
          >
            {!logoError ? (
              <img 
                src="/tis-logo.png" 
                alt="TIS Logo" 
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-display font-black text-slate-800 dark:text-slate-100 text-xs">TIS</span>
            )}
          </motion.button>

          {/* Interactive Class & Room Switcher */}
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenClassModal}
              className="flex items-center gap-1.5 cursor-pointer group text-left"
              title={language === 'vi' ? "Nhấn để chọn lớp khác" : "Click to switch class"}
            >
              <h1 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {currentClassName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 group-hover:border-amber-400/50 transition-colors">
                Phòng {currentRoom}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </motion.button>

            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>GVQN: {currentTeacher}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                {vnTime.timeWithSeconds}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Unified Day & Week Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto max-w-full relative">
          {days.map((d) => {
            const isSelected = viewMode === 'timeline' && selectedDay === d.dayKey;
            const label = language === 'vi' ? dayLabelsVi[d.dayKey] : dayLabelsEn[d.dayKey];
            const dateStr = d.date.split('/')[0] + '/' + d.date.split('/')[1];

            return (
              <button
                key={d.dayKey}
                onClick={() => {
                  onSelectDay(d.dayKey);
                  onViewModeChange('timeline');
                }}
                className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap z-10 ${
                  isSelected 
                    ? 'text-white dark:text-slate-900' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-nav-tab"
                    className="absolute inset-0 bg-slate-900 dark:bg-white rounded-lg shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span>{label}</span>
                <span className={`text-[10px] font-normal ${isSelected ? 'opacity-85' : 'text-slate-400 dark:text-slate-500'}`}>
                  {dateStr}
                </span>
              </button>
            );
          })}

          {/* Full Week Tab */}
          <button
            onClick={() => onViewModeChange('grid')}
            className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap border-l border-slate-200 dark:border-slate-700 ml-0.5 pl-2 z-10 ${
              viewMode === 'grid' 
                ? 'text-white dark:text-slate-900' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="active-nav-tab"
                className="absolute inset-0 bg-slate-900 dark:bg-white rounded-lg shadow-sm z-[-1]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {language === 'vi' ? 'Cả Tuần' : 'Full Week'}
          </button>
        </div>

        {/* Right: Quick Search, Theme Toggle, Notif Bell & Floating Action Menu */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto md:ml-0">
          
          {/* Quick Theme Cycle Button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleCycleTheme}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center shadow-2xs"
            title={
              theme === 'system'
                ? (language === 'vi' ? 'Giao diện: Tự động' : 'Theme: Auto')
                : theme === 'light'
                  ? (language === 'vi' ? 'Giao diện: Sáng' : 'Theme: Light')
                  : (language === 'vi' ? 'Giao diện: Tối' : 'Theme: Dark')
            }
          >
            {theme === 'system' ? (
              <Laptop className="w-3.5 h-3.5 text-blue-500" />
            ) : theme === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </motion.button>

          {/* Quick Notification Bell Toggle */}
          {isNotificationSupported() && (
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleToggleNotification}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                notifActive 
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 shadow-2xs' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={notifActive 
                ? (language === 'vi' ? 'Đã bật nhắc nhở mỗi tối (21:00)' : 'Evening reminders active') 
                : (language === 'vi' ? 'Bật nhắc nhở lịch học mỗi tối' : 'Enable reminders')}
            >
              {notifActive ? <BellRing className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> : <Bell className="w-3.5 h-3.5" />}
            </motion.button>
          )}

          {/* Compact Search Bar */}
          <div className="relative min-w-[100px] sm:min-w-[130px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={language === 'vi' ? "Tìm môn..." : "Search..."}
              className="w-full pl-7 pr-6 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400 text-xs transition-all outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Floating Action Menu Trigger */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isMenuOpen 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
              title="Tùy chọn & Tiện ích"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            {/* Elevated Floating Menu Panel */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.85, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -8 }}
                  className="absolute right-0 top-full mt-2 w-68 z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-2.5 divide-y divide-slate-100 dark:divide-slate-800 text-xs ring-1 ring-black/5 space-y-2"
                >
                  
                  {/* Switch Class */}
                  <div className="pb-1">
                    <button
                      onClick={() => {
                        onOpenClassModal?.();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <School className="w-4 h-4 text-amber-500" />
                      <div className="text-left">
                        <div>{language === 'vi' ? 'Đổi Lớp Học' : 'Switch Class'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{currentClassName}</div>
                      </div>
                    </button>
                  </div>

                  {/* Faculty Directory */}
                  <div className="pt-2 pb-1">
                    <button
                      onClick={() => {
                        onOpenTeacherModal();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      <span>{language === 'vi' ? 'Danh sách Giáo Viên' : 'Teacher Directory'}</span>
                    </button>
                  </div>

                  {/* Language Toggle */}
                  <div className="pt-2 flex items-center justify-between px-2 py-1">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
                    </div>
                    <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => onLanguageChange('vi')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold cursor-pointer transition ${language === 'vi' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'}`}
                      >
                        VIE
                      </button>
                      <button
                        onClick={() => onLanguageChange('en')}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold cursor-pointer transition ${language === 'en' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-400'}`}
                      >
                        ENG
                      </button>
                    </div>
                  </div>

                  {/* Calendar Export & Print */}
                  <div className="pt-2 grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => exportScheduleToICS(days, currentClassName)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-500" />
                      <span>{language === 'vi' ? 'Thêm Lịch' : 'Sync Cal'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{language === 'vi' ? 'In Lịch' : 'Print'}</span>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </header>
  );
};
