import React from 'react';
import { motion } from 'framer-motion';
import { Language, ScheduleData, WeekTabInfo } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { VietnamTimeInfo, getDateStatus } from '../utils/vietnamTime';
import { WeekSelectorButton } from './WeekSelectorButton';
import { springCard, gestureTokens, radarBeaconVariants } from '../utils/motionTokens';

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
  onToggleMinimalMode?: () => void;
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
  isMinimalMode,
  onToggleMinimalMode
}) => {
  const periodsConfig = [
    { labelVi: "S1", labelEn: "M1", time: "08:00 - 08:45", startTime: "08:00", endTime: "08:45", isMorning: true, period: 1 },
    { labelVi: "S2", labelEn: "M2", time: "08:50 - 09:35", startTime: "08:50", endTime: "09:35", isMorning: true, period: 2 },
    { labelVi: "Chơi", labelEn: "Rec", time: "09:35 - 09:55", startTime: "09:35", endTime: "09:55", isBreak: true },
    { labelVi: "S3", labelEn: "M3", time: "09:55 - 10:40", startTime: "09:55", endTime: "10:40", isMorning: true, period: 3 },
    { labelVi: "S4", labelEn: "M4", time: "10:45 - 11:30", startTime: "10:45", endTime: "11:30", isMorning: true, period: 4 },
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
      className="glass-card rounded-2xl p-2.5 sm:p-3.5 shadow-soft border border-slate-200/80 dark:border-slate-800 relative z-20"
    >
      {/* Top Header Bar (Only in Standard Mode) */}
      {!isMinimalMode && (
        <div className="flex items-center justify-between mb-2.5 relative z-40">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-display font-bold text-slate-900 dark:text-slate-100">
              {language === 'vi' 
                ? `Thời Khóa Biểu Tuần • ${currentSchedule.gradeTitleVi || 'Lớp 11-TN'}` 
                : `Full Weekly Matrix • ${currentSchedule.gradeTitleEn || 'Grade 11-TN'}`}
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden md:inline">
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

            {/* Full-Screen Minimal Mode Toggle Button (Zero Icons) */}
            {onToggleMinimalMode && (
              <motion.button 
                whileTap={gestureTokens.button.whileTap}
                onClick={onToggleMinimalMode}
                className="no-print px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono uppercase text-white/60 hover:text-white transition cursor-pointer"
                title={language === 'vi' ? "Chế độ xem tối giản (Phím F)" : "Full-screen minimal (F)"}
              >
                Focus
              </motion.button>
            )}

            <motion.button 
              whileTap={gestureTokens.button.whileTap}
              onClick={() => window.print()}
              className="no-print px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono uppercase text-white/60 hover:text-white transition cursor-pointer"
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
          <tr className="text-left bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            <th className="p-1.5 font-bold text-slate-600 dark:text-slate-300 rounded-l-xl w-20 text-center font-mono">
              {language === 'vi' ? 'Tiết / Giờ' : 'Period'}
            </th>
            {days.map((d) => {
              const isToday = getDateStatus(d.date, vnTime.dateStr) === 'today';
              return (
                <th key={d.dayKey} className={`p-1.5 font-bold ${isToday ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-t-xl' : 'text-slate-700 dark:text-slate-300'}`}>
                  <div className="flex items-center gap-1 font-mono">
                    <span>{language === 'vi' ? d.dayNameVi : d.dayNameEn}</span>
                    <span className="text-[10px] font-normal text-slate-400">({d.date.slice(0, 5)})</span>
                    {isToday && (
                      <span className="ml-1 px-1.5 py-0.2 bg-[#c5a869] text-black rounded text-[9px] font-bold">
                        Today
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {periodsConfig.map((row, rIdx) => {
            if (row.isLunch) {
              return (
                <tr key={rIdx} className="bg-slate-50/60 dark:bg-slate-900/40 font-semibold text-slate-700 dark:text-slate-300">
                  <td className="p-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 text-center whitespace-nowrap">
                    11:30 - 13:30
                  </td>
                  <td colSpan={days.length} className="p-1 text-center text-[11px] tracking-wide font-mono">
                    <span className="text-[#c5a869]">{language === 'vi' ? 'NGHỈ TRƯA & DÙNG BỮA' : 'LUNCH BREAK & REST'}</span>
                  </td>
                </tr>
              );
            }

            if (row.isBreak) {
              return (
                <tr key={rIdx} className="bg-slate-50/40 dark:bg-slate-900/20 text-slate-500 dark:text-slate-400 font-mono">
                  <td className="p-1 font-mono text-[10px] text-center whitespace-nowrap">
                    {row.time.split(' - ')[0]}
                  </td>
                  <td colSpan={days.length} className="p-1 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
              <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-1 border-r border-slate-100 dark:border-slate-800 text-center whitespace-nowrap bg-slate-50/40 dark:bg-slate-800/20">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {language === 'vi' ? row.labelVi : row.labelEn}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500">{row.time.split(' - ')[0]}</div>
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
                    return <td key={day.dayKey} className="p-1 text-slate-300 dark:text-slate-600 text-center">-</td>;
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
                    <td key={day.dayKey} className={`p-1 align-top ${isToday ? 'bg-slate-50/30 dark:bg-slate-800/20' : ''}`}>
                      <motion.div 
                        whileTap={gestureTokens.subtle.whileTap}
                        className={`p-1.5 rounded-xl transition-all relative ${
                          isCurrent 
                            ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-2 border-slate-700 shadow-sm ring-2 ring-emerald-400/40' 
                            : isPast 
                              ? 'bg-white/60 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80' 
                              : 'bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800'
                        } ${opacityClass}`}
                      >
                        {isCurrent && (
                          <div className="text-[9px] font-black uppercase text-emerald-400 tracking-wider mb-0.5 flex items-center gap-1">
                            <span className="relative flex h-2 w-2 items-center justify-center">
                              <motion.span 
                                variants={radarBeaconVariants}
                                initial="initial"
                                animate="animate"
                                className="absolute -inset-0.5 rounded-full bg-emerald-400/50"
                              />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                            </span>
                            <span>Đang học</span>
                          </div>
                        )}
                        <div className={`font-display font-bold text-xs leading-tight truncate ${isCurrent ? 'text-white font-black' : isPast ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400 dark:decoration-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                          {subjectName}
                        </div>
                        <div className={`text-[10px] font-semibold truncate ${isCurrent ? 'text-slate-300' : isPast ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
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
