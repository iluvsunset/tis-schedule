import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Calendar } from 'lucide-react';
import { DayKey, Language, ScheduleItem } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { VietnamTimeInfo } from '../utils/vietnamTime';
import { TimelineCard } from './TimelineCard';
import { LunchIcon } from './CustomSubjectIcons';

interface TimelineViewProps {
  selectedDay: DayKey;
  language: Language;
  activeFilter: string;
  searchQuery: string;
  vnTime: VietnamTimeInfo;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  selectedDay,
  language,
  activeFilter,
  searchQuery,
  vnTime
}) => {
  const dayData = SCHEDULE_DATA.weekSchedule.find(d => d.dayKey === selectedDay) || SCHEDULE_DATA.weekSchedule[0];

  // Determine relative day state
  const dayKeyToNum: Record<DayKey, number> = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5 };
  const currentDayNum = vnTime.dayOfWeek;
  const selectedDayNum = dayKeyToNum[selectedDay];

  const isToday = selectedDayNum === currentDayNum;
  const isPastDay = currentDayNum >= 1 && currentDayNum <= 5 ? selectedDayNum < currentDayNum : false;

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
    <div className="space-y-2.5">
      
      {/* Mini Day Header Bar with Smooth Fade */}
      <motion.div 
        key={`header-${selectedDay}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="glass-card rounded-2xl px-3.5 py-1.5 shadow-2xs flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-xs sm:text-sm font-display font-extrabold text-slate-900 dark:text-slate-100">
            {dayTitle}
          </h2>
          {isToday && (
            <span className="px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xs">
              {language === 'vi' ? 'Hôm Nay' : 'Today'}
            </span>
          )}
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">• Lớp 11-TN (Phòng 504)</span>
        </div>
        <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200/80 dark:border-slate-700/80">
          {totalPeriods} {language === 'vi' ? 'Tiết học' : 'Periods'}
        </span>
      </motion.div>

      {/* AnimatePresence for Day Switching Transition */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedDay}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-2.5 lg:gap-3.5 items-start"
        >
          
          {/* SÁNG / MORNING COLUMN */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'vi' ? 'Buổi Sáng (08:00 - 11:30)' : 'Morning Session (08:00 - 11:30)'}</span>
            </div>

            <div className="space-y-1.5">
              {morningItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 glass-card rounded-2xl">
                  {language === 'vi' ? 'Không có tiết học nào phù hợp bộ lọc' : 'No periods matching active filter'}
                </div>
              ) : (
                morningItems.map((item, idx) => {
                  const status = getPeriodStatus(item);
                  return (
                    <TimelineCard 
                      key={`mor-${idx}-${selectedDay}`} 
                      item={item} 
                      language={language}
                      isCurrent={status.isCurrent}
                      isPast={status.isPast}
                      remainingMinutes={status.remainingMinutes}
                      index={idx}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* CHIỀU / AFTERNOON COLUMN */}
          <div className="space-y-1.5">
            
            {/* Lunch Break Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`py-2 px-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                lunchStatus.isCurrent 
                  ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-400/50 text-amber-900 dark:text-amber-300' 
                  : lunchStatus.isPast 
                    ? 'bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                    : 'bg-slate-50/70 dark:bg-slate-900/60 border-dashed border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <LunchIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className={`font-semibold text-[11px] ${lunchStatus.isPast ? 'line-through decoration-slate-300 dark:decoration-slate-700 text-slate-400' : ''}`}>
                  {language === 'vi' ? 'Nghỉ trưa & Dùng bữa' : 'Lunch Break & Rest'}
                </span>
                {lunchStatus.isCurrent && (
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded-md border border-amber-200 dark:border-amber-800">
                    {language === 'vi' ? `Đang nghỉ (${lunchStatus.remainingMinutes}p)` : `Break (${lunchStatus.remainingMinutes}m)`}
                  </span>
                )}
              </div>
              <span className={`font-mono font-medium text-[11px] ${lunchStatus.isPast ? 'line-through decoration-slate-300 dark:decoration-slate-700 text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                11:30 - 13:30
              </span>
            </motion.div>

            <div className="flex items-center gap-1.5 px-1 text-xs font-bold text-slate-800 dark:text-slate-200 pt-0.5">
              <Sunset className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{language === 'vi' ? 'Buổi Chiều (13:30 - 16:05)' : 'Afternoon Session (13:30 - 16:05)'}</span>
            </div>

            <div className="space-y-1.5">
              {afternoonItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 glass-card rounded-2xl">
                  {language === 'vi' ? 'Không có tiết học nào phù hợp bộ lọc' : 'No periods matching active filter'}
                </div>
              ) : (
                afternoonItems.map((item, idx) => {
                  const status = getPeriodStatus(item);
                  return (
                    <TimelineCard 
                      key={`aft-${idx}-${selectedDay}`} 
                      item={item} 
                      language={language}
                      isCurrent={status.isCurrent}
                      isPast={status.isPast}
                      remainingMinutes={status.remainingMinutes}
                      index={idx + 4}
                    />
                  );
                })
              )}
            </div>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
