import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScheduleData, Language, DayKey } from '../types/schedule';
import { VietnamTimeInfo, getDateStatus } from '../utils/vietnamTime';
import { Clock, MapPin } from './icons';

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

  return (
    <div className="w-full flex justify-center items-center my-auto py-4 sm:py-8 select-none">
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="w-fit min-w-[300px] max-w-[92vw] sm:max-w-xl md:max-w-2xl mx-auto rounded-[28px] od-glass px-6 py-8 sm:px-12 sm:py-10 text-center overflow-hidden shadow-puffy space-y-4 sm:space-y-5 flex flex-col items-center justify-center border-[1.5px] border-[var(--border)]"
      >
        {/* Quick Room & Clock Pills */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--fg-muted)]">
          <span className="flex items-center gap-1.5 bg-[var(--surface-solid)] px-3 py-1 rounded-full border border-[var(--border)] shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{language === 'vi' ? 'Phòng' : 'Room'} {currentSchedule.room}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[var(--surface-solid)] px-3 py-1 rounded-full border border-[var(--border)] shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-mono tabular-nums">{vnTime.timeStr}</span>
          </span>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center">
          {liveState.status === 'live' ? (
            <span className="chip-peach px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-xs tabular-nums flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              {liveState.badgeText}
            </span>
          ) : liveState.status === 'starting-soon' ? (
            <span className="chip-butter px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-xs tabular-nums flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7a5f12] animate-pulse" />
              {liveState.badgeText}
            </span>
          ) : (
            <span className="bg-[var(--surface-solid)] text-[var(--fg-muted)] px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border border-[var(--border)] shadow-xs">
              {liveState.badgeText}
            </span>
          )}
        </div>

        {/* ONLY THE 1 LIVE SUBJECT (OR VACANT STATE) */}
        {subject ? (
          <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto w-full pt-1">
            {typeof subject.period === 'number' && (
              <span className="text-xs uppercase font-mono text-[var(--fg-muted)] tracking-widest block font-bold tabular-nums">
                {language === 'vi' ? `Tiết ${subject.period}` : `Period ${subject.period}`} · {subject.time}
              </span>
            )}

            <h1 className="text-4xl sm:text-6xl font-display font-black text-[var(--fg)] tracking-tight leading-tight">
              {subjectName}
            </h1>

            <div className="pt-1 text-base sm:text-lg text-[var(--fg-secondary)] font-semibold flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[var(--fg)] font-bold">{className}</span>
              <span className="text-[var(--fg-faint)]">·</span>
              <span>{teacher}</span>
            </div>

            {subject.note && (
              <div className="text-xs font-mono text-[var(--fg-muted)] pt-0.5">
                {subject.note}
              </div>
            )}

            {/* Real-time Hairline Progress Track (for live subject) */}
            {liveState.status === 'live' && (
              <div className="max-w-md mx-auto mt-6 space-y-2">
                <div className="h-2 w-full bg-[var(--bg-subtle)] overflow-hidden rounded-full border border-[var(--border)]/40">
                  <motion.div 
                    className="h-full bg-[var(--accent)] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${liveState.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono font-bold text-[var(--fg-muted)] tabular-nums">
                  <span>{subject.startTime}</span>
                  <span className="text-[var(--fg)]">{subject.endTime}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Vacant / No Live Subject State */
          <div className="space-y-3 max-w-lg mx-auto w-full pt-1">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--fg)] tracking-tight">
              {language === 'vi' ? `Hiện không có tiết học nào đang diễn ra` : `No Class Currently in Session`}
            </h2>
            <p className="text-sm text-[var(--fg-secondary)] max-w-md mx-auto leading-relaxed">
              {language === 'vi' 
                ? `Phòng ${currentSchedule.room} hiện đang trống hoặc đã kết thúc các tiết học trong ngày.`
                : `Room ${currentSchedule.room} is currently unoccupied or all sessions have concluded.`}
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onOpenRoomSelector}
                className="btn-cozy px-6 py-2.5 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider text-[var(--fg)] transition cursor-pointer shadow-xs"
              >
                {language === 'vi' ? 'Đổi phòng / Chọn lớp' : 'Change Room / Class'}
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
