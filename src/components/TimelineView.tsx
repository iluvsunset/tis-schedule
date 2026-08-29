import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import { DayKey, Language, ScheduleItem, ScheduleData } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { VietnamTimeInfo, getDateStatus } from '../utils/vietnamTime';
import { TimelineCard } from './TimelineCard';
import { RecessIcon, LunchIcon } from './CustomSubjectIcons';

interface TimelineViewProps {
  selectedDay: DayKey;
  language: Language;
  activeFilter: string;
  searchQuery: string;
  vnTime: VietnamTimeInfo;
  scheduleData?: ScheduleData;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  selectedDay,
  language,
  activeFilter,
  searchQuery,
  vnTime,
  scheduleData
}) => {
  const currentSchedule = scheduleData || SCHEDULE_DATA;
  const dayData = currentSchedule.weekSchedule.find(d => d.dayKey === selectedDay) || currentSchedule.weekSchedule[0];

  // Determine relative day state by comparing actual calendar dates
  const dateStatus = getDateStatus(dayData.date, vnTime.dateStr);
  const isToday = dateStatus === 'today';
  const isPastDay = dateStatus === 'past';

  const matchesFilterAndSearch = (item: ScheduleItem) => {
    if (item.type === 'break') return true;
    if (activeFilter !== 'all' && item.type !== activeFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const subject = `${item.subjectVi} ${item.subjectEn}`.toLowerCase();
      const teacher = (item.teacher || '').toLowerCase();
      const note = (item.note || '').toLowerCase();
      if (!subject.includes(q) && !teacher.includes(q) && !note.includes(q)) {
        return false;
      }
    }
    return true;
  };

  const morningItems = dayData.morning.filter(matchesFilterAndSearch);
  const afternoonItems = dayData.afternoon.filter(matchesFilterAndSearch);

  const dayTitle = language === 'vi' 
    ? `${dayData.dayNameVi} • ${dayData.date}` 
    : `${dayData.dayNameEn} • ${dayData.date}`;

  // Check if this entire day is a National Holiday (e.g. Nghỉ Lễ 2/9)
  const isAllDayHoliday = dayData.morning.length > 0 && 
    dayData.morning.every(i => i.subjectVi.toLowerCase().includes('nghỉ lễ') || i.type === 'break') &&
    dayData.afternoon.every(i => i.subjectVi.toLowerCase().includes('nghỉ lễ') || i.type === 'break');

  const totalPeriods = dayData.morning.filter(i => i.type !== 'break').length + dayData.afternoon.filter(i => i.type !== 'break').length;

  const getPeriodStatus = (item: ScheduleItem) => {
    const [sh, sm] = item.startTime.split(':').map(Number);
    const [eh, em] = item.endTime.split(':').map(Number);
    const startMin = (sh || 0) * 60 + (sm || 0);
    const endMin = (eh || 0) * 60 + (em || 0);
    const currentMin = vnTime.totalMinutes;

    if (isToday) {
      const isCurrent = currentMin >= startMin && currentMin < endMin;
      const isPast = currentMin >= endMin;
      const remainingMinutes = isCurrent ? endMin - currentMin : 0;
      return { isCurrent, isPast, remainingMinutes };
    }

    if (isPastDay) {
      return { isCurrent: false, isPast: true, remainingMinutes: 0 };
    }

    // Future date
    return { isCurrent: false, isPast: false, remainingMinutes: 0 };
  };

  // Lunch break status
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
    <div className="space-y-3 sm:space-y-4">
      
      {/* Day Header Bar */}
      <motion.div 
        key={`header-${selectedDay}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass-card rounded-2xl px-4 py-2 sm:px-4.5 sm:py-2.5 shadow-2xs flex items-center justify-between"
      >
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <h2 className="text-xs sm:text-sm md:text-base font-display font-extrabold text-slate-900 dark:text-slate-100">
            {dayTitle}
          </h2>
          {isToday && (
            <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xs">
              {language === 'vi' ? 'Hôm Nay' : 'Today'}
            </span>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">• Lớp 11-TN (Phòng 504)</span>
        </div>

        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          {isAllDayHoliday ? (
            <span className="text-rose-600 dark:text-rose-400 font-bold">🇻🇳 Nghỉ Lễ</span>
          ) : (
            <span>{totalPeriods} {language === 'vi' ? 'Tiết học' : 'Periods'}</span>
          )}
        </div>
      </motion.div>

      {/* If All-Day Holiday: Show Full-Width Celebration Banner */}
      {isAllDayHoliday ? (
        <motion.div 
          key={`holiday-${selectedDay}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-6 sm:p-10 border border-rose-200/80 dark:border-rose-900/40 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 text-3xl sm:text-4xl">
            🇻🇳
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Kỳ Nghỉ Lễ Toàn Quốc' : 'National Public Holiday'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'vi' ? 'NGHỈ LỄ QUỐC KHÁNH 2/9' : 'VIETNAM NATIONAL DAY HOLIDAY'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
              {language === 'vi' 
                ? 'Toàn trường TIS nghỉ lễ theo quy định. Không có tiết học trong ngày.' 
                : 'All TIS classes are off in observance of National Day. Enjoy your holiday!'}
            </p>
          </div>
        </motion.div>
      ) : (
        /* Regular Day Morning & Afternoon Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Morning Session Column */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-sm">☀️</span>
                <span className="font-display font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {language === 'vi' ? 'Buổi Sáng (08:00 – 11:30)' : 'Morning Session (08:00 – 11:30)'}
                </span>
              </div>
            </div>

            {morningItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 glass-card rounded-2xl">
                {language === 'vi' ? 'Không có tiết học nào phù hợp bộ lọc' : 'No periods matching filter'}
              </div>
            ) : (
              morningItems.map((item, idx) => {
                if (item.type === 'break') {
                  return (
                    <motion.div 
                      key={`recess-morning-${idx}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <RecessIcon className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[11px]">{language === 'vi' ? item.subjectVi : item.subjectEn}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">• {item.note}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{item.time}</span>
                    </motion.div>
                  );
                }

                const status = getPeriodStatus(item);
                return (
                  <TimelineCard
                    key={`morning-${item.period}-${idx}`}
                    item={item}
                    language={language}
                    isCurrent={status.isCurrent}
                    isPast={status.isPast}
                    remainingMinutes={status.remainingMinutes}
                  />
                );
              })
            )}
          </div>

          {/* Afternoon Session Column */}
          <div className="space-y-2.5 sm:space-y-3">
            
            {/* Lunch Break Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                lunchStatus.isCurrent
                  ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-400/40 text-amber-900 dark:text-amber-200 shadow-sm'
                  : lunchStatus.isPast
                    ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 text-slate-400 dark:text-slate-500 line-through'
                    : 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <LunchIcon className="w-4 h-4" />
                <span className="font-bold text-xs">
                  {language === 'vi' ? dayData.lunch.titleVi : dayData.lunch.titleEn}
                </span>
                {lunchStatus.isCurrent && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase animate-pulse">
                    {language === 'vi' ? `Đang nghỉ (${lunchStatus.remainingMinutes}p)` : `Lunch (${lunchStatus.remainingMinutes}m)`}
                  </span>
                )}
              </div>
              <span className="font-mono text-xs text-amber-800 dark:text-amber-400 font-semibold">{dayData.lunch.time}</span>
            </motion.div>

            <div className="flex items-center justify-between px-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400 text-sm">☕</span>
                <span className="font-display font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {language === 'vi' ? 'Buổi Chiều (13:30 – 16:05)' : 'Afternoon Session (13:30 – 16:05)'}
                </span>
              </div>
            </div>

            {afternoonItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 glass-card rounded-2xl">
                {language === 'vi' ? 'Không có tiết học nào phù hợp bộ lọc' : 'No afternoon classes'}
              </div>
            ) : (
              afternoonItems.map((item, idx) => {
                if (item.type === 'break') {
                  return (
                    <motion.div 
                      key={`recess-afternoon-${idx}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <RecessIcon className="w-3.5 h-3.5" />
                        <span className="font-semibold text-[11px]">{language === 'vi' ? item.subjectVi : item.subjectEn}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">• {item.note}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{item.time}</span>
                    </motion.div>
                  );
                }

                const status = getPeriodStatus(item);
                return (
                  <TimelineCard
                    key={`afternoon-${item.period}-${idx}`}
                    item={item}
                    language={language}
                    isCurrent={status.isCurrent}
                    isPast={status.isPast}
                    remainingMinutes={status.remainingMinutes}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
