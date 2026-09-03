import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { MapPin, Check } from 'lucide-react';
import { ScheduleItem, Language } from '../types/schedule';
import { SUBJECT_METADATA } from '../data/scheduleData';
import { CustomSubjectIcon, RecessIcon } from './CustomSubjectIcons';
import { 
  springTactile, 
  springCard, 
  springProgress 
} from '../utils/motionTokens';

interface TimelineCardProps {
  item: ScheduleItem;
  language: Language;
  isCurrent?: boolean;
  isPast?: boolean;
  remainingMinutes?: number;
  index?: number;
  variants?: Variants;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  language,
  isCurrent = false,
  isPast = false,
  remainingMinutes = 0,
  index = 0,
  variants
}) => {
  const isBreak = item.type === 'break';
  const style = SUBJECT_METADATA[item.type] || SUBJECT_METADATA.event;
  const subjectName = language === 'vi' ? item.subjectVi : item.subjectEn;

  // Calculate real-time progress percentage elapsed for current period
  const progressPercent = useMemo(() => {
    if (!isCurrent) return 0;
    try {
      const [sh, sm] = (item.startTime || '').split(':').map(Number);
      const [eh, em] = (item.endTime || '').split(':').map(Number);
      const startMin = (sh || 0) * 60 + (sm || 0);
      const endMin = (eh || 0) * 60 + (em || 0);
      const duration = endMin - startMin;
      if (duration <= 0) return 0;
      const elapsed = duration - remainingMinutes;
      return Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));
    } catch {
      return 0;
    }
  }, [isCurrent, item.startTime, item.endTime, remainingMinutes]);

  // Recess / Break Card
  if (isBreak) {
    return (
      <motion.div 
        variants={variants}
        initial={variants ? undefined : { opacity: 0, y: 6 }}
        animate={variants ? undefined : { opacity: 1, y: 0 }}
        transition={variants ? undefined : { duration: 0.25, delay: index * 0.03 }}
        whileTap={{ scale: 0.99, transition: springTactile }}
        className={`py-2.5 px-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between transition-all cursor-default ${
          isCurrent 
            ? 'bg-slate-100 dark:bg-slate-800 border-slate-900 dark:border-white shadow-2xs text-slate-900 dark:text-white font-medium' 
            : isPast 
              ? 'bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 opacity-60' 
              : 'bg-white/60 dark:bg-slate-900/60 border-dashed border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <RecessIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400" />
          <span className={`font-medium ${isPast ? 'line-through decoration-slate-400 dark:decoration-slate-600' : ''}`}>
            {subjectName}
          </span>
          {isCurrent ? (
            <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-white/10 px-2 py-0.5 rounded-md">
              {language === 'vi' ? `${remainingMinutes}p` : `${remainingMinutes}m`}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal text-xs">• {item.note || '15-20p'}</span>
          )}
        </div>
        <span className={`font-mono font-medium text-xs sm:text-sm tabular-nums ${isPast ? 'line-through decoration-slate-400 text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
          {item.time}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      variants={variants}
      initial={variants ? undefined : { opacity: 0, y: 10 }}
      animate={variants ? undefined : { opacity: 1, y: 0 }}
      transition={variants ? undefined : { ...springCard, delay: index * 0.04 }}
      whileTap={{ scale: 0.98, transition: springTactile }}
      className={`rounded-2xl p-3.5 sm:p-4.5 border transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 group cursor-pointer ${
        isCurrent 
          ? 'bg-white dark:bg-[#151720] border-slate-900 dark:border-white shadow-sm ring-1 ring-slate-900/10 dark:ring-white/10' 
          : isPast 
            ? 'bg-white/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60 hover:opacity-90' 
            : 'bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
      }`}
    >
      {/* Real-time Hairline Progress Track (Clean 1.5px flush at bottom) */}
      {isCurrent && (
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
          <motion.div 
            className="h-full bg-slate-900 dark:bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={springProgress}
          />
        </div>
      )}

      {/* Left: Icon, Subject & Teacher */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 relative z-10">
        
        {/* Minimalist 1-Stroke Subject Icon */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <CustomSubjectIcon type={item.type} className="w-8 h-8 sm:w-9 sm:h-9" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Clean Period Badge */}
            <span 
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider shrink-0 ${
                isCurrent 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                  : style.badgeBg
              }`}
            >
              T{item.period}
            </span>

            {/* Subject Title */}
            <h4 
              className={`font-display font-bold text-sm sm:text-base leading-tight truncate ${
                isCurrent 
                  ? 'text-slate-900 dark:text-white font-extrabold' 
                  : isPast
                    ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-400 dark:decoration-slate-600 font-medium'
                    : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {subjectName}
            </h4>

            {/* Clean Minimalist Remaining Time Label (No dot, pure typography) */}
            {isCurrent && (
              <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] shrink-0">
                {language === 'vi' ? `${remainingMinutes}p` : `${remainingMinutes}m`}
              </span>
            )}

            {/* Finished Checkmark */}
            {isPast && (
              <span className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-0.5">
                <Check className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span className="hidden sm:inline">{language === 'vi' ? 'Đã xong' : 'Done'}</span>
              </span>
            )}
          </div>

          {/* Teacher & Note */}
          <div 
            className={`text-xs sm:text-sm font-medium truncate mt-1 flex items-center gap-2 ${
              isCurrent 
                ? 'text-slate-600 dark:text-slate-300 font-semibold' 
                : isPast
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-500 dark:text-slate-400'
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
          className={`text-xs sm:text-sm font-mono font-medium px-2.5 py-1 rounded-xl border tabular-nums transition-colors shadow-2xs ${
            isCurrent 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-semibold' 
              : isPast
                ? 'bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200/60 dark:border-slate-800/60 line-through decoration-slate-400 dark:decoration-slate-600'
                : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          {item.time}
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1 flex items-center justify-end gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span>{item.room || (language === 'vi' ? 'Phòng 504' : 'Room 504')}</span>
        </div>
      </div>

    </motion.div>
  );
};
