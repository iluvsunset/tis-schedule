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
  School,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Language, ThemeKey, ViewMode, DayKey, ScheduleData, INITIAL_CLASSES } from '../types/schedule';
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
import { dropdownMenuVariants } from '../utils/motionTokens';

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
  onOpenRoomSelector?: () => void;
  scheduleData?: ScheduleData;
  isMinimalMode?: boolean;
  onToggleMinimalMode?: () => void;
  screenMode?: 'schedule' | 'live-focus';
  onScreenModeChange?: (mode: 'schedule' | 'live-focus') => void;
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
  onOpenRoomSelector,
  scheduleData,
  isMinimalMode,
  onToggleMinimalMode,
  screenMode = 'schedule',
  onScreenModeChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [notifActive, setNotifActive] = useState(isNotificationEnabled());
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const days = (scheduleData || SCHEDULE_DATA).weekSchedule;
  const matchedClass = INITIAL_CLASSES.find(c => c.id === scheduleData?.classId) || 
                       INITIAL_CLASSES.find(c => c.nameVi === scheduleData?.gradeTitleVi) ||
                       INITIAL_CLASSES.find(c => c.id === '11-tn');
  const currentClassName = language === 'vi' 
    ? (matchedClass?.nameVi || scheduleData?.gradeTitleVi || 'Lớp 11-TN') 
    : (matchedClass?.nameEn || scheduleData?.gradeTitleEn || 'Grade 11-TN');
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
    <header className="sticky top-0 z-50 no-print pt-[max(0.25rem,env(safe-area-inset-top,0px))] pb-2 sm:pb-3">
      <div className="glass-card border rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 shadow-xs flex flex-col gap-2 sm:gap-2.5">
        
        {/* Top Row: Left Brand/Class Info & Right Quick Action Buttons */}
        <div className="flex items-center justify-between gap-2 w-full">
          
          {/* Left: TIS Logo, Interactive Class Switcher & Live Clock */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* TIS Logo Button */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={onOpenClassModal}
              title={language === 'vi' ? "Đổi lớp học" : "Change class"}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-800 p-0.5 shadow-2xs border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
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

            {/* Interactive Room Number Switcher (Aman / Hotel Hoa Nắng Style) */}
            <div className="min-w-0">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onOpenRoomSelector || onOpenClassModal}
                className="flex items-center gap-1.5 cursor-pointer group text-left max-w-full"
                title={language === 'vi' ? "Nhấn để nhập hoặc đổi số phòng học" : "Click to enter or change room number"}
              >
                <h1 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-tight leading-none truncate group-hover:text-blue-500 transition-colors">
                  {language === 'vi' ? (scheduleData?.roomNameVi || `Phòng ${currentRoom}`) : (scheduleData?.roomNameEn || `Room ${currentRoom}`)}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-medium bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 group-hover:border-slate-400 transition-colors shrink-0">
                  {currentClassName}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition hidden xs:inline">
                  [{language === 'vi' ? 'Đổi' : 'Change'}]
                </span>
              </motion.button>

              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                <span className="truncate hidden xs:inline">{language === 'vi' ? 'GV' : 'HR'}: {currentTeacher}</span>
                <span className="text-slate-300 dark:text-slate-700 hidden xs:inline">•</span>
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
                  {vnTime.timeStr}
                  <span className="text-blue-500 hidden xs:inline">:{String(vnTime.seconds).padStart(2, '0')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Screen Mode Switcher (Schedule vs Live Room 1-Subject) */}
            {onScreenModeChange && (
              <div className="flex items-center p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-mono shrink-0">
                <button
                  type="button"
                  onClick={() => onScreenModeChange('schedule')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    screenMode === 'schedule'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={language === 'vi' ? 'Xem toàn bộ thời khóa biểu' : 'Full schedule timetable'}
                >
                  {language === 'vi' ? 'Lịch' : 'Table'}
                </button>
                <button
                  type="button"
                  onClick={() => onScreenModeChange('live-focus')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    screenMode === 'live-focus'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={language === 'vi' ? 'Màn hình hiển thị 1 môn đang bắt đầu' : 'Single starting subject display'}
                >
                  {language === 'vi' ? 'Trực tiếp' : 'Live'}
                </button>
              </div>
            )}
            
            {/* Search Bar (Desktop / sm+ screens) */}
            <div className="hidden sm:block relative w-32 sm:w-40 md:w-48 focus-within:w-52 transition-all duration-200">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={language === 'vi' ? "Tìm môn..." : "Search..."}
                className="w-full pl-7 pr-6 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-slate-400 text-xs transition-all outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Theme Cycle Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleCycleTheme}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center shadow-2xs"
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

            {/* Quick Notification Bell Toggle (Desktop / sm+) */}
            {isNotificationSupported() && (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleToggleNotification}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer items-center justify-center ${
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

            {/* Full-Screen Minimal View Quick Action Button (Desktop / sm+) */}
            {onToggleMinimalMode && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onToggleMinimalMode}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl border transition cursor-pointer items-center justify-center shadow-2xs ${
                  isMinimalMode
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title={
                  isMinimalMode
                    ? (language === 'vi' ? "Thoát chế độ tối giản (Escape hoặc F)" : "Exit minimal mode (Esc or F)")
                    : (language === 'vi' ? "Chế độ xem tối giản toàn màn hình (Phím F)" : "Full-screen minimal focus mode (F)")
                }
              >
                {isMinimalMode ? (
                  <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                )}
              </motion.button>
            )}

            {/* Floating Action Menu Trigger */}
            <div className="relative z-[110]" ref={menuRef}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isMenuOpen 
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title={language === 'vi' ? "Tùy chọn & Tiện ích" : "Options & Tools"}
              >
                <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>

              {/* Elevated Floating Menu Panel */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    variants={dropdownMenuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute right-0 top-full mt-2 w-72 sm:w-76 z-[120] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-3 divide-y divide-slate-100 dark:divide-slate-800 text-xs ring-1 ring-black/10 space-y-2.5"
                  >
                    
                    {/* Switch Class */}
                    <div className="pb-1">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onOpenClassModal?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <School className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="text-left min-w-0 flex-1">
                          <div className="whitespace-nowrap font-bold text-xs">{language === 'vi' ? 'Đổi Lớp Học' : 'Switch Class'}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate">{currentClassName}</div>
                        </div>
                      </motion.button>
                    </div>

                    {/* Faculty Directory */}
                    <div className="pt-2.5 pb-1">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onOpenTeacherModal();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                        <span className="whitespace-nowrap font-bold text-xs">{language === 'vi' ? 'Danh sách Giáo Viên' : 'Teacher Directory'}</span>
                      </motion.button>
                    </div>

                    {/* Full-Screen Minimal Focus Mode */}
                    {onToggleMinimalMode && (
                      <div className="pt-2.5 pb-1">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onToggleMinimalMode();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Maximize2 className="w-4 h-4 text-indigo-500 shrink-0" />
                          <div className="text-left">
                            <div className="whitespace-nowrap font-bold text-xs">
                              {language === 'vi' ? 'Toàn màn hình tối giản' : 'Full-Screen Minimal'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {language === 'vi' ? 'Chỉ xem thời khóa biểu (Phím F)' : 'Show only schedule cards (F)'}
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    )}

                    {/* Language Toggle */}
                    <div className="pt-2.5 flex items-center justify-between px-3 py-1">
                      <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="whitespace-nowrap text-xs">{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
                      </div>
                      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onLanguageChange('vi')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${language === 'vi' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                          VIE
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onLanguageChange('en')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition ${language === 'en' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                          ENG
                        </motion.button>
                      </div>
                    </div>

                    {/* Calendar Export & Print */}
                    <div className="pt-2.5 grid grid-cols-2 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => exportScheduleToICS(days, currentClassName)}
                        className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer whitespace-nowrap"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="whitespace-nowrap">{language === 'vi' ? 'Thêm Lịch' : 'Sync Cal'}</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer whitespace-nowrap"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="whitespace-nowrap">{language === 'vi' ? 'In Lịch' : 'Print'}</span>
                      </motion.button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Bottom Row: Smooth Day & Week Tabs */}
        <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-0.5 sm:gap-1 p-1 rounded-xl sm:rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 w-full justify-between sm:justify-start sm:w-auto">
            {days.map((d) => {
              const isSelected = viewMode === 'timeline' && selectedDay === d.dayKey;
              const label = language === 'vi' ? dayLabelsVi[d.dayKey] : dayLabelsEn[d.dayKey];
              const dateParts = d.date.split('/');
              const dateStr = dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : d.date;

              return (
                <motion.button
                  key={d.dayKey}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSelectDay(d.dayKey);
                    onViewModeChange('timeline');
                  }}
                  className={`relative flex-1 sm:flex-initial px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap z-10 shrink-0 ${
                    isSelected 
                      ? 'text-white dark:text-slate-900' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="active-nav-tab"
                      className="absolute inset-0 bg-slate-900 dark:bg-white rounded-lg shadow-sm z-[-1]"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span>{label}</span>
                  <span className={`text-[10px] font-medium hidden sm:inline ${isSelected ? 'opacity-85' : 'text-slate-400 dark:text-slate-500'}`}>
                    {dateStr}
                  </span>
                </motion.button>
              );
            })}

            {/* Full Week Tab */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('grid')}
              className={`relative flex-1 sm:flex-initial px-2 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap border-l border-slate-200 dark:border-slate-700 ml-0.5 pl-2 sm:pl-3 z-10 shrink-0 ${
                viewMode === 'grid' 
                  ? 'text-white dark:text-slate-900' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {viewMode === 'grid' && (
                <motion.div
                  layoutId="active-nav-tab"
                  className="absolute inset-0 bg-slate-900 dark:bg-white rounded-lg shadow-sm z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              <span>{language === 'vi' ? 'Tuần' : 'Week'}</span>
            </motion.button>
          </div>
        </div>

      </div>
    </header>
  );
};
