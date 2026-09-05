import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DayKey, Language, ScheduleItem, ScheduleData, WeekTabInfo } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { VietnamTimeInfo, getDateStatus, formatScheduleDate } from '../utils/vietnamTime';
import { listContainerVariants as containerVariants, listItemVariants as itemVariants } from '../utils/motionTokens';
import { TimelineCard } from './TimelineCard';
import { WeekSelectorButton } from './WeekSelectorButton';

interface TimelineViewProps {
  selectedDay: DayKey;
  language: Language;
  activeFilter: string;
  searchQuery: string;
  vnTime: VietnamTimeInfo;
  scheduleData?: ScheduleData;
  availableWeeks?: WeekTabInfo[];
  selectedWeekGid?: string;
  onSelectWeek?: (gid: string) => void;
  isMinimalMode?: boolean;
  onToggleMinimalMode?: () => void;
  onOpenRoomSelector?: () => void;
  onSwitchToLiveFocus?: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  selectedDay,
  language,
  activeFilter,
  searchQuery,
  vnTime,
  scheduleData,
  availableWeeks,
  selectedWeekGid,
  onSelectWeek,
  isMinimalMode,
  onToggleMinimalMode,
  onOpenRoomSelector,
  onSwitchToLiveFocus
}) => {
  const currentSchedule = scheduleData || SCHEDULE_DATA;
  const dayData = currentSchedule.weekSchedule.find(d => d.dayKey === selectedDay) || currentSchedule.weekSchedule[0];

  // Determine relative day state by comparing actual calendar dates
  const dateStatus = getDateStatus(dayData.date, vnTime.dateStr);
  const isToday = dateStatus === 'today';
  const isPastDay = dateStatus === 'past';

  const hasAnimatedRef = React.useRef(false);
  React.useEffect(() => {
    hasAnimatedRef.current = true;
  }, []);

  // Filter helper
  const filterItems = (items: ScheduleItem[]) => {
    return items.filter(item => {
      if (item.type === 'break') return true;

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = (item.subjectVi || '').toLowerCase().includes(q) || (item.subjectEn || '').toLowerCase().includes(q);
        const matchTeacher = (item.teacher || '').toLowerCase().includes(q);
        const matchRoom = (item.room || '').toLowerCase().includes(q);
        const matchClass = (item.classNameVi || '').toLowerCase().includes(q) || (item.classNameEn || '').toLowerCase().includes(q);
        const matchNote = (item.note || '').toLowerCase().includes(q);
        if (!matchSubject && !matchTeacher && !matchRoom && !matchClass && !matchNote) return false;
      }

      // Category / Type Filter
      if (activeFilter === 'all') return true;
      if (activeFilter === 'stem') {
        return ['math', 'physics', 'chemistry', 'biology', 'cs', 'science'].includes(item.type);
      }
      if (activeFilter === 'humanities') {
        return ['literature', 'english'].includes(item.type);
      }
      if (activeFilter === 'activity') {
        return ['pe', 'homeroom', 'event'].includes(item.type);
      }
      return item.type === activeFilter;
    });
  };

  const morningItems = filterItems(dayData.morning);
  const afternoonItems = filterItems(dayData.afternoon);

  // Check if entire day is a national holiday
  const isAllDayHoliday = React.useMemo(() => {
    const holidayMorning = dayData.morning.filter(i => i.type !== 'break').every(i => /nghỉ lễ/i.test(i.subjectVi) || /holiday/i.test(i.subjectEn));
    const holidayAfternoon = dayData.afternoon.filter(i => i.type !== 'break').every(i => /nghỉ lễ/i.test(i.subjectVi) || /holiday/i.test(i.subjectEn));
    return (dayData.morning.length > 0 || dayData.afternoon.length > 0) && holidayMorning && holidayAfternoon;
  }, [dayData]);

  const triggerCelebrationConfetti = (e?: React.MouseEvent) => {
    const origin = e 
      ? { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
      : { x: 0.5, y: 0.5 };

    confetti({
      particleCount: 70,
      spread: 60,
      origin,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    });
  };

  // Helper to determine active/past states of periods
  const getPeriodStatus = (item: ScheduleItem) => {
    if (!isToday) {
      return { isCurrent: false, isPast: isPastDay, remainingMinutes: 0 };
    }

    try {
      const [sh, sm] = (item.startTime || '').split(':').map(Number);
      const [eh, em] = (item.endTime || '').split(':').map(Number);
      const startMin = (sh || 0) * 60 + (sm || 0);
      const endMin = (eh || 0) * 60 + (em || 0);
      const currentMin = vnTime.totalMinutes;

      const isCurrent = currentMin >= startMin && currentMin < endMin;
      const isPast = currentMin >= endMin;
      const remainingMinutes = isCurrent ? endMin - currentMin : 0;

      return { isCurrent, isPast, remainingMinutes };
    } catch {
      return { isCurrent: false, isPast: false, remainingMinutes: 0 };
    }
  };

  // Format date display
  const formattedDate = formatScheduleDate(dayData.date) || dayData.date;
  const dayTitle = language === 'vi' 
    ? `${dayData.dayNameVi} · ${formattedDate}`
    : `${dayData.dayNameEn} · ${formattedDate}`;

  const roomName = currentSchedule.roomNameVi || `Phòng ${currentSchedule.room}`;
  const className = language === 'vi' ? currentSchedule.gradeTitleVi : currentSchedule.gradeTitleEn;

  // Lunch status calculation
  const lunchStatus = (() => {
    const startMin = 11 * 60 + 30;
    const endMin = 13 * 60 + 30;
    const currentMin = vnTime.totalMinutes;

    if (isToday) {
      const isCurrent = currentMin >= startMin && currentMin < endMin;
      const isPast = currentMin >= endMin;
      const remainingMinutes = isCurrent ? endMin - currentMin : 0;
      return { isCurrent, isPast, remainingMinutes };
    }
    if (isPastDay) return { isCurrent: false, isPast: true, remainingMinutes: 0 };
    return { isCurrent: false, isPast: false, remainingMinutes: 0 };
  })();

  return (
    <div className="space-y-4 select-none relative z-20">
      
      {/* Top Header Bar (Zero Icons, Original Color Palette) */}
      {!isMinimalMode && (
        <motion.div 
          key={`header-${selectedDay}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-card rounded-2xl px-4 py-2.5 shadow-2xs flex items-center justify-between gap-3 border border-slate-200/80 dark:border-slate-800 relative z-40"
        >
          {/* Day & Room Info */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h2 className="text-sm sm:text-base font-display font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {dayTitle}
            </h2>
            {isToday && (
              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md shadow-2xs">
                {language === 'vi' ? 'Hôm Nay' : 'Today'}
              </span>
            )}
            <button
              type="button"
              onClick={onOpenRoomSelector}
              className="text-xs text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
            >
              • {roomName} ({className})
            </button>
          </div>

          {/* Controls: Live Room Toggle & Week Selector (Zero Icons) */}
          <div className="flex items-center gap-2 shrink-0">
            {onSwitchToLiveFocus && (
              <button
                type="button"
                onClick={onSwitchToLiveFocus}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer"
                title={language === 'vi' ? 'Màn hình hiển thị 1 môn đang bắt đầu' : 'Single starting subject display'}
              >
                {language === 'vi' ? 'Phòng Trực Tiếp' : 'Live Room'}
              </button>
            )}

            {availableWeeks && availableWeeks.length > 0 && onSelectWeek && (
              <WeekSelectorButton
                availableWeeks={availableWeeks}
                selectedWeekGid={selectedWeekGid}
                onSelectWeek={onSelectWeek}
                language={language}
              />
            )}

            {onToggleMinimalMode && (
              <button
                type="button"
                onClick={onToggleMinimalMode}
                className="hidden sm:flex px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-mono uppercase bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                title="Full-screen minimal focus (F)"
              >
                Focus
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* If All-Day Holiday: Show Celebration Card (Zero Icons, Original Palette) */}
      {isAllDayHoliday ? (
        <motion.div 
          key={`holiday-${selectedDay}`}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => triggerCelebrationConfetti(e)}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-rose-200/80 dark:border-rose-900/40 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent text-center space-y-3 shadow-sm cursor-pointer select-none"
        >
          <h3 className="text-xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'vi' ? 'NGHỈ LỄ QUỐC KHÁNH 2/9' : 'VIETNAM NATIONAL DAY HOLIDAY'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
            {language === 'vi' 
              ? 'Toàn trường TIS nghỉ lễ theo quy định. Không có tiết học trong ngày. (Nhấn để mừng lễ)' 
              : 'All TIS classes are off in observance of National Day. (Tap to celebrate)'}
          </p>
        </motion.div>
      ) : (
        /* Regular Day Morning & Afternoon Grid (Zero Icons, Original Color Palette) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Morning Session Column */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                {language === 'vi' ? 'Buổi Sáng (08:00 – 11:30)' : 'Morning Session (08:00 – 11:30)'}
              </h3>
            </div>

            {morningItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 glass-card rounded-2xl">
                {language === 'vi' ? 'Không có tiết học nào phù hợp bộ lọc' : 'No periods matching filter'}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial={hasAnimatedRef.current ? false : "hidden"}
                animate="visible"
                className="space-y-2.5 sm:space-y-3"
              >
                {morningItems.map((item, idx) => {
                  const status = getPeriodStatus(item);
                  return (
                    <TimelineCard
                      key={`morning-${item.period}-${idx}`}
                      item={item}
                      language={language}
                      isCurrent={status.isCurrent}
                      isPast={status.isPast}
                      remainingMinutes={status.remainingMinutes}
                      variants={itemVariants}
                    />
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Afternoon Session Column */}
          <div className="space-y-2.5 sm:space-y-3">
            
            {/* Lunch Break Bar (Zero Icons, Original Amber Palette) */}
            <motion.div 
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                lunchStatus.isCurrent
                  ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-400/40 text-amber-900 dark:text-amber-200 shadow-sm font-bold'
                  : lunchStatus.isPast
                    ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 text-slate-400 dark:text-slate-500 line-through'
                    : 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs">
                  {language === 'vi' ? dayData.lunch.titleVi : dayData.lunch.titleEn}
                </span>
                {lunchStatus.isCurrent && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                    {lunchStatus.remainingMinutes}p
                  </span>
                )}
              </div>
              <span className="font-mono text-xs font-semibold">{dayData.lunch.time}</span>
            </motion.div>

            <div className="flex items-center justify-between px-1 pt-1">
              <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                {language === 'vi' ? 'Buổi Chiều (13:30 – 16:05)' : 'Afternoon Session (13:30 – 16:05)'}
              </h3>
            </div>

            {afternoonItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 glass-card rounded-2xl">
                {language === 'vi' ? 'Không có tiết học buổi chiều' : 'No afternoon classes'}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial={hasAnimatedRef.current ? false : "hidden"}
                animate="visible"
                className="space-y-2.5 sm:space-y-3"
              >
                {afternoonItems.map((item, idx) => {
                  const status = getPeriodStatus(item);
                  return (
                    <TimelineCard
                      key={`afternoon-${item.period}-${idx}`}
                      item={item}
                      language={language}
                      isCurrent={status.isCurrent}
                      isPast={status.isPast}
                      remainingMinutes={status.remainingMinutes}
                      variants={itemVariants}
                    />
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
