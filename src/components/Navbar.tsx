import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MoreVertical, RefreshCw, Palette, CalendarPlus, Printer, Users, Globe, Bell, BellRing, Clock } from 'lucide-react';
import { Language, ThemeKey, ViewMode, DayKey } from '../types/schedule';
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
  isSyncing?: boolean;
  onSyncLive?: () => void;
  onOpenTeacherModal: () => void;
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
  isSyncing,
  onSyncLive,
  onOpenTeacherModal
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [notifActive, setNotifActive] = useState(isNotificationEnabled());
  const [testSent, setTestSent] = useState(false);
  const [testCountdown, setTestCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const days = SCHEDULE_DATA.weekSchedule;

  const dayLabelsVi: Record<DayKey, string> = { mon: 'T2', tue: 'T3', wed: 'T4', thu: 'T5', fri: 'T6' };
  const dayLabelsEn: Record<DayKey, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri' };

  const themeLabels: Record<ThemeKey, { label: string; dot: string }> = {
    sakura: { label: "🌸 Sakura", dot: "bg-rose-400" },
    mint: { label: "🌿 Matcha", dot: "bg-emerald-400" },
    lavender: { label: "🍇 Lavender", dot: "bg-purple-400" },
    peach: { label: "🍑 Peach", dot: "bg-orange-400" }
  };

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
        setTestSent(true);
        setTimeout(() => setTestSent(false), 3500);
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
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-50 no-print mb-2.5"
    >
      <div className="glass-card border border-white/80 rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-soft flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: TIS Logo, Class Info & Live Vietnam Clock */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* TIS Logo */}
          <motion.div 
            whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-0.5 shadow-sm border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
          >
            {!logoError ? (
              <img 
                src="/tis-logo.png" 
                alt="TIS Logo" 
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="font-display font-black text-rose-500 text-xs">TIS</span>
            )}
          </motion.div>

          {/* Class & Room */}
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-bold text-sm sm:text-base text-slate-800 tracking-tight leading-none">
                Lớp 11-TN
              </h1>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                P.504
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              GVQN: Cô Tiềng
            </div>
          </div>

          {/* Live Vietnam Time Badge */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 px-2 py-0.8 rounded-lg bg-rose-50 border border-rose-200/70 text-rose-700 text-xs font-mono font-bold ml-1 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>{vnTime.timeWithSeconds}</span>
          </motion.div>
        </div>

        {/* Center: Unified Day & Week Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 overflow-x-auto max-w-full relative">
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
                  isSelected ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="active-nav-tab"
                    className="absolute inset-0 bg-rose-500 rounded-lg shadow-cute-pink z-[-1]"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span>{label}</span>
                <span className={`text-[10px] font-normal ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                  {dateStr}
                </span>
              </button>
            );
          })}

          {/* Full Week Tab */}
          <button
            onClick={() => onViewModeChange('grid')}
            className={`relative px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap border-l border-slate-200 ml-0.5 pl-2 z-10 ${
              viewMode === 'grid' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {viewMode === 'grid' && (
              <motion.div
                layoutId="active-nav-tab"
                className="absolute inset-0 bg-rose-500 rounded-lg shadow-cute-pink z-[-1]"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {language === 'vi' ? 'Cả Tuần' : 'Full Week'}
          </button>
        </div>

        {/* Right: Quick Search, Notif Bell & Floating Action Menu */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto md:ml-0">
          
          {/* Quick Notification Bell Toggle */}
          {isNotificationSupported() && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleNotification}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                notifActive 
                  ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-2xs' 
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title={notifActive 
                ? (language === 'vi' ? 'Đã bật nhắc nhở mỗi tối (21:00)' : 'Evening reminders active (9:00 PM)') 
                : (language === 'vi' ? 'Bật nhắc nhở lịch học mỗi tối' : 'Enable evening reminders')}
            >
              {notifActive ? <BellRing className="w-3.5 h-3.5 animate-gentle text-amber-500" /> : <Bell className="w-3.5 h-3.5" />}
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
              className="w-full pl-7 pr-6 py-1 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-300 text-xs transition-all outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
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
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
              title="Tùy chọn & Tiện ích"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            {/* Elevated Floating Menu Panel */}
            <AnimatePresence>
              {isMenuOpen && (
                <>
                  {/* Full-Screen Frosted Glass Ambient Backdrop Blur */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] bg-slate-950/25 backdrop-blur-md transition-all duration-200" 
                    onClick={() => setIsMenuOpen(false)}
                  />

                  {/* Floating Card Panel */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    className="absolute right-0 top-full mt-2 w-64 z-[100] bg-white/95 backdrop-blur-xl border border-white rounded-3xl shadow-2xl p-2.5 divide-y divide-slate-100 text-xs ring-1 ring-black/5"
                  >
                    
                    {/* Faculty Directory */}
                    <div className="pb-2">
                      <motion.button
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onOpenTeacherModal();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{language === 'vi' ? 'Danh sách Giáo Viên' : 'Faculty Directory'}</span>
                      </motion.button>
                    </div>

                    {/* Evening Browser Notifications with 5s Delay Test */}
                    <div className="py-2">
                      <div className="flex items-center justify-between px-3 py-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-amber-500" />
                          <span>{language === 'vi' ? 'Nhắc lịch tối (21h-22h)' : 'Evening Reminder (9-10 PM)'}</span>
                        </span>
                        <button
                          onClick={handleToggleNotification}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                            notifActive ? 'bg-amber-500' : 'bg-slate-300'
                          }`}
                        >
                          <motion.div
                            animate={{ x: notifActive ? 16 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-4 h-4 rounded-full bg-white shadow-sm"
                          />
                        </button>
                      </div>

                      {notifActive && (
                        <div className="mt-1 px-2.5">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={trigger5sTestNotification}
                            className={`w-full py-1.5 px-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border text-[11px] font-bold ${
                              testCountdown !== null 
                                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                                : testSent 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                                  : 'bg-amber-50 border-amber-200/80 text-amber-800 hover:bg-amber-100'
                            }`}
                          >
                            {testCountdown !== null ? (
                              <>
                                <Clock className="w-3 h-3 text-rose-500 animate-spin" />
                                <span>{language === 'vi' ? `⏳ Sẽ gửi sau ${testCountdown}s... (bạn có thể đổi tab)` : `⏳ Sending in ${testCountdown}s...`}</span>
                              </>
                            ) : testSent ? (
                              <span>{language === 'vi' ? '✓ Đã gửi thông báo thành công!' : '✓ Notification Sent!'}</span>
                            ) : (
                              <>
                                <Bell className="w-3 h-3 text-amber-600" />
                                <span>{language === 'vi' ? '🔔 Gửi thử (Hẹn 5 giây)' : '🔔 Test (5s Delay)'}</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Google Sheet Sync */}
                    {onSyncLive && (
                      <div className="py-2">
                        <motion.button
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onSyncLive();
                            setIsMenuOpen(false);
                          }}
                          disabled={isSyncing}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-2xl font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
                        >
                          <RefreshCw className={`w-4 h-4 text-emerald-500 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? (language === 'vi' ? 'Đang đồng bộ...' : 'Syncing...') : (language === 'vi' ? 'Đồng bộ Google Sheet' : 'Sync Google Sheet')}</span>
                        </motion.button>
                      </div>
                    )}

                    {/* Color Theme Selector */}
                    <div className="py-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-pink-500" />
                        <span>{language === 'vi' ? 'Bảng màu' : 'Color Theme'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 px-1 mt-1">
                        {(['sakura', 'mint', 'lavender', 'peach'] as ThemeKey[]).map((t) => (
                          <motion.button
                            key={t}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              onThemeChange(t);
                              setIsMenuOpen(false);
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                              theme === t ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200 shadow-2xs' : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${themeLabels[t].dot}`}></span>
                            <span>{themeLabels[t].label.split(' ')[1]}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Language Toggle */}
                    <div className="py-2 flex items-center justify-between px-3">
                      <span className="text-slate-600 font-semibold flex items-center gap-1.5 text-xs">
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        <span>{language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
                      </span>
                      <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 relative">
                        <button
                          onClick={() => onLanguageChange('vi')}
                          className={`relative z-10 px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            language === 'vi' ? 'text-slate-800' : 'text-slate-500'
                          }`}
                        >
                          {language === 'vi' && (
                            <motion.div
                              layoutId="active-lang-pill"
                              className="absolute inset-0 bg-white rounded-lg shadow-2xs z-[-1]"
                              transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            />
                          )}
                          VIE
                        </button>
                        <button
                          onClick={() => onLanguageChange('en')}
                          className={`relative z-10 px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            language === 'en' ? 'text-slate-800' : 'text-slate-500'
                          }`}
                        >
                          {language === 'en' && (
                            <motion.div
                              layoutId="active-lang-pill"
                              className="absolute inset-0 bg-white rounded-lg shadow-2xs z-[-1]"
                              transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            />
                          )}
                          ENG
                        </button>
                      </div>
                    </div>

                    {/* Export Calendar & Print */}
                    <div className="pt-2 flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          exportScheduleToICS();
                          setIsMenuOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-2xl bg-purple-50 text-purple-700 font-bold text-xs hover:bg-purple-100 transition cursor-pointer shadow-2xs"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Thêm Lịch' : 'Export .ics'}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          window.print();
                          setIsMenuOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'In Lịch' : 'Print'}</span>
                      </motion.button>
                    </div>

                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </motion.header>
  );
};
