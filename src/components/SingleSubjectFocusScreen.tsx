import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScheduleData, Language, DayKey } from '../types/schedule';
import { VietnamTimeInfo, getDateStatus } from '../utils/vietnamTime';

interface SingleSubjectFocusScreenProps {
  scheduleData: ScheduleData;
  language: Language;
  vnTime: VietnamTimeInfo;
  selectedDay: DayKey;
  onOpenRoomSelector: () => void;
  onSwitchToTableView: () => void;
}

export const SingleSubjectFocusScreen: React.FC<SingleSubjectFocusScreenProps> = ({
  scheduleData,
  language,
  vnTime,
  selectedDay,
  onOpenRoomSelector,
  onSwitchToTableView
}) => {
  const currentSchedule = scheduleData;
  const dayData = currentSchedule.weekSchedule.find(d => d.dayKey === selectedDay) || currentSchedule.weekSchedule[0];
  const dateStatus = getDateStatus(dayData.date, vnTime.dateStr);
  const isToday = dateStatus === 'today';

  // Find all active periods for the day
  const allPeriods = useMemo(() => {
    return [...dayData.morning, ...dayData.afternoon].filter(item => item.type !== 'break');
  }, [dayData]);

  const currentTotalMinutes = vnTime.totalMinutes;

  // Determine current active or next starting subject
  const currentFocus = useMemo(() => {
    if (!isToday) {
      const first = allPeriods[0];
      return {
        type: 'scheduled' as const,
        item: first,
        statusText: language === 'vi' ? 'Tiết học đầu tiên trong ngày' : 'First session of the day',
        remainingText: first ? first.time : '',
        progressPercent: 0,
        nextItem: allPeriods[1] || null
      };
    }

    let activeItem = null;
    let nextItem = null;
    let progressPercent = 0;
    let remainingMinutes = 0;

    for (let i = 0; i < allPeriods.length; i++) {
      const p = allPeriods[i];
      const [sh, sm] = (p.startTime || '').split(':').map(Number);
      const [eh, em] = (p.endTime || '').split(':').map(Number);
      const startMin = (sh || 0) * 60 + (sm || 0);
      const endMin = (eh || 0) * 60 + (em || 0);

      if (currentTotalMinutes >= startMin && currentTotalMinutes < endMin) {
        activeItem = p;
        nextItem = allPeriods[i + 1] || null;
        const duration = endMin - startMin;
        const elapsed = currentTotalMinutes - startMin;
        remainingMinutes = endMin - currentTotalMinutes;
        progressPercent = duration > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100))) : 0;
        break;
      } else if (currentTotalMinutes < startMin && !nextItem) {
        nextItem = p;
        remainingMinutes = startMin - currentTotalMinutes;
      }
    }

    if (activeItem) {
      return {
        type: 'active' as const,
        item: activeItem,
        statusText: language === 'vi' ? `Đang diễn ra · Còn ${remainingMinutes} phút` : `Currently in session · ${remainingMinutes}m remaining`,
        remainingText: `${remainingMinutes}m`,
        progressPercent,
        nextItem
      };
    }

    if (nextItem) {
      return {
        type: 'upcoming' as const,
        item: nextItem,
        statusText: language === 'vi' ? `Bắt đầu sau ${remainingMinutes} phút` : `Starting in ${remainingMinutes} minutes`,
        remainingText: `Starts in ${remainingMinutes}m`,
        progressPercent: 0,
        nextItem: null
      };
    }

    return {
      type: 'concluded' as const,
      item: allPeriods[allPeriods.length - 1] || null,
      statusText: language === 'vi' ? 'Các tiết học hôm nay đã kết thúc' : 'All sessions concluded for today',
      remainingText: language === 'vi' ? 'Hẹn gặp lại ngày mai' : 'See you tomorrow',
      progressPercent: 100,
      nextItem: null
    };
  }, [allPeriods, currentTotalMinutes, isToday, language]);

  const subject = currentFocus.item;
  const subjectName = subject ? (language === 'vi' ? subject.subjectVi : subject.subjectEn) : (language === 'vi' ? 'Chưa có tiết' : 'No Class');
  const className = subject ? (language === 'vi' ? (subject.classNameVi || currentSchedule.gradeTitleVi) : (subject.classNameEn || currentSchedule.gradeTitleEn)) : '';
  const teacher = subject?.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBA');
  const roomName = currentSchedule.roomNameVi || `Phòng ${currentSchedule.room}`;
  const floorName = language === 'vi' ? (currentSchedule.floorVi || 'Tầng 5') : (currentSchedule.floorEn || 'Floor 5');

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-12 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#151720] p-6 sm:p-14 text-center overflow-hidden shadow-xl space-y-6"
      >
        {/* Top Room Venue Header (Zero Icons) */}
        <div className="flex items-center justify-between gap-4 max-w-xl mx-auto border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={onOpenRoomSelector}
            className="text-left group cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              {language === 'vi' ? 'Phòng Học' : 'Classroom Venue'}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition">
              {roomName} · {floorName}
            </span>
          </button>

          <button
            type="button"
            onClick={onSwitchToTableView}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {language === 'vi' ? 'Xem cả tuần' : 'Full Timetable'}
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
          {currentFocus.statusText}
        </div>

        {/* The 1 Single Starting Subject */}
        <div className="space-y-3 max-w-2xl mx-auto py-2">
          {subject && typeof subject.period === 'number' && (
            <span className="text-xs uppercase font-mono text-slate-400 dark:text-slate-500 tracking-widest block font-semibold">
              {language === 'vi' ? `Tiết ${subject.period}` : `Period ${subject.period}`} · {subject.time}
            </span>
          )}

          <h1 className="text-4xl sm:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            {subjectName}
          </h1>

          <div className="pt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium flex items-center justify-center gap-2 flex-wrap">
            <span className="text-slate-900 dark:text-slate-100 font-bold">{className}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span>{teacher}</span>
          </div>
        </div>

        {/* Hairline Progress Bar */}
        {currentFocus.type === 'active' && (
          <div className="max-w-md mx-auto mt-8 space-y-2">
            <div className="h-[2px] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-slate-900 dark:bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${currentFocus.progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span>{subject?.startTime}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{subject?.endTime}</span>
            </div>
          </div>
        )}

        {/* Next Subject Preview */}
        {currentFocus.nextItem && (
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="uppercase tracking-wider font-semibold">
              {language === 'vi' ? 'Tiết tiếp theo' : 'Next Subject'}
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {language === 'vi' ? currentFocus.nextItem.subjectVi : currentFocus.nextItem.subjectEn} · {currentFocus.nextItem.startTime}
            </span>
          </div>
        )}

      </motion.div>
    </div>
  );
};
