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

  // Recess / Lunch break card
  if (isBreak) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className={`py-1.5 px-3 rounded-xl border text-[11px] flex items-center justify-between transition-all ${
          isCurrent 
            ? 'bg-amber-100/90 border-amber-300 ring-2 ring-amber-300/70 text-amber-900 shadow-sm'
            : isPast 
              ? 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400 opacity-60' 
              : 'bg-white/70 border-dashed border-slate-200 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <RecessIcon className={`w-4 h-4 ${isCurrent ? 'animate-bounce' : ''}`} />
          <span className={`font-bold ${isPast ? 'line-through decoration-slate-300' : ''}`}>
            {subjectName}
          </span>
          {isCurrent && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-200/80 px-1.5 py-0.2 rounded-md">
              {language === 'vi' ? `Đang nghỉ (${remainingMinutes}p)` : `Break (${remainingMinutes}m)`}
            </span>
          )}
          {!isCurrent && (
            <span className="text-slate-400 font-medium">• {item.note || '15-20p'}</span>
          )}
        </div>
        <span className="font-mono font-semibold">{item.time}</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2.5, scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      className={`glass-card rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 relative overflow-hidden flex items-center justify-between gap-3 group cursor-pointer ${
        isCurrent 
          ? 'bg-rose-50/95 border-rose-300 ring-2 ring-rose-400/80 ring-offset-1 shadow-cute-pink' 
          : isPast 
            ? 'bg-white/60 border-slate-200/70 opacity-65 hover:opacity-100' 
            : `${style.border} ${style.bg} hover:shadow-soft`
      }`}
    >
      {/* Live "Now" Glowing Animated Timeline Line */}
      {isCurrent && (
        <motion.div 
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500"
        />
      )}

      {/* Completed Strikethrough Background Line for Past Lessons */}
      {isPast && (
        <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-slate-200/60 pointer-events-none"></div>
      )}

      {/* Left: Icon & Subject & Teacher */}
      <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
        <motion.div 
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
          transition={{ duration: 0.35 }}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
            isCurrent 
              ? 'bg-white shadow-cute-pink scale-105 ring-2 ring-rose-300' 
              : isPast
                ? 'bg-slate-100 opacity-60 border border-slate-200'
                : 'bg-white shadow-sm border border-slate-100/90'
          }`}
        >
          <CustomSubjectIcon type={item.type} className="w-7 h-7" />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span 
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                isCurrent 
                  ? 'bg-rose-600 text-white' 
                  : isPast
                    ? 'bg-slate-200 text-slate-600'
                    : `${style.badgeBg} ${style.badgeText}`
              }`}
            >
              T{item.period}
            </span>

            {/* Subject Title with Strikethrough when Completed */}
            <h4 
              className={`font-display font-bold text-xs sm:text-sm leading-tight truncate ${
                isCurrent 
                  ? 'text-rose-950 font-black' 
                  : isPast 
                    ? 'text-slate-500 line-through decoration-rose-300/80 decoration-2' 
                    : 'text-slate-900'
              }`}
            >
              {subjectName}
            </h4>

            {/* In Progress Live Badge */}
            {isCurrent && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded-md border border-rose-200 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600"></span>
                </span>
                <span>{language === 'vi' ? `Đang học (${remainingMinutes}p)` : `In Class (${remainingMinutes}m)`}</span>
              </span>
            )}

            {/* Finished Checkmark Badge */}
            {isPast && (
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-100 shrink-0 flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5 text-emerald-600" />
                <span className="hidden sm:inline">{language === 'vi' ? 'Đã học' : 'Done'}</span>
              </span>
            )}
          </div>

          <div 
            className={`text-xs font-semibold truncate mt-0.5 flex items-center gap-2 ${
              isCurrent ? 'text-rose-700' : isPast ? 'text-slate-400' : style.text
            }`}
          >
            <span className={isPast ? 'line-through decoration-slate-300' : ''}>
              {item.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBA')}
            </span>
            {item.note && (
              <span className="text-[10px] text-slate-400 font-normal truncate hidden sm:inline">• {item.note}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Time & Room */}
      <div className="text-right shrink-0 relative z-10">
        <div 
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border shadow-2xs ${
            isCurrent 
              ? 'bg-rose-500 text-white border-rose-600' 
              : isPast
                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through decoration-slate-300'
                : 'bg-white/90 text-slate-700 border-slate-100'
          }`}
        >
          {item.time}
        </div>
        <div className="text-[10px] text-slate-400 font-medium mt-1 flex items-center justify-end gap-1">
          <MapPin className="w-2.5 h-2.5" />
          <span>{item.room || 'Phòng 504'}</span>
        </div>
      </div>

    </motion.div>
  );
};
