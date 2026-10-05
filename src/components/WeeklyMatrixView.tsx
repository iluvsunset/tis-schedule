import React from 'react';
import { motion } from 'framer-motion';
import { Language, ScheduleData, WeekTabInfo } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { VietnamTimeInfo, getDateStatus } from '../utils/vietnamTime';
import { WeekSelectorButton } from './WeekSelectorButton';
import { springCard, gestureTokens } from '../utils/motionTokens';

interface WeeklyMatrixViewProps {
  language: Language;
  activeFilter: string;
  searchQuery: string;
  vnTime: VietnamTimeInfo;
  scheduleData?: ScheduleData;
  availableWeeks?: WeekTabInfo[];
  selectedWeekGid?: string;
  onSelectWeek?: (gid: string) => void;
  isMinimalMode?: boolean;
}

export const WeeklyMatrixView: React.FC<WeeklyMatrixViewProps> = ({
  language,
  activeFilter,
  searchQuery,
  vnTime,
  scheduleData,
  availableWeeks,
  selectedWeekGid,
  onSelectWeek,
  isMinimalMode
}) => {
  const periodsConfig = [
    { labelVi: "S1", labelEn: "M1", time: "07:40 - 08:25", startTime: "07:40", endTime: "08:25", isMorning: true, period: 1 },
    { labelVi: "S2", labelEn: "M2", time: "08:30 - 09:15", startTime: "08:30", endTime: "09:15", isMorning: true, period: 2 },
    { labelVi: "Chơi", labelEn: "Rec", time: "09:15 - 09:30", startTime: "09:15", endTime: "09:30", isBreak: true },
    { labelVi: "S3", labelEn: "M3", time: "09:30 - 10:15", startTime: "09:30", endTime: "10:15", isMorning: true, period: 3 },
    { labelVi: "S4", labelEn: "M4", time: "10:20 - 11:05", startTime: "10:20", endTime: "11:05", isMorning: true, period: 4 },
    { labelVi: "S5", labelEn: "M5", time: "11:10 - 11:55", startTime: "11:10", endTime: "11:55", isMorning: true, period: 5 },
    { labelVi: "Trưa", labelEn: "Lunch", time: "11:30 - 13:30", startTime: "11:30", endTime: "13:30", isLunch: true },
    { labelVi: "C1", labelEn: "A1", time: "13:30 - 14:15", startTime: "13:30", endTime: "14:15", isMorning: false, period: 1 },
    { labelVi: "C2", labelEn: "A2", time: "14:20 - 15:05", startTime: "14:20", endTime: "15:05", isMorning: false, period: 2 },
    { labelVi: "Chơi", labelEn: "Rec", time: "15:05 - 15:20", startTime: "15:05", endTime: "15:20", isBreak: true },
    { labelVi: "C3", labelEn: "A3", time: "15:20 - 16:05", startTime: "15:20", endTime: "16:05", isMorning: false, period: 3 },
  ];

  const currentSchedule = scheduleData || SCHEDULE_DATA;
  const days = currentSchedule.weekSchedule;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={springCard}
      className="od-glass rounded-3xl p-3 sm:p-5 shadow-puffy border-[1.5px] border-[var(--border)] relative z-20"
    >
      {/* Top Header Bar (Only in Standard Mode) */}
      {!isMinimalMode && (
        <div className="flex items-center justify-between mb-3 relative z-40">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-display font-black text-[var(--fg)] tracking-tight">
              {language === 'vi' 
                ? `Thời Khóa Biểu Tuần • ${currentSchedule.gradeTitleVi || 'Lớp 11-TN'}` 
                : `Full Weekly Matrix • ${currentSchedule.gradeTitleEn || 'Grade 11-TN'}`}
            </h2>
            <span className="text-[11px] text-[var(--fg-muted)] font-semibold hidden md:inline">
              • {language === 'vi' ? 'Phòng' : 'Room'} {currentSchedule.room || '504'} ({language === 'vi' ? 'GVQN' : 'HR'}: {currentSchedule.homeroomTeacher?.name})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {availableWeeks && availableWeeks.length > 0 && onSelectWeek && (
              <WeekSelectorButton
                availableWeeks={availableWeeks}
                selectedWeekGid={selectedWeekGid}
                onSelectWeek={onSelectWeek}
                language={language}
              />
            )}


            <motion.button 
              whileTap={gestureTokens.button.whileTap}
              onClick={() => window.print()}
              className="btn-cozy no-print px-3 py-1.5 rounded-2xl text-xs font-mono font-bold uppercase text-[var(--fg)] transition cursor-pointer shadow-xs"
            >
              <span>{language === 'vi' ? 'In Lịch' : 'Print'}</span>
            </motion.button>
          </div>
        </div>
      )}

      {/* Weekly Matrix Table Scroll Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-xs">
        <thead>
          <tr className="text-left bg-[var(--surface-solid)] border-b border-[var(--border)]">
            <th className="p-2.5 font-bold text-[var(--fg-muted)] rounded-l-2xl w-20 text-center font-mono tabular-nums text-xs">
              {language === 'vi' ? 'Tiết / Giờ' : 'Period'}
            </th>
            {days.map((d) => {
              const isToday = getDateStatus(d.date, vnTime.dateStr) === 'today';
              return (
                <th key={d.dayKey} className={`p-2.5 font-bold ${isToday ? 'bg-[var(--fg)] text-[var(--bg)] rounded-t-2xl shadow-xs' : 'text-[var(--fg)]'}`}>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-bold">{language === 'vi' ? d.dayNameVi : d.dayNameEn}</span>
                    <span className={`text-[10px] tabular-nums font-semibold ${isToday ? 'opacity-90' : 'text-[var(--fg-muted)]'}`}>({d.date.slice(0, 5)})</span>
                    {isToday && (
                      <span className="chip-peach px-2 py-0.5 rounded-full text-[9px] font-black uppercase shadow-xs">
                        Today
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {periodsConfig.map((row, rIdx) => {
            if (row.isLunch) {
              return (
                <tr key={rIdx} className="bg-[var(--butter)]/40 font-bold text-[var(--fg)]">
                  <td className="p-2 font-mono text-[10px] text-[var(--fg-secondary)] text-center whitespace-nowrap font-bold">
                    11:30 - 13:30
                  </td>
                  <td colSpan={days.length} className="p-2 text-center text-xs tracking-wide font-display font-black text-[#7a5f12]">
                    <span>{language === 'vi' ? 'NGHỈ TRƯA & DÙNG BỮA' : 'LUNCH BREAK & REST'}</span>
                  </td>
                </tr>
              );
            }

            if (row.isBreak) {
              return (
                <tr key={rIdx} className="bg-[var(--surface-solid)]/50 text-[var(--fg-muted)] font-mono">
                  <td className="p-1.5 font-mono text-[10px] text-center whitespace-nowrap font-semibold">
                    {row.time.split(' - ')[0]}
                  </td>
                  <td colSpan={days.length} className="p-1.5 text-center text-[10px] text-[var(--fg-muted)] uppercase tracking-wider font-bold">
                    <span>{language === 'vi' ? 'Ra chơi giải lao' : 'Recess Interval'}</span>
                  </td>
                </tr>
              );
            }

            const [sh, sm] = row.startTime.split(':').map(Number);
            const [eh, em] = row.endTime.split(':').map(Number);
            const periodStartMin = (sh || 0) * 60 + (sm || 0);
            const periodEndMin = (eh || 0) * 60 + (em || 0);
            const currentMin = vnTime.totalMinutes;

            return (
              <tr key={rIdx} className="hover:bg-[var(--surface-active)]/40 transition-colors">
                <td className="p-1.5 border-r border-[var(--border)] text-center whitespace-nowrap bg-[var(--surface-solid)]/60">
                  <div className="font-display font-black text-[var(--fg)] text-xs">
                    {language === 'vi' ? row.labelVi : row.labelEn}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--fg-muted)]">{row.time.split(' - ')[0]}</div>
                </td>

                {days.map((day) => {
                  const dateStatus = getDateStatus(day.date, vnTime.dateStr);
                  const isToday = dateStatus === 'today';
                  const isPastDay = dateStatus === 'past';

                  let isCurrent = false;
                  let isPast = false;

                  if (isToday) {
                    isCurrent = currentMin >= periodStartMin && currentMin < periodEndMin;
                    isPast = currentMin >= periodEndMin;
                  } else if (isPastDay) {
                    isPast = true;
                  }

                  const session = row.isMorning ? day.morning : day.afternoon;
                  const item = session.find(i => i.period === row.period);

                  if (!item) {
                    return <td key={day.dayKey} className="p-1 text-[var(--fg-faint)] text-center">-</td>;
                  }

                  const subjectName = language === 'vi' ? item.subjectVi : item.subjectEn;

                  let isHighlighted = true;
                  if (searchQuery) {
                    const full = `${item.subjectVi} ${item.subjectEn} ${item.teacher || ''}`.toLowerCase();
                    isHighlighted = full.includes(searchQuery.toLowerCase());
                  }
                  if (activeFilter !== 'all' && item.type !== activeFilter) {
                    isHighlighted = false;
                  }

                  const opacityClass = isHighlighted 
                    ? (isPast ? 'opacity-55' : 'opacity-100') 
                    : 'opacity-20 grayscale';

                  return (
                    <td key={day.dayKey} className={`p-1.5 align-top ${isToday ? 'bg-[var(--peach)]/10' : ''}`}>
                      <motion.div 
                        whileTap={gestureTokens.subtle.whileTap}
                        className={`p-2.5 rounded-2xl transition-all relative border-[1.5px] ${
                          isCurrent 
                            ? 'bg-white border-[var(--accent)] shadow-puffy ring-2 ring-[var(--accent)]/20' 
                            : isPast 
                              ? 'bg-white/50 border-[#ebdccb]' 
                              : 'bg-white border-[#ded0be] hover:border-[#cbbbaa] shadow-xs'
                        } ${opacityClass}`}
                      >
                        {isCurrent && (
                          <div className="chip-peach px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mb-1 flex items-center gap-1.5 shadow-xs w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse shrink-0" />
                            <span>{language === 'vi' ? 'Đang học' : 'Live'}</span>
                          </div>
                        )}
                        <div className={`font-display font-bold text-xs leading-tight tracking-tight truncate ${isCurrent ? 'text-[var(--fg)] font-black' : isPast ? 'text-[var(--fg-faint)] line-through' : 'text-[var(--fg)]'}`}>
                          {subjectName}
                        </div>
                        <div className={`text-[10px] font-semibold truncate mt-0.5 ${isCurrent ? 'text-[var(--fg-secondary)]' : 'text-[var(--fg-muted)]'}`}>
                          {item.teacher || ''}
                        </div>
                      </motion.div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </motion.div>
  );
};
