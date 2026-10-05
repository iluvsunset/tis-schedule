import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { ScheduleItem, Language } from '../types/schedule';
import { springTactile, springCard, springProgress } from '../utils/motionTokens';
import { Coffee, User, MapPin } from './icons';
import { VietnamTimeInfo } from '../utils/vietnamTime';

interface TimelineCardProps {
  item: ScheduleItem;
  language: Language;
  isCurrent?: boolean;
  isPast?: boolean;
  remainingMinutes?: number;
  vnTime?: VietnamTimeInfo;
  index?: number;
  variants?: Variants;
}

const getPeriodBadgeStyle = (period: number | string, isCurrent: boolean) => {
  if (isCurrent) {
    return 'bg-[var(--accent)] text-white shadow-sm ring-2 ring-[var(--accent)]/30';
  }
  const num = typeof period === 'number' ? period : parseInt(String(period), 10);
  switch (num) {
    case 1: return 'bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa]'; // T1 peach
    case 2: return 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'; // T2 butter
    case 3: return 'bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]'; // T3 sage
    case 4: return 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]'; // T4 mist
    case 5: return 'bg-[#ede9fe] text-[#5b21b6] border border-[#ddd6fe]'; // T5 lilac
    case 6: return 'bg-[#ffe4e6] text-[#9f1239] border border-[#fecdd3]'; // T6 blush
    default: return 'bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa]';
  }
};

const formatRoomBadge = (r?: string) => {
  if (!r) return '';
  const clean = r.trim();
  if (clean.toLowerCase().startsWith('phòng') || clean.toLowerCase().startsWith('p.')) return clean;
  return `P.${clean}`;
};

export const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  language,
  isCurrent = false,
  isPast = false,
  remainingMinutes = 0,
  vnTime,
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
      const currentPreciseMin = vnTime 
        ? (vnTime.totalMinutes + vnTime.seconds / 60)
        : (endMin - remainingMinutes);
      const elapsed = currentPreciseMin - startMin;
      return Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100)));
    } catch {
      return 0;
    }
  }, [isCurrent, item.startTime, item.endTime, remainingMinutes, vnTime]);

  // Break / recess: cute dashed coffee break strip with Coffee icon
  if (isBreak) {
    return (
      <motion.div
        variants={variants}
        initial={variants ? undefined : { opacity: 0, y: 6 }}
        animate={variants ? undefined : { opacity: 1, y: 0 }}
        transition={variants ? undefined : { duration: 0.22, delay: index * 0.03 }}
        whileHover={{ y: -1, transition: { duration: 0.16 } }}
        whileTap={{ scale: 0.99, transition: springTactile }}
        className={`py-3 sm:py-3.5 px-4 sm:px-5 rounded-2xl sm:rounded-3xl border-2 border-dashed flex items-center justify-between transition-all select-none ${
          isCurrent
            ? 'bg-[#fef9ee] border-[var(--accent)] text-[var(--fg)] font-bold shadow-sm ring-2 ring-[var(--accent)]/20'
            : isPast
              ? 'bg-white/40 border-[var(--border)] text-[var(--fg-faint)] opacity-60'
              : 'bg-white/80 border-[var(--border)] text-[var(--fg-secondary)] hover:border-[var(--border-hover)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#fef3c7] flex items-center justify-center text-[#92400e] shadow-xs shrink-0">
            <Coffee className={`w-4 h-4 ${isCurrent ? 'animate-pulse text-[var(--accent)]' : ''}`} />
          </div>
          <span className="font-display font-black text-sm sm:text-base text-[var(--fg)]">
            {subjectName}
          </span>
          {isCurrent ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#ffedd5] text-[#9a3412] shadow-xs">
              {language === 'vi' ? `Còn ${remainingMinutes}p` : `${remainingMinutes}m left`}
            </span>
          ) : (
            <span className="text-xs text-[var(--fg-muted)] font-medium">
              {item.note ? `• ${item.note}` : '• 15p'}
            </span>
          )}
        </div>
        <span className={`font-mono text-xs sm:text-sm font-bold tabular-nums ${isPast ? 'line-through text-[var(--fg-faint)]' : 'text-[var(--fg-muted)]'}`}>
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
      whileHover={{ y: -2, transition: { duration: 0.18, ease: [0.34, 1.56, 0.64, 1] } }}
      whileTap={{ scale: 0.985, y: 1, transition: springTactile }}
      className={`card-cozy-interactive bg-white border-[1.5px] rounded-2xl sm:rounded-3xl p-3 xs:p-3.5 sm:p-4.5 transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-2.5 xs:gap-3.5 sm:gap-5 group cursor-pointer select-none ${
        isCurrent
          ? 'border-[var(--accent)] card-current-glow ring-2 ring-[var(--accent)]/20 shadow-md'
          : isPast
            ? 'border-[#ebdccb] opacity-65 hover:opacity-100 shadow-xs'
            : 'border-[#ded0be] shadow-sm hover:shadow-md hover:border-[#cbbbaa]'
      }`}
    >
      {/* Real-time Hairline Progress Bar for Active Period */}
      {isCurrent && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--accent-muted)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={springProgress}
          />
        </div>
      )}

      {/* Left: Adorable Squircle Pastel Period Badge */}
      <div className="flex items-center gap-2.5 xs:gap-3.5 sm:gap-4 min-w-0 flex-1 relative z-10">
        <div
          className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl xs:rounded-2xl sm:rounded-[18px] flex items-center justify-center font-display font-black text-xs xs:text-sm sm:text-base shrink-0 shadow-xs tabular-nums transition-transform group-hover:scale-105 ${getPeriodBadgeStyle(item.period, isCurrent)}`}
        >
          {typeof item.period === 'number' ? `T${item.period}` : 'T'}
        </div>

        {/* Center: Fredoka subject title, teacher badge with person icon, note */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap">
            {isCurrent && (
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse shrink-0 shadow-xs" />
            )}
            <h4
              className={`font-display font-black text-sm xs:text-base sm:text-lg leading-tight tracking-tight truncate ${
                isCurrent
                  ? 'text-[var(--fg)]'
                  : isPast
                    ? 'text-[var(--fg-muted)] line-through decoration-[var(--fg-faint)]'
                    : 'text-[var(--fg)]'
              }`}
            >
              {subjectName}
            </h4>

            {isCurrent && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa] shadow-xs tabular-nums shrink-0">
                {language === 'vi' ? `Còn ${remainingMinutes}p` : `${remainingMinutes}m left`}
              </span>
            )}

            {isPast && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-sans bg-[var(--bg-subtle)] text-[var(--fg-faint)] uppercase tracking-wider shrink-0">
                {language === 'vi' ? 'Đã xong' : 'Done'}
              </span>
            )}
          </div>

          {/* Teacher Badge & Note */}
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            {className && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[var(--bg-subtle)] text-[var(--fg-secondary)] border border-[var(--border)] shrink-0">
                {className}
              </span>
            )}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--fg-secondary)] shrink-0">
              <User className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {item.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBA')}
              </span>
            </div>
            {item.note && (
              <span className="text-[11px] sm:text-xs text-[var(--fg-muted)] font-medium truncate max-w-[160px] sm:max-w-[240px]">
                • {item.note}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Clean pill time badge (07:40 - 08:25) and room sticker (P.504) */}
      <div className="text-right shrink-0 flex flex-col items-end gap-1 sm:gap-1.5 relative z-10">
        <div
          className={`px-2 xs:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] xs:text-xs sm:text-sm font-mono font-bold tabular-nums border whitespace-nowrap transition-all ${
            isCurrent
              ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
              : isPast
                ? 'bg-[var(--bg-subtle)] text-[var(--fg-faint)] border-[var(--border)] line-through'
                : 'bg-[var(--bg-subtle)] text-[var(--fg)] border-[var(--border)] shadow-xs'
          }`}
        >
          {item.time}
        </div>
        {item.room && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] xs:text-[11px] font-mono font-bold bg-[#fff8f0] text-[var(--accent)] border border-[var(--border)] shadow-xs whitespace-nowrap">
            <MapPin className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-[var(--accent)] shrink-0" />
            <span className="truncate max-w-[90px] xs:max-w-[110px]">{formatRoomBadge(item.room)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
