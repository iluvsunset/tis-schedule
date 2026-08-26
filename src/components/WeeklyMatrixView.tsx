import React from 'react';
import { motion } from 'framer-motion';
import { Printer, MapPin } from 'lucide-react';
import { Language, DayKey } from '../types/schedule';
import { SCHEDULE_DATA, SUBJECT_METADATA } from '../data/scheduleData';
import { VietnamTimeInfo } from '../utils/vietnamTime';
import { CustomSubjectIcon, RecessIcon, LunchIcon } from './CustomSubjectIcons';

interface WeeklyMatrixViewProps {
  language: Language;
  activeFilter: string;
  searchQuery: string;
  vnTime: VietnamTimeInfo;
}

export const WeeklyMatrixView: React.FC<WeeklyMatrixViewProps> = ({
  language,
  activeFilter,
  searchQuery,
  vnTime
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

  const days = SCHEDULE_DATA.weekSchedule;
  const dayKeyToNum: Record<DayKey, number> = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5 };
  const currentDayNum = vnTime.dayOfWeek;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.25 }}
      className="glass-card rounded-3xl p-3 sm:p-4 shadow-sm overflow-x-auto border border-slate-200/80 dark:border-slate-800"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-display font-extrabold text-slate-900 dark:text-slate-100">
            {language === 'vi' ? 'Thời Khóa Biểu Tuần • Lớp 11-TN' : 'Full Weekly Matrix • Grade 11-TN'}
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden md:inline">• Phòng 504 (GVQN: Cô Tiềng)</span>
        </div>
        <motion.button 
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => window.print()}
          className="no-print px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'In Lịch' : 'Print'}</span>
        </motion.button>
      </div>

      {/* Weekly Matrix Table */}
      <table className="w-full min-w-[760px] border-collapse text-xs">
        <thead>
          <tr className="text-left bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700">
            <th className="p-2 font-bold text-slate-700 dark:text-slate-300 rounded-l-2xl w-24 text-center">
              {language === 'vi' ? 'Tiết / Giờ' : 'Period'}
            </th>
            {days.map((d) => {
              const isToday = dayKeyToNum[d.dayKey] === currentDayNum;
              return (
                <th key={d.dayKey} className={`p-2 font-bold w-1/5 ${isToday ? 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100 rounded-t-2xl' : 'text-slate-700 dark:text-slate-300'}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-extrabold">{language === 'vi' ? d.dayNameVi : d.dayNameEn}</span>
                    <span className="text-[11px] font-normal text-slate-400 dark:text-slate-400">({d.date.slice(0, 5)})</span>
                    {isToday && (
                      <span className="ml-1 px-1.5 py-0.2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md text-[9px] font-extrabold uppercase shadow-2xs">
                        {language === 'vi' ? 'Hôm nay' : 'Today'}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {periodsConfig.map((row, rIdx) => {
            if (row.isLunch) {
              return (
                <tr key={rIdx} className="bg-amber-500/10 dark:bg-amber-500/15 font-semibold text-slate-800 dark:text-slate-200">
                  <td className="p-2 font-mono text-[11px] text-amber-800 dark:text-amber-300 text-center whitespace-nowrap">
                    11:30 - 13:30
                  </td>
                  <td colSpan={5} className="p-2 text-center text-xs tracking-wide text-amber-900 dark:text-amber-300">
                    <div className="flex items-center justify-center gap-1.5 font-bold">
                      <LunchIcon className="w-4 h-4" />
                      <span>{language === 'vi' ? 'NGHỈ TRƯA & DÙNG BỮA' : 'LUNCH BREAK & REST'}</span>
                    </div>
                  </td>
                </tr>
              );
            }

            if (row.isBreak) {
              return (
                <tr key={rIdx} className="bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400">
                  <td className="p-1.5 font-mono text-[11px] text-center whitespace-nowrap">
                    {row.time.split(' - ')[0]}
                  </td>
                  <td colSpan={5} className="p-1.5 text-center text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center justify-center gap-1.5 italic">
                      <RecessIcon className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Ra chơi giải lao (15-20 phút)' : 'Recess break'}</span>
                    </div>
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
              <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-2 border-r border-slate-100 dark:border-slate-800 text-center whitespace-nowrap bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {language === 'vi' ? row.labelVi : row.labelEn}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{row.time.split(' - ')[0]}</div>
                </td>

                {days.map((day) => {
                  const dayNum = dayKeyToNum[day.dayKey];
                  const isToday = dayNum === currentDayNum;
                  const isPastDay = currentDayNum >= 1 && currentDayNum <= 5 ? dayNum < currentDayNum : false;

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
                    return <td key={day.dayKey} className="p-1.5 text-slate-300 dark:text-slate-600 text-center font-bold">-</td>;
                  }

                  const style = SUBJECT_METADATA[item.type] || SUBJECT_METADATA.event;
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
                    ? (isPast ? 'opacity-80' : 'opacity-100') 
                    : 'opacity-20 grayscale';

                  return (
                    <td key={day.dayKey} className={`p-1.5 align-top ${isToday ? 'bg-slate-100/40 dark:bg-slate-800/20' : ''}`}>
                      <div 
                        className={`p-2 sm:p-2.5 rounded-2xl transition-all relative flex items-center gap-2 border ${
                          isCurrent 
                            ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-600 shadow-lg ring-2 ring-emerald-400/50' 
                            : isPast 
                              ? 'bg-white/90 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300' 
                              : `bg-white/95 dark:bg-slate-900/90 ${style.border} hover:shadow-2xs`
                        } ${opacityClass}`}
                      >
                        {/* Custom Illustrated SVG Subject Icon */}
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                          <CustomSubjectIcon type={item.type} className="w-8 h-8" />
                        </div>

                        {/* Subject Details */}
                        <div className="min-w-0 flex-1">
                          {isCurrent && (
                            <div className="text-[9px] font-extrabold uppercase text-emerald-400 tracking-wider mb-0.5 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              <span>Đang học</span>
                            </div>
                          )}
                          <div className={`font-display font-bold text-xs leading-tight truncate ${
                            isCurrent 
                              ? 'text-white font-extrabold' 
                              : isPast 
                                ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400 dark:decoration-slate-500' 
                                : 'text-slate-900 dark:text-slate-100'
                          }`}>
                            {subjectName}
                          </div>
                          <div className={`text-[11px] font-semibold truncate ${
                            isCurrent 
                              ? 'text-slate-300' 
                              : isPast 
                                ? 'text-slate-400 dark:text-slate-500' 
                                : 'text-slate-600 dark:text-slate-300'
                          }`}>
                            {item.teacher || ''}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mt-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span>{item.room || 'P.504'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};
