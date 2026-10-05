import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DayKey, Language, ScheduleItem, ScheduleData, WeekTabInfo } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { VietnamTimeInfo, getDateStatus, formatScheduleDate } from '../utils/vietnamTime';
import { listContainerVariants as containerVariants, listItemVariants as itemVariants } from '../utils/motionTokens';
import { TimelineCard } from './TimelineCard';
import { WeekSelectorButton } from './WeekSelectorButton';
import { Sun, Sunset, Coffee, Utensils, Sparkles } from './icons';

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
  onOpenRoomSelector: _onOpenRoomSelector,
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

  // Lesson counts (excluding breaks)
  const morningLessons = morningItems.filter(i => i.type !== 'break').length;
  const afternoonLessons = afternoonItems.filter(i => i.type !== 'break').length;
  const totalLessons = morningLessons + afternoonLessons;

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
      particleCount: 75,
      spread: 70,
      origin,
      colors: ['#d4674a', '#f7e7a9', '#d3e3c4', '#f6d5d8', '#d4e4ea']
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

  // Lunch status calculation
  const lunchStatus = (() => {
    const [lsh, lsm] = (dayData.lunch?.startTime || '11:30').split(':').map(Number);
    const [leh, lem] = (dayData.lunch?.endTime || '13:30').split(':').map(Number);
    const startMin = (lsh || 11) * 60 + (lsm || 30);
    const endMin = (leh || 13) * 60 + (lem || 30);
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
    <div className="space-y-5 sm:space-y-6 select-none relative z-20 w-full">
      
      {/* Prominent, Adorable Day Status / Greeting Banner */}
      {!isMinimalMode && (
        <motion.div 
          key={`banner-${selectedDay}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl p-4 sm:p-6 pt-5 sm:pt-6 border-[1.5px] border-[var(--border)] shadow-puffy flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
        >
          {/* Soft decorative ambient glow in top corner */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#fef3c7]/40 blur-2xl pointer-events-none" />

          {/* Left: Day Title, Date */}
          <div className="space-y-1.5 min-w-0 relative z-10 pt-1">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--fg)] tracking-tight leading-snug">
              {dayTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[var(--fg-muted)] font-semibold flex items-center gap-2">
              <span>{language === 'vi' ? `Tổng cộng ${totalLessons} tiết học trong ngày` : `${totalLessons} total lessons today`}</span>
              {isToday && (
                <>
                  <span>•</span>
                  <span className="text-[var(--accent)] font-bold">{vnTime.timeStr} (UTC+7)</span>
                </>
              )}
            </p>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0 relative z-10">
            {/* Week Selector Button if available */}
            {availableWeeks && availableWeeks.length > 0 && onSelectWeek && (
              <WeekSelectorButton
                availableWeeks={availableWeeks}
                selectedWeekGid={selectedWeekGid}
                onSelectWeek={onSelectWeek}
                language={language}
              />
            )}

            {/* Live Room Switcher Button */}
            {onSwitchToLiveFocus && (
              <button
                type="button"
                onClick={onSwitchToLiveFocus}
                className="btn-cozy px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold text-[var(--fg)] hover:text-[var(--accent)] transition cursor-pointer shadow-xs flex items-center gap-1.5"
                title={language === 'vi' ? 'Màn hình hiển thị 1 môn đang bắt đầu' : 'Single starting subject display'}
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{language === 'vi' ? 'Phòng Trực Tiếp' : 'Live Room'}</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* If All-Day Holiday: Show Celebration Card */}
      {isAllDayHoliday ? (
        <motion.div 
          key={`holiday-${selectedDay}`}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => triggerCelebrationConfetti(e)}
          className="bg-white rounded-3xl p-8 sm:p-12 border-[1.5px] border-[var(--border)] bg-gradient-to-br from-[#ffedd5]/40 via-[#fef3c7]/30 to-white text-center space-y-3.5 shadow-puffy cursor-pointer select-none"
        >
          <Sparkles className="w-9 h-9 text-[var(--accent)] mx-auto animate-pulse" />
          <h3 className="text-xl sm:text-3xl font-display font-black text-[var(--fg)] tracking-tight">
            {language === 'vi' ? 'NGHỈ LỄ QUỐC KHÁNH 2/9' : 'VIETNAM NATIONAL DAY HOLIDAY'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--fg-secondary)] font-medium max-w-md mx-auto">
            {language === 'vi' 
              ? 'Toàn trường TIS nghỉ lễ theo quy định. Không có tiết học trong ngày. (Nhấn để mừng lễ ✨)' 
              : 'All TIS classes are off in observance of National Day. (Tap to celebrate ✨)'}
          </p>
        </motion.div>
      ) : (
        /* Regular Day Morning & Afternoon Bento Grid (Spacious, Expansive 2-Column Desktop) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-start w-full min-w-0">
          
          {/* Column 1 (Left): Morning Session Section */}
          <div className="bg-white rounded-3xl p-3 xs:p-4 sm:p-6 border-[1.5px] border-[var(--border)] shadow-puffy flex flex-col gap-3 sm:gap-4 min-w-0 w-full overflow-hidden">
            
            {/* Morning Header: Sun Icon & 07:40 - 11:30 */}
            <div className="flex items-center justify-between px-1 pb-3 border-b border-[var(--border)]/70">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-[#fef3c7] flex items-center justify-center text-[#92400e] shadow-xs shrink-0">
                  <Sun className="w-4.5 h-4.5 text-[#d97706]" />
                </div>
                <h3 className="font-display font-black text-base sm:text-lg text-[var(--fg)] tracking-tight">
                  {language === 'vi' ? 'Buổi Sáng' : 'Morning Session'}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono tabular-nums bg-[#fef3c7] text-[#92400e] border border-[#fde68a] shadow-xs">
                07:40 – 11:30
              </span>
            </div>

            {morningItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--fg-muted)] rounded-2xl border-[1.5px] border-dashed border-[var(--border)] bg-[#faf8f2] font-medium">
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
                      vnTime={vnTime}
                      variants={itemVariants}
                    />
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Column 2 (Right): Lunch Break Connector + Afternoon Session Section */}
          <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8">

            {/* Standalone Lunch Break Connector Card: Cozy Café Styling (11:30 – 13:30) */}
            <motion.div 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -1.5, transition: { duration: 0.18 } }}
              className={`p-4 sm:p-5 rounded-3xl border-[1.5px] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 select-none card-cozy-interactive ${
                lunchStatus.isCurrent
                  ? 'bg-gradient-to-r from-[#fffbeb] via-[#fef3c7] to-[#fff7ed] border-[var(--accent)] card-current-glow ring-2 ring-[var(--accent)]/20 shadow-md text-[var(--fg)]'
                  : lunchStatus.isPast
                    ? 'bg-white/80 border-[var(--border)] text-[var(--fg-faint)] opacity-70 shadow-xs'
                    : 'bg-white border-[var(--border)] text-[var(--fg-secondary)] shadow-puffy hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#fef3c7] text-[#92400e] border border-[#fde68a] flex items-center justify-center shadow-xs shrink-0">
                  {lunchStatus.isCurrent ? (
                    <Utensils className="w-5 h-5 text-[var(--accent)] animate-pulse" />
                  ) : (
                    <Coffee className="w-5 h-5 text-[#92400e]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-black text-sm sm:text-base text-[var(--fg)] tracking-tight truncate">
                      {language === 'vi' ? dayData.lunch.titleVi : dayData.lunch.titleEn}
                    </span>
                    {lunchStatus.isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full font-mono font-black text-[11px] bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa] shadow-xs tabular-nums shrink-0">
                        {language === 'vi' ? `Còn ${lunchStatus.remainingMinutes}p` : `${lunchStatus.remainingMinutes}m left`}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-[var(--fg-muted)] font-medium mt-0.5 truncate">
                    {language === 'vi' 
                      ? 'Giờ ăn trưa, nạp năng lượng & nghỉ ngơi tại trường' 
                      : 'Lunch break & rest time at school'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right sm:self-center">
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tabular-nums border shadow-xs inline-block ${
                  lunchStatus.isCurrent 
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : lunchStatus.isPast 
                      ? 'bg-[var(--bg-subtle)] text-[var(--fg-faint)] border-[var(--border)] line-through'
                      : 'bg-[#fff8f0] text-[var(--accent)] border-[var(--border)]'
                }`}>
                  11:30 – 13:30
                </span>
              </div>
            </motion.div>

            {/* Afternoon Session Section */}
            <div className="bg-white rounded-3xl p-3 xs:p-4 sm:p-6 border-[1.5px] border-[var(--border)] shadow-puffy flex flex-col gap-3 sm:gap-4 min-w-0 w-full overflow-hidden">
              
              {/* Afternoon Header: Sunset Icon & 13:30 - 16:05 */}
              <div className="flex items-center justify-between px-1 pb-3 border-b border-[var(--border)]/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-[#e0f2fe] flex items-center justify-center text-[#0369a1] shadow-xs shrink-0">
                    <Sunset className="w-4.5 h-4.5 text-[#0284c7]" />
                  </div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[var(--fg)] tracking-tight">
                    {language === 'vi' ? 'Buổi Chiều' : 'Afternoon Session'}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono tabular-nums bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd] shadow-xs">
                  13:30 – 16:05
                </span>
              </div>

              {afternoonItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--fg-muted)] rounded-2xl border-[1.5px] border-dashed border-[var(--border)] bg-[#faf8f2] font-medium">
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
                        vnTime={vnTime}
                        variants={itemVariants}
                      />
                    );
                  })}
                </motion.div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
