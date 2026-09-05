import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { ScheduleItem, Language } from '../types/schedule';
import { springTactile, springCard, springProgress } from '../utils/motionTokens';

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
  const subjectName = language === 'vi' ? item.subjectVi : item.subjectEn;
  const className = language === 'vi' ? (item.classNameVi || '') : (item.classNameEn || '');

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

  // Recess / Break Card (Zero Icons, Pure Typography)
  if (isBreak) {
    return (
      <motion.div 
        variants={variants}
        initial={variants ? undefined : { opacity: 0, y: 6 }}
        animate={variants ? undefined : { opacity: 1, y: 0 }}
        transition={variants ? undefined : { duration: 0.25, delay: index * 0.03 }}
        whileTap={{ scale: 0.99, transition: springTactile }}
        className={`py-2.5 px-4 rounded-xl border border-dashed text-xs sm:text-sm flex items-center justify-between transition-all cursor-default select-none ${
          isCurrent 
            ? 'bg-[#c5a869]/10 border-[#c5a869]/50 text-white font-medium' 
            : isPast 
              ? 'border-white/[0.06] text-white/30 opacity-60' 
              : 'border-white/[0.08] text-white/60 bg-white/[0.015]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono uppercase text-[10px] sm:text-xs tracking-wider text-[#c5a869] font-semibold">
            {subjectName}
          </span>
          {isCurrent ? (
            <span className="text-[10px] font-mono text-[#c5a869] bg-[#c5a869]/20 px-2 py-0.5 rounded">
              {language === 'vi' ? `${remainingMinutes}p còn lại` : `${remainingMinutes}m remaining`}
            </span>
          ) : (
            <span className="text-white/30 font-mono text-xs">
              {item.note ? `• ${item.note}` : '• 15-20m'}
            </span>
          )}
        </div>
        <span className={`font-mono text-xs tabular-nums ${isPast ? 'line-through text-white/30' : 'text-white/50'}`}>
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
      whileTap={{ scale: 0.985, transition: springTactile }}
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-3 sm:gap-4 group select-none cursor-pointer ${
        isCurrent 
          ? 'bg-gradient-to-b from-white/[0.05] to-white/[0.02] border-[#c5a869]/60 shadow-lg shadow-black/30' 
          : isPast 
            ? 'bg-white/[0.01] border-white/[0.05] opacity-55 hover:opacity-80' 
            : 'bg-white/[0.025] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
      }`}
    >
      {/* Real-time Hairline Progress Track (Clean 1.5px flush at bottom) */}
      {isCurrent && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
          <motion.div 
            className="h-full bg-[#c5a869]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={springProgress}
          />
        </div>
      )}

      {/* Left: Period Badge, Subject & Teacher (Zero Icons) */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 relative z-10">
        
        {/* Clean Typographic Period Badge */}
        <div 
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
            isCurrent
              ? 'bg-[#c5a869] text-black'
              : isPast
                ? 'bg-white/5 text-white/30'
                : 'bg-white/10 text-white/70'
          }`}
        >
          {typeof item.period === 'number' ? `P${item.period}` : 'T'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Subject Title (Editorial Serif Typography) */}
            <h4 
              className={`text-sm sm:text-base tracking-tight truncate ${
                isCurrent 
                  ? 'text-white font-serif font-bold text-base sm:text-lg' 
                  : isPast
                    ? 'text-white/40 line-through decoration-white/30 font-medium'
                    : 'text-white/90 font-medium'
              }`}
            >
              {subjectName}
            </h4>

            {/* In Progress Status Pill */}
            {isCurrent && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#c5a869]/15 text-[#c5a869] border border-[#c5a869]/30 shrink-0">
                {language === 'vi' ? `Đang diễn ra · ${remainingMinutes}p` : `In Session · ${remainingMinutes}m`}
              </span>
            )}

            {/* Concluded Text Label (Zero Icons) */}
            {isPast && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/30 shrink-0">
                {language === 'vi' ? 'Đã xong' : 'Concluded'}
              </span>
            )}
          </div>

          {/* Class, Teacher & Note */}
          <div className="text-xs text-white/50 truncate mt-1 flex items-center gap-2">
            {className && (
              <span className="text-white/80 font-medium">
                {className}
              </span>
            )}
            {className && <span className="text-white/20">·</span>}
            <span className={isCurrent ? 'text-white/70' : 'text-white/40'}>
              {item.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBA')}
            </span>
            {item.note && (
              <span className="text-white/30 hidden sm:inline">· {item.note}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Time & Room (Zero Icons) */}
      <div className="text-right shrink-0 relative z-10">
        <div 
          className={`text-xs sm:text-sm font-mono px-2.5 py-1 rounded-lg border tabular-nums transition-colors ${
            isCurrent 
              ? 'bg-[#c5a869] text-black border-[#c5a869] font-bold' 
              : isPast
                ? 'bg-white/[0.02] text-white/30 border-white/[0.04] line-through'
                : 'bg-white/[0.04] text-white/70 border-white/[0.08]'
          }`}
        >
          {item.time}
        </div>
        <div className="text-[11px] font-mono text-white/40 mt-1">
          {item.room ? `Room ${item.room}` : ''}
        </div>
      </div>

    </motion.div>
  );
};
