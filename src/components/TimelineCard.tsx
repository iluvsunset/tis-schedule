import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Check } from 'lucide-react';
import { ScheduleItem, Language } from '../types/schedule';
import { SUBJECT_METADATA } from '../data/scheduleData';
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
  const style = SUBJECT_METADATA[item.type] || SUBJECT_METADATA.event;
  const subjectName = language === 'vi' ? item.subjectVi : item.subjectEn;

  // Recess / Break Card
  if (isBreak) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        className={`py-2.5 px-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all ${
          isCurrent 
            ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-400 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40 shadow-sm' 
            : isPast 
              ? 'bg-slate-50/70 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-80' 
              : 'bg-white/60 dark:bg-slate-900/60 border-dashed border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <RecessIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className={`font-semibold ${isPast ? 'line-through decoration-slate-400 dark:decoration-slate-600' : ''}`}>
            {subjectName}
          </span>
          {isCurrent ? (
            <span className="text-[10px] sm:text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 animate-pulse">
              {language === 'vi' ? `Đang nghỉ (${remainingMinutes}p)` : `Break (${remainingMinutes}m)`}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">• {item.note || '15-20p'}</span>
          )}
        </div>
        <span className={`font-mono font-semibold text-xs sm:text-sm ${isPast ? 'line-through decoration-slate-400 text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
          {item.time}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, scale: 1.006 }}
      whileTap={{ scale: 0.99 }}
      className={`rounded-2xl p-3.5 sm:p-4.5 border transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 group cursor-pointer ${
        isCurrent 
          ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-900 dark:border-slate-600 shadow-xl ring-2 ring-emerald-400/50' 
          : isPast 
            ? 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700' 
            : 'bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
      }`}
    >
      {/* Active Glowing Line */}
      {isCurrent && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-pulse" />
      )}

      {/* Left: Vibrant Icon, Subject & Teacher */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 relative z-10">
        
        {/* Vibrant Custom Illustrated Subject Icon */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden transform group-hover:scale-105 transition-transform">
          <CustomSubjectIcon type={item.type} className="w-11 h-11 sm:w-12 sm:h-12" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Colorful Period Badge */}
            <span 
              className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider shrink-0 shadow-2xs ${
                isCurrent 
                  ? 'bg-white text-slate-900 font-black' 
                  : style.badgeBg
              }`}
            >
              T{item.period}
            </span>

            {/* Subject Title (with strikethrough when done) */}
            <h4 
              className={`font-display font-bold text-sm sm:text-base leading-tight truncate ${
                isCurrent 
                  ? 'text-white font-extrabold' 
                  : isPast
                    ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400 dark:decoration-slate-500 font-medium'
                    : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {subjectName}
            </h4>

            {/* Live In-Class Badge */}
            {isCurrent && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>{language === 'vi' ? `Đang học (${remainingMinutes}p)` : `In Class (${remainingMinutes}m)`}</span>
              </span>
            )}

            {/* Finished Checkmark */}
            {isPast && (
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 shrink-0 flex items-center gap-0.5">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{language === 'vi' ? 'Đã học' : 'Done'}</span>
              </span>
            )}
          </div>

          {/* Teacher & Note */}
          <div 
            className={`text-xs sm:text-sm font-semibold truncate mt-1 flex items-center gap-2 ${
              isCurrent 
                ? 'text-slate-300' 
                : isPast
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>
              {item.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBA')}
            </span>
            {item.note && (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal truncate hidden sm:inline">• {item.note}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Time & Room */}
      <div className="text-right shrink-0 relative z-10">
        <div 
          className={`text-xs sm:text-sm font-mono font-bold px-2.5 py-1 rounded-xl border tabular-nums shadow-2xs ${
            isCurrent 
              ? 'bg-emerald-500 text-white border-emerald-400' 
              : isPast
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 line-through decoration-slate-400 dark:decoration-slate-600'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          {item.time}
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 flex items-center justify-end gap-1">
          <MapPin className="w-3 h-3" />
          <span>{item.room || 'Phòng 504'}</span>
        </div>
      </div>

    </motion.div>
  );
};
