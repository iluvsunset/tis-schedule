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
}

export const SingleSubjectFocusScreen: React.FC<SingleSubjectFocusScreenProps> = ({
  scheduleData,
  language,
  vnTime,
  selectedDay,
  onOpenRoomSelector
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

  // Find ONLY the currently active live subject or starting session
  const liveState = useMemo(() => {
    if (!isToday) {
      // Viewing a day other than today: show first session of that day as scheduled preview
      const first = allPeriods[0];
      return {
        status: 'scheduled' as const,
        item: first || null,
        badgeText: language === 'vi' ? 'Tiết học dự kiến' : 'Scheduled Session',
        timeRemainingText: first ? first.time : '',
        progressPercent: 0
      };
    }

    let activeItem = null;
    let nextStartingItem = null;
    let progressPercent = 0;
    let remainingMinutes = 0;
    let minutesUntilStart = 0;

    for (let i = 0; i < allPeriods.length; i++) {
      const p = allPeriods[i];
      const [sh, sm] = (p.startTime || '').split(':').map(Number);
      const [eh, em] = (p.endTime || '').split(':').map(Number);
      const startMin = (sh || 0) * 60 + (sm || 0);
      const endMin = (eh || 0) * 60 + (em || 0);

      // Subject is currently live right now
      if (currentTotalMinutes >= startMin && currentTotalMinutes < endMin) {
        activeItem = p;
        const duration = endMin - startMin;
        const elapsed = currentTotalMinutes - startMin;
        remainingMinutes = endMin - currentTotalMinutes;
        progressPercent = duration > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100))) : 0;
        break;
      } else if (currentTotalMinutes < startMin && !nextStartingItem) {
        nextStartingItem = p;
        minutesUntilStart = startMin - currentTotalMinutes;
      }
    }

    if (activeItem) {
      return {
        status: 'live' as const,
        item: activeItem,
        badgeText: language === 'vi' ? `ĐANG DIỄN RA · CÒN ${remainingMinutes} PHÚT` : `LIVE IN SESSION · ${remainingMinutes}M REMAINING`,
        timeRemainingText: `${remainingMinutes}m`,
        progressPercent
      };
    }

    if (nextStartingItem) {
      return {
        status: 'starting-soon' as const,
        item: nextStartingItem,
        badgeText: language === 'vi' ? `SẮP BẮT ĐẦU · CÒN ${minutesUntilStart} PHÚT` : `STARTING SOON · IN ${minutesUntilStart} MINUTES`,
        timeRemainingText: `${minutesUntilStart}m`,
        progressPercent: 0
      };
    }

    return {
      status: 'concluded' as const,
      item: null,
      badgeText: language === 'vi' ? 'HÔM NAY KHÔNG CÒN TIẾT HỌC' : 'ALL SESSIONS CONCLUDED',
      timeRemainingText: '',
      progressPercent: 100
    };
  }, [allPeriods, currentTotalMinutes, isToday, language]);

  const subject = liveState.item;
  const subjectName = subject ? (language === 'vi' ? subject.subjectVi : subject.subjectEn) : null;
  const className = subject ? (language === 'vi' ? (subject.classNameVi || currentSchedule.gradeTitleVi) : (subject.classNameEn || currentSchedule.gradeTitleEn)) : '';
  const teacher = subject?.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBA');
  const roomName = currentSchedule.roomNameVi || `Phòng ${currentSchedule.room}`;
  const floorName = language === 'vi' ? (currentSchedule.floorVi || 'Tầng 5') : (currentSchedule.floorEn || 'Floor 5');

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-12 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151720] p-6 sm:p-14 text-center overflow-hidden shadow-2xl space-y-6 sm:space-y-8"
      >
        {/* Venue Bar (Zero Icons) */}
        <div className="flex items-center justify-between gap-4 max-w-xl mx-auto border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={onOpenRoomSelector}
            className="text-left group cursor-pointer"
            title={language === 'vi' ? 'Nhấn để đổi phòng' : 'Click to change room'}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              {language === 'vi' ? 'PHÒNG HỌC' : 'CLASSROOM'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition">
                {roomName}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                · {floorName}
              </span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                [{language === 'vi' ? 'Đổi' : 'Change'}]
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenRoomSelector}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-xs"
          >
            {language === 'vi' ? 'Đổi phòng' : 'Change Room'}
          </button>
        </div>

        {/* Live / Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider shadow-sm uppercase">
          {liveState.status === 'live' ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              {liveState.badgeText}
            </span>
          ) : liveState.status === 'starting-soon' ? (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 px-3 py-1 rounded-full border border-amber-500/20">
              {liveState.badgeText}
            </span>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {liveState.badgeText}
            </span>
          )}
        </div>

        {/* ONLY THE 1 LIVE SUBJECT (OR VACANT STATE) */}
        {subject ? (
          <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto py-2">
            {typeof subject.period === 'number' && (
              <span className="text-xs uppercase font-mono text-slate-400 dark:text-slate-500 tracking-widest block font-bold">
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

            {subject.note && (
              <div className="text-xs font-mono text-slate-400 dark:text-slate-500 pt-1">
                {subject.note}
              </div>
            )}
          </div>
        ) : (
          /* Vacant / No Live Subject State */
          <div className="space-y-3 max-w-lg mx-auto py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {language === 'vi' ? `Hiện không có tiết học nào đang diễn ra` : `No Class Currently in Session`}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {language === 'vi' 
                ? `Phòng ${currentSchedule.room} hiện đang trống hoặc đã kết thúc các tiết học trong ngày.`
                : `Room ${currentSchedule.room} is currently unoccupied or all sessions have concluded.`}
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onOpenRoomSelector}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-mono font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                {language === 'vi' ? 'Chọn phòng / Lớp học khác' : 'Choose Another Room / Class'}
              </button>
            </div>
          </div>
        )}

        {/* Real-time Hairline Progress Track (for live subject) */}
        {liveState.status === 'live' && subject && (
          <div className="max-w-md mx-auto mt-6 space-y-2">
            <div className="h-[2px] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-slate-900 dark:bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${liveState.progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span>{subject.startTime}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{subject.endTime}</span>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
