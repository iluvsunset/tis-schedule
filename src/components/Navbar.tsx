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
  School
} from './icons';
import { Language, ViewMode, DayKey, ScheduleData, INITIAL_CLASSES } from '../types/schedule';
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
  scheduleData?: ScheduleData | null;
  isMinimalMode?: boolean;
  viewType?: 'room' | 'class';
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
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
  isMinimalMode: _isMinimalMode,
  viewType = 'class'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [notifActive, setNotifActive] = useState(false);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifActive(isNotificationEnabled());
  }, []);

  const days = (scheduleData || SCHEDULE_DATA).weekSchedule;
  const matchedClass = INITIAL_CLASSES.find(c => c.id === scheduleData?.classId) || 
                       INITIAL_CLASSES.find(c => c.nameVi === scheduleData?.gradeTitleVi) ||
                       INITIAL_CLASSES.find(c => c.room === scheduleData?.room);
  const currentClassName = language === 'vi' 
    ? (matchedClass?.nameVi || scheduleData?.gradeTitleVi || (scheduleData ? 'Lớp 11-TN' : 'Chưa xác định')) 
    : (matchedClass?.nameEn || scheduleData?.gradeTitleEn || (scheduleData ? 'Grade 11-TN' : 'Not Found'));
  const currentRoom = scheduleData?.room || '504';
  const currentTeacher = scheduleData?.homeroomTeacher?.name || (scheduleData ? 'Cô Tiềng' : '—');

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

  return (
    <header className="sticky top-0 z-50 no-print pt-[max(0.25rem,env(safe-area-inset-top,0px))] pb-2 sm:pb-3">
      <div className="od-glass rounded-3xl p-2.5 sm:p-3 flex flex-col gap-2 sm:gap-2.5 border-[1.5px] border-[var(--border)] shadow-puffy">
        
        {/* Top Row: Left Brand/Class Info & Right Quick Action Buttons */}
        <div className="flex items-center justify-between gap-2 w-full">
          
          {/* Left: TIS Logo, Interactive Class Switcher & Live Clock */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* TIS Logo Button */}
            <motion.button 
              whileTap={{ scale: 0.94 }}
              onClick={onOpenClassModal}
              title={language === 'vi' ? "Đổi lớp học" : "Change class"}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[var(--surface-solid)] p-1.5 shadow-xs border-[1.5px] border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden cursor-pointer transition hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]"
            >
              {!logoError ? (
                <img 
                  src="/tis-logo.png" 
                  alt="TIS Logo" 
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-display font-black text-[var(--fg)] text-xs">TIS</span>
              )}
            </motion.button>

            {/* Interactive Room Number Switcher */}
            <div className="min-w-0">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onOpenRoomSelector || onOpenClassModal}
                className="flex items-center gap-1.5 cursor-pointer group text-left max-w-full"
                title={language === 'vi' ? "Nhấn để nhập hoặc đổi số phòng học" : "Click to enter or change room number"}
              >
                <h1 className="font-display font-black text-sm sm:text-base text-[var(--fg)] tracking-tight leading-none truncate group-hover:text-[var(--accent)] transition-colors">
                  {language === 'vi' ? (scheduleData?.roomNameVi || `Phòng ${currentRoom}`) : (scheduleData?.roomNameEn || `Room ${currentRoom}`)}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[var(--surface-solid)] border border-[var(--border)] text-[var(--fg-secondary)] group-hover:border-[var(--border-hover)] transition-colors shrink-0">
                  {currentClassName}
                </span>
                <span className="text-[11px] font-bold text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition hidden xs:inline">
                  [{language === 'vi' ? 'Đổi' : 'Change'}]
                </span>
              </motion.button>

              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-[var(--fg-muted)] font-semibold truncate">
                <span className="truncate hidden xs:inline">{language === 'vi' ? 'GV' : 'HR'}: {currentTeacher}</span>
                <span className="text-[var(--fg-faint)] hidden xs:inline">•</span>
                <span className="font-mono text-[11px] sm:text-xs font-bold text-[var(--fg)] tabular-nums shrink-0" suppressHydrationWarning>
                  {vnTime.timeStr}
                  <span className="text-[var(--accent)] hidden xs:inline" suppressHydrationWarning>:{String(vnTime.seconds).padStart(2, '0')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Search Bar (Only shown in Class View on sm+ screens) */}
            {viewType === 'class' && (
              <div className="hidden sm:block relative w-36 sm:w-44 md:w-52 focus-within:w-56 transition-all duration-200">
                <Search className="w-3.5 h-3.5 text-[var(--fg-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={language === 'vi' ? "Tìm môn..." : "Search..."}
                  className="w-full pl-8 pr-7 py-1.5 rounded-2xl bg-[var(--surface-solid)] border-[1.5px] border-[var(--border)] focus:bg-[var(--surface-hover)] focus:border-[var(--accent)] text-xs transition-all outline-none text-[var(--fg)] placeholder-[var(--fg-faint)] font-medium shadow-xs"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Quick Notification Bell Toggle (Desktop / sm+) */}
            {isNotificationSupported() && (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleToggleNotification}
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-2xl border-[1.5px] transition-all cursor-pointer items-center justify-center shadow-xs ${
                  notifActive 
                    ? 'bg-[var(--peach)]/40 border-[var(--accent)] text-[var(--accent)]' 
                    : 'bg-[var(--surface-solid)] border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--border-hover)]'
                }`}
                title={notifActive 
                  ? (language === 'vi' ? 'Đã bật nhắc nhở mỗi tối (21:00)' : 'Evening reminders active') 
                  : (language === 'vi' ? 'Bật nhắc nhở lịch học mỗi tối' : 'Enable reminders')}
              >
                {notifActive ? <BellRing className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" /> : <Bell className="w-3.5 h-3.5" />}
              </motion.button>
            )}


            {/* Floating Action Menu Trigger */}
            <div className="relative z-[110]" ref={menuRef}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 sm:p-2 rounded-2xl border-[1.5px] transition-all cursor-pointer flex items-center justify-center shadow-xs ${
                  isMenuOpen 
                    ? 'bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]' 
                    : 'bg-[var(--surface-solid)] border-[var(--border)] text-[var(--fg-secondary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)] hover:text-[var(--fg)]'
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
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 z-[120] bg-[var(--surface-solid)] border-[1.5px] border-[var(--border)] rounded-[28px] shadow-puffy p-3 divide-y divide-[var(--border)] text-xs space-y-2.5 backdrop-blur-xl"
                  >
                    
                    {/* Switch Class */}
                    <div className="pb-1">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onOpenClassModal?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-[var(--fg)] hover:bg-[var(--surface-active)] transition cursor-pointer"
                      >
                        <School className="w-4 h-4 text-[var(--accent)] shrink-0" />
                        <div className="text-left min-w-0 flex-1">
                          <div className="whitespace-nowrap font-bold text-xs">{language === 'vi' ? 'Đổi Lớp Học' : 'Switch Class'}</div>
                          <div className="text-[11px] text-[var(--fg-muted)] font-normal truncate">{currentClassName}</div>
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
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-[var(--fg)] hover:bg-[var(--surface-active)] transition cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-[var(--fg-secondary)] shrink-0" />
                        <span className="whitespace-nowrap font-bold text-xs">{language === 'vi' ? 'Danh sách Giáo Viên' : 'Teacher Directory'}</span>
                      </motion.button>
                    </div>


                    {/* Language Toggle */}
                    <div className="pt-2.5 flex items-center justify-between px-3 py-1">
                      <div className="flex items-center gap-2.5 text-[var(--fg)] font-bold">
                        <Globe className="w-4 h-4 text-[var(--fg-secondary)] shrink-0" />
                        <span className="whitespace-nowrap text-xs">{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
                      </div>
                      <div className="flex rounded-2xl bg-[var(--bg-subtle)] p-0.5 border border-[var(--border)] shrink-0">
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onLanguageChange('vi')}
                          className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer transition ${language === 'vi' ? 'bg-[var(--surface-solid)] text-[var(--fg)] shadow-xs' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'}`}
                        >
                          VIE
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => onLanguageChange('en')}
                          className={`px-3 py-1 rounded-xl text-[10px] font-black cursor-pointer transition ${language === 'en' ? 'bg-[var(--surface-solid)] text-[var(--fg)] shadow-xs' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'}`}
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
                        className="btn-cozy flex items-center justify-center gap-2 py-2.5 px-2 rounded-2xl font-bold text-xs cursor-pointer whitespace-nowrap"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                        <span className="whitespace-nowrap">{language === 'vi' ? 'Thêm Lịch' : 'Sync Cal'}</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="btn-cozy flex items-center justify-center gap-2 py-2.5 px-2 rounded-2xl font-bold text-xs cursor-pointer whitespace-nowrap"
                      >
                        <Printer className="w-3.5 h-3.5 text-[var(--fg-secondary)] shrink-0" />
                        <span className="whitespace-nowrap">{language === 'vi' ? 'In Lịch' : 'Print'}</span>
                      </motion.button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Bottom Row: Floating Day & Week Capsule (Spacious Desktop Layout) */}
        {viewType === 'class' && (
          <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-subtle)] border-[1.5px] border-[var(--border)] w-full shadow-xs">
              {days.map((d) => {
                const isSelected = viewMode === 'timeline' && selectedDay === d.dayKey;
                const label = language === 'vi' ? dayLabelsVi[d.dayKey] : dayLabelsEn[d.dayKey];
                const dateParts = d.date.split('/');
                const dateStr = dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : d.date;

                return (
                  <motion.button
                    key={d.dayKey}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      onSelectDay(d.dayKey);
                      onViewModeChange('timeline');
                    }}
                    className={`relative flex-1 px-2.5 sm:px-4 lg:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap z-10 shrink-0 ${
                      isSelected 
                        ? 'text-[var(--bg)] font-black' 
                        : 'text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-nav-tab"
                        className="absolute inset-0 bg-[var(--fg)] rounded-xl shadow-xs z-[-1]"
                        transition={{ type: "spring", stiffness: 480, damping: 34 }}
                      />
                    )}
                    <span>{label}</span>
                    <span className={`text-[11px] font-mono tabular-nums hidden sm:inline ${isSelected ? 'opacity-90' : 'text-[var(--fg-muted)]'}`}>
                      {dateStr}
                    </span>
                  </motion.button>
                );
              })}

              {/* Full Week Tab */}
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => onViewModeChange('grid')}
                className={`relative flex-1 sm:flex-initial px-3 sm:px-4 lg:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border-l border-[var(--border)] ml-1 pl-2.5 sm:pl-4 z-10 shrink-0 ${
                  viewMode === 'grid' 
                    ? 'text-[var(--bg)] font-black' 
                    : 'text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                }`}
              >
                {viewMode === 'grid' && (
                  <motion.div
                    layoutId="active-nav-tab"
                    className="absolute inset-0 bg-[var(--fg)] rounded-xl shadow-xs z-[-1]"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span>{language === 'vi' ? 'Toàn Tuần' : 'All Week'}</span>
              </motion.button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
