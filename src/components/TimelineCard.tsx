import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check } from 'lucide-react';
import { ScheduleItem, Language } from '../types/schedule';
import { CustomSubjectIcon, RecessIcon } from './CustomSubjectIcons';

interface TimelineCardProps {
  item: ScheduleItem;
  language: Language;
  isCurrent?: boolean;
  isPast?: boolean;
  remainingMinutes?: number;
  index?: number;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  language,
  isCurrent = false,
  isPast = false,
  remainingMinutes = 0,
  index = 0
}) => {
  const isBreak = item.type === 'break';
  const subjectName = language === 'vi' ? item.subjectVi : item.subjectEn;

  // Recess / Break Card
  if (isBreak) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        className={`py-2 px-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
          isCurrent 
            ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-400/50 text-amber-900 dark:text-amber-300' 
            : isPast 
              ? 'bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 opacity-50' 
              : 'bg-white/40 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <RecessIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className={`font-semibold ${isPast ? 'line-through decoration-slate-300 dark:decoration-slate-700' : ''}`}>
            {subjectName}
          </span>
          {isCurrent ? (
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded-md border border-amber-200 dark:border-amber-800">
              {language === 'vi' ? `Đang nghỉ (${remainingMinutes}p)` : `Break (${remainingMinutes}m)`}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal text-[11px]">• {item.note || '15-20p'}</span>
          )}
        </div>
        <span className="font-mono font-medium text-xs text-slate-500 dark:text-slate-400">{item.time}</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.99 }}
      className={`rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-3 group cursor-pointer ${
        isCurrent 
          ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-700 shadow-xl ring-2 ring-slate-900/10 dark:ring-white/10' 
          : isPast 
            ? 'bg-white/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-55 hover:opacity-90' 
            : 'bg-white/80 dark:bg-slate-900/75 backdrop-blur-md border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 shadow-2xs'
      }`}
    >
      {/* Active Top Accent Line */}
      {isCurrent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 dark:bg-emerald-400" />
      )}

      {/* Left: Icon, Subject & Teacher */}
      <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
        <div 
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform ${
            isCurrent 
              ? 'bg-white/10 dark:bg-white/10 border-white/20' 
              : isPast
                ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-60'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <CustomSubjectIcon type={item.type} className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {/* Period Badge */}
            <span 
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                isCurrent 
                  ? 'bg-white text-slate-900 dark:bg-white dark:text-slate-900' 
                  : isPast
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              T{item.period}
            </span>

            {/* Subject Title */}
            <h4 
              className={`font-display font-bold text-xs sm:text-sm leading-tight truncate ${
                isCurrent 
                  ? 'text-white' 
                  : isPast 
                    ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-700' 
                    : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {subjectName}
            </h4>

            {/* Live Indicator Badge */}
            {isCurrent && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.2 rounded-md shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                </span>
                <span>{language === 'vi' ? `Đang học (${remainingMinutes}p)` : `In Class (${remainingMinutes}m)`}</span>
              </span>
            )}

            {/* Completed Checkmark */}
            {isPast && (
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.2 rounded-md border border-slate-200 dark:border-slate-700/80 shrink-0 flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-500" />
                <span className="hidden sm:inline">{language === 'vi' ? 'Đã học' : 'Done'}</span>
              </span>
            )}
          </div>

          {/* Teacher & Note Subtitle */}
          <div 
            className={`text-xs font-medium truncate mt-0.5 flex items-center gap-2 ${
              isCurrent ? 'text-slate-300' : isPast ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className={isPast ? 'line-through decoration-slate-300 dark:decoration-slate-700' : ''}>
              {item.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBA')}
            </span>
            {item.note && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate hidden sm:inline">• {item.note}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Time & Room */}
      <div className="text-right shrink-0 relative z-10">
        <div 
          className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-lg border tabular-nums ${
            isCurrent 
              ? 'bg-white/15 text-white border-white/20' 
              : isPast
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 line-through decoration-slate-300 dark:decoration-slate-700'
                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          {item.time}
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1 flex items-center justify-end gap-1">
          <MapPin className="w-2.5 h-2.5" />
          <span>{item.room || 'Phòng 504'}</span>
        </div>
      </div>

    </motion.div>
  );
};
