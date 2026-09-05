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
      colors: ['#c5a869', '#ffffff', '#e2d4b7', '#a38954']
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

  const roomName = currentSchedule.roomNameEn || `Room ${currentSchedule.room}`;
  const floorName = language === 'vi' ? (currentSchedule.floorVi || 'Tầng 5') : (currentSchedule.floorEn || 'Floor 5');
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
    <div className="space-y-6 select-none relative z-20">
      
      {/* Top Venue & Date Navigation (Aman / Hotel Hoa Nắng Luxury Editorial Header - Zero Icons) */}
      {!isMinimalMode && (
        <motion.div 
          key={`header-${selectedDay}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-white/[0.08] bg-[#0f1016]/90 backdrop-blur-xl px-5 py-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-40"
        >
          {/* Venue & Date Meta */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-serif font-semibold text-white tracking-tight">
                {dayTitle}
              </h2>
              {isToday && (
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#c5a869] text-black rounded">
                  {language === 'vi' ? 'Hôm nay' : 'Today'}
                </span>
              )}
            </div>

            {/* Clickable Room Venue Badge */}
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <button
                type="button"
                onClick={onOpenRoomSelector}
                className="hover:text-[#c5a869] transition cursor-pointer text-left"
                title={language === 'vi' ? 'Nhấn để đổi phòng' : 'Click to change room'}
              >
                <span className="text-[#c5a869] font-medium">{roomName}</span>
                <span className="text-white/30"> · </span>
                <span>{floorName}</span>
                <span className="text-white/30"> · </span>
                <span>{className}</span>
              </button>
            </div>
          </div>

          {/* Controls: Week Selector & Live Room Focus Mode (Zero Icons) */}
          <div className="flex items-center gap-2 shrink-0">
            {onSwitchToLiveFocus && (
              <button
                type="button"
                onClick={onSwitchToLiveFocus}
                className="px-3.5 py-1.5 rounded-xl border border-[#c5a869]/40 bg-[#c5a869]/10 hover:bg-[#c5a869]/20 text-[#c5a869] text-xs font-mono uppercase tracking-wider font-semibold transition cursor-pointer"
                title={language === 'vi' ? 'Màn hình hiển thị 1 môn đang bắt đầu' : 'Screen showing 1 starting subject'}
              >
                {language === 'vi' ? 'Trực tiếp phòng' : 'Live Room'}
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
                className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-mono uppercase text-white/60 hover:text-white transition cursor-pointer hidden sm:block"
                title="Full-screen minimal focus (F)"
              >
                Focus
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* If All-Day Holiday: Show Editorial Celebration Card (Zero Icons) */}
      {isAllDayHoliday ? (
        <motion.div 
          key={`holiday-${selectedDay}`}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => triggerCelebrationConfetti(e)}
          className="rounded-3xl p-8 sm:p-14 border border-[#c5a869]/30 bg-gradient-to-b from-[#c5a869]/10 via-transparent to-transparent text-center space-y-4 shadow-xl cursor-pointer select-none"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c5a869]">
            National Observance
          </div>
          <h3 className="text-2xl sm:text-4xl font-serif text-white tracking-tight font-normal">
            {language === 'vi' ? 'NGHỈ LỄ QUỐC KHÁNH 2/9' : 'VIETNAM NATIONAL DAY HOLIDAY'}
          </h3>
          <p className="text-xs sm:text-sm font-mono text-white/50 max-w-md mx-auto">
            {language === 'vi' 
              ? 'Toàn trường TIS nghỉ lễ theo quy định. Không có tiết học trong ngày. (Nhấn để mừng lễ)' 
              : 'All TIS classes are off in observance of National Day. (Tap to celebrate)'}
          </p>
        </motion.div>
      ) : (
        /* Regular Day Morning & Afternoon Grid (Zero Icons, Aman Architectural Elegance) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Morning Session Column */}
          <div className="space-y-3.5">
            <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-2 px-1">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c5a869] font-semibold">
                {language === 'vi' ? 'Buổi Sáng' : 'Morning Session'}
              </span>
              <span className="text-xs font-mono text-white/40">
                08:00 — 11:30
              </span>
            </div>

            {morningItems.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-white/30 border border-white/[0.05] rounded-2xl">
                {language === 'vi' ? 'Không có tiết học nào phù hợp bộ lọc' : 'No periods matching filter'}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial={hasAnimatedRef.current ? false : "hidden"}
                animate="visible"
                className="space-y-3"
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
          <div className="space-y-3.5">
            
            {/* Midday Lunch Interval Block (Zero Icons) */}
            <div 
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono transition ${
                lunchStatus.isCurrent
                  ? 'bg-[#c5a869]/15 border-[#c5a869]/50 text-white shadow-lg'
                  : lunchStatus.isPast
                    ? 'border-white/[0.05] text-white/30 line-through'
                    : 'bg-white/[0.02] border-white/[0.08] text-white/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-widest text-[#c5a869] font-semibold">
                  {language === 'vi' ? dayData.lunch.titleVi : dayData.lunch.titleEn}
                </span>
                {lunchStatus.isCurrent && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#c5a869] text-black font-bold">
                    {language === 'vi' ? `${lunchStatus.remainingMinutes}p` : `${lunchStatus.remainingMinutes}m`}
                  </span>
                )}
              </div>
              <span className="tabular-nums text-white/50">{dayData.lunch.time}</span>
            </div>

            <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-2 px-1 pt-1">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c5a869] font-semibold">
                {language === 'vi' ? 'Buổi Chiều' : 'Afternoon Session'}
              </span>
              <span className="text-xs font-mono text-white/40">
                13:30 — 16:05
              </span>
            </div>

            {afternoonItems.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-white/30 border border-white/[0.05] rounded-2xl">
                {language === 'vi' ? 'Không có tiết học buổi chiều' : 'No afternoon classes'}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial={hasAnimatedRef.current ? false : "hidden"}
                animate="visible"
                className="space-y-3"
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
