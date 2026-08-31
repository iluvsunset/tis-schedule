import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { MapPin, Check } from 'lucide-react';
import { ScheduleItem, Language } from '../types/schedule';
import { SUBJECT_METADATA } from '../data/scheduleData';
import { CustomSubjectIcon, RecessIcon } from './CustomSubjectIcons';
import { 
  springTactile, 
  springCard, 
  springProgress,
  radarBeaconVariants, 
  activeTopAccentVariants 
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
      variants={variants}
      initial={variants ? undefined : { opacity: 0, y: 10 }}
      animate={variants ? undefined : { opacity: 1, y: 0 }}
      transition={variants ? undefined : { ...springCard, delay: index * 0.04 }}
      whileTap={{ scale: 0.98, transition: springTactile }}
      className={`rounded-2xl p-3.5 sm:p-4.5 border transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 group cursor-pointer ${
        isCurrent 
          ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-emerald-500/70 dark:border-emerald-500/70 shadow-[0_6px_24px_rgba(16,185,129,0.18)] ring-2 ring-emerald-400/50' 
          : isPast 
            ? 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700' 
            : 'bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 shadow-sm'
      }`}
    >
      {/* Active Glowing Top Accent Line */}
      {isCurrent && (
        <motion.div 
          variants={activeTopAccentVariants}
          initial="initial"
          animate="animate"
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" 
        />
      )}

      {/* Real-time Animated Bottom Progress Bar with Spring Interpolation */}
      {isCurrent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80 dark:bg-slate-700/80 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={springProgress}
          />
        </div>
      )}

      {/* Left: Vibrant Icon, Subject & Teacher */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 relative z-10">
        
        {/* Minimalist Luxury 1-Stroke Subject Icon */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <CustomSubjectIcon type={item.type} className="w-8 h-8 sm:w-9 sm:h-9" />
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

            {/* Live In-Class Badge with Multi-Layer Radar Pulse */}
            {isCurrent && (
              <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/85 border border-emerald-500/60 px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <motion.span 
                    className="absolute -inset-1 rounded-full bg-emerald-400/40"
                    variants={radarBeaconVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
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
              ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
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
