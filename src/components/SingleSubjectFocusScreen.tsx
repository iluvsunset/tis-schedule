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

  // Find all active periods for the day (excluding break items for the subject display)
  const allPeriods = useMemo(() => {
    return [...dayData.morning, ...dayData.afternoon].filter(item => item.type !== 'break');
  }, [dayData]);

  // Current Vietnam minutes from midnight
  const currentTotalMinutes = vnTime.totalMinutes;

  // Determine current active or next starting subject
  const currentFocus = useMemo(() => {
    if (!isToday) {
      // If viewing a non-today day, showcase the first subject of that day
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

    // Today: Find active or upcoming
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
        // Next starting subject
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

    // All classes ended for today
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
  const roomName = currentSchedule.roomNameEn || `Room ${currentSchedule.room}`;
  const floorName = language === 'vi' ? (currentSchedule.floorVi || 'Tầng 5') : (currentSchedule.floorEn || 'Floor 5');

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-12 select-none">
      
      {/* Luxury Editorial Classroom Signage Stage (Aman / Hotel Hoa Nắng Aesthetics) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl border border-white/[0.09] bg-gradient-to-b from-white/[0.035] via-white/[0.015] to-transparent backdrop-blur-2xl p-6 sm:p-14 text-center overflow-hidden shadow-2xl"
      >
        
        {/* Subtle Top Room Meta Pill (Zero Icons) */}
        <div className="flex items-center justify-between gap-4 max-w-xl mx-auto mb-8 border-b border-white/[0.06] pb-4">
          <button
            type="button"
            onClick={onOpenRoomSelector}
            className="text-left group cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a869] block">
              {language === 'vi' ? 'Không gian lớp học' : 'Classroom Venue'}
            </span>
            <span className="text-sm font-semibold text-white group-hover:text-[#c5a869] transition">
              {roomName} · {floorName}
            </span>
          </button>

          <button
            type="button"
            onClick={onSwitchToTableView}
            className="px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#c5a869]/60 text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white transition cursor-pointer"
          >
            {language === 'vi' ? 'Xem cả tuần' : 'Full Timetable'}
          </button>
        </div>

        {/* Live Status Badge (Zero Icons) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c5a869]/30 bg-[#c5a869]/10 text-[#c5a869] text-xs font-mono uppercase tracking-[0.2em] mb-6">
          {currentFocus.statusText}
        </div>

        {/* The 1 Single Starting / Active Subject */}
        <div className="space-y-4 max-w-2xl mx-auto py-2">
          {subject && typeof subject.period === 'number' && (
            <span className="text-xs uppercase font-mono text-white/40 tracking-[0.3em] block">
              {language === 'vi' ? `Tiết ${subject.period}` : `Period ${subject.period}`} · {subject.time}
            </span>
          )}

          <h1 className="text-4xl sm:text-6xl font-serif text-white font-normal tracking-tight">
            {subjectName}
          </h1>

          <div className="pt-2 text-base sm:text-lg text-white/70 font-light flex items-center justify-center gap-2 flex-wrap">
            <span className="text-white font-medium">{className}</span>
            <span className="text-white/20">·</span>
            <span>{teacher}</span>
          </div>
        </div>

        {/* Architectural Hairline Progress Line */}
        {currentFocus.type === 'active' && (
          <div className="max-w-md mx-auto mt-10 space-y-2">
            <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-[#c5a869]"
                initial={{ width: 0 }}
                animate={{ width: `${currentFocus.progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-white/40">
              <span>{subject?.startTime}</span>
              <span className="text-[#c5a869] font-medium">{subject?.endTime}</span>
            </div>
          </div>
        )}

        {/* Next Subject Anticipation */}
        {currentFocus.nextItem && (
          <div className="mt-12 pt-8 border-t border-white/[0.06] max-w-md mx-auto flex items-center justify-between text-xs font-mono text-white/50">
            <span className="uppercase tracking-wider text-[#c5a869]/80">
              {language === 'vi' ? 'Tiết tiếp theo' : 'Next Subject'}
            </span>
            <span className="text-white">
              {language === 'vi' ? currentFocus.nextItem.subjectVi : currentFocus.nextItem.subjectEn} · {currentFocus.nextItem.startTime}
            </span>
          </div>
        )}

      </motion.div>

    </div>
  );
};
