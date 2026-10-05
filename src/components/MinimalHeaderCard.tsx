import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Minimize2 
} from './icons';
import { Language, ViewMode, DayKey, ScheduleData, WeekTabInfo } from '../types/schedule';
import { VietnamTimeInfo, getDateStatus, formatScheduleDate } from '../utils/vietnamTime';
import { WeekSelectorButton } from './WeekSelectorButton';
import { SCHEDULE_DATA } from '../data/scheduleData';

interface MinimalHeaderCardProps {
  vnTime: VietnamTimeInfo;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  language: Language;
  scheduleData?: ScheduleData | null;
  availableWeeks?: WeekTabInfo[];
  selectedWeekGid?: string;
  onSelectWeek?: (gid: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleMinimalMode: () => void;
}

export const MinimalHeaderCard: React.FC<MinimalHeaderCardProps> = ({
  vnTime,
  selectedDay,
  onSelectDay,
  language,
  scheduleData,
  availableWeeks,
  selectedWeekGid,
  onSelectWeek,
  viewMode,
  onViewModeChange,
  onToggleMinimalMode
}) => {
  const currentSchedule = scheduleData || SCHEDULE_DATA;
  const days = currentSchedule.weekSchedule;

  const dayLabelsVi: Record<DayKey, string> = {
    mon: 'T2',
    tue: 'T3',
    wed: 'T4',
    thu: 'T5',
    fri: 'T6',
    sat: 'T7',
  };

  const dayLabelsEn: Record<DayKey, string> = {
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
  };

  const dayNamesVi: Record<DayKey, string> = {
    mon: 'Thứ Hai',
    tue: 'Thứ Ba',
    wed: 'Thứ Tư',
    thu: 'Thứ Năm',
    fri: 'Thứ Sáu',
    sat: 'Thứ Bảy',
  };

  const dayNamesEn: Record<DayKey, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
  };

  const currentDayData = days.find(d => d.dayKey === selectedDay) || days[0];
  const isSelectedToday = getDateStatus(currentDayData.date, vnTime.dateStr) === 'today';
  
  const displayDayName = language === 'vi' ? dayNamesVi[selectedDay] : dayNamesEn[selectedDay];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="od-glass rounded-3xl p-3.5 sm:p-5 mb-2.5 sm:mb-4 sticky top-0 z-30 pt-[max(0.25rem,env(safe-area-inset-top,0px))] w-full border-[1.5px] border-[var(--border)] shadow-puffy"
    >
      {/* DESKTOP LAYOUT (>= md screens) */}
      <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Clock & Date */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1" suppressHydrationWarning>
              <span className="text-4xl lg:text-5xl font-display font-black tracking-tight text-[var(--fg)] tabular-nums" suppressHydrationWarning>
                {vnTime.timeStr}
              </span>
              <span className="text-sm font-mono font-bold text-[var(--accent)] tabular-nums" suppressHydrationWarning>
                :{String(vnTime.seconds).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--fg-muted)] mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span className="text-[var(--fg)] font-bold">
                {displayDayName} • {formatScheduleDate(currentDayData.date)}
              </span>
              {isSelectedToday && (
                <span className="chip-peach px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full shadow-xs">
                  {language === 'vi' ? 'Hôm nay' : 'Today'}
                </span>
              )}
              <span className="text-[var(--fg-faint)]">•</span>
              <span className="text-[11px] font-medium text-[var(--fg-muted)]">
                {language === 'vi' ? (currentSchedule.gradeTitleVi || 'Lớp 11-TN') : (currentSchedule.gradeTitleEn || 'Grade 11-TN')} ({language === 'vi' ? 'P.' : 'R.'}{currentSchedule.room || '504'})
              </span>
            </div>
          </div>
        </div>

        {/* Center: Day Switcher */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] shadow-xs">
            {days.map((d) => {
              const isSelected = viewMode === 'timeline' && selectedDay === d.dayKey;
              const label = language === 'vi' ? dayLabelsVi[d.dayKey] : dayLabelsEn[d.dayKey];

              return (
                <motion.button
                  key={d.dayKey}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    onSelectDay(d.dayKey);
                    onViewModeChange('timeline');
                  }}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center z-10 ${
                    isSelected 
                      ? 'text-[var(--bg)] font-black' 
                      : 'text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="minimal-active-tab-desktop"
                      className="absolute inset-0 bg-[var(--fg)] rounded-xl shadow-xs z-[-1]"
                      transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    />
                  )}
                  <span>{label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 shrink-0">

          {availableWeeks && availableWeeks.length > 0 && onSelectWeek && (
            <WeekSelectorButton
              availableWeeks={availableWeeks}
              selectedWeekGid={selectedWeekGid}
              onSelectWeek={onSelectWeek}
              language={language}
            />
          )}

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onToggleMinimalMode}
            className="p-2 rounded-2xl border-[1.5px] border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)] font-black hover:bg-[var(--accent-hover)] transition cursor-pointer flex items-center justify-center shadow-xs"
            title={language === 'vi' ? "Thoát chế độ tối giản (Escape hoặc F)" : "Exit full-screen minimal mode (Esc / F)"}
          >
            <Minimize2 className="w-4 h-4 text-[var(--accent-fg)]" />
          </motion.button>
        </div>
      </div>

      {/* MOBILE LAYOUT (< md screens) */}
      <div className="flex md:hidden flex-col gap-2.5">
        {/* Tier 1: Clock (Left) + Quick Actions (Right) */}
        <div className="flex items-center justify-between gap-2">
          {/* Digital Clock */}
          <div className="flex items-baseline gap-1" suppressHydrationWarning>
            <span className="text-2xl xs:text-3xl font-display font-black tracking-tight text-[var(--fg)]" suppressHydrationWarning>
              {vnTime.timeStr}
            </span>
            <span className="text-xs font-mono font-bold text-[var(--accent)]" suppressHydrationWarning>
              :{String(vnTime.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-1.5 shrink-0">
            {availableWeeks && availableWeeks.length > 0 && onSelectWeek && (
              <WeekSelectorButton
                availableWeeks={availableWeeks}
                selectedWeekGid={selectedWeekGid}
                onSelectWeek={onSelectWeek}
                language={language}
              />
            )}

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onToggleMinimalMode}
              className="p-1.5 rounded-2xl border-[1.5px] border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)] font-black hover:bg-[var(--accent-hover)] transition cursor-pointer flex items-center justify-center shadow-xs"
              title={language === 'vi' ? "Thoát chế độ tối giản" : "Exit"}
            >
              <Minimize2 className="w-3.5 h-3.5 text-[var(--accent-fg)]" />
            </motion.button>
          </div>
        </div>

        {/* Tier 2: Date, Class & Period Count */}
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[var(--fg-muted)] border-t border-[var(--border)] pt-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3 h-3 text-[var(--accent)] shrink-0" />
            <span className="text-[var(--fg)] font-bold truncate">
              {displayDayName} • {formatScheduleDate(currentDayData.date)}
            </span>
            {isSelectedToday && (
              <span className="chip-peach px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-full shadow-xs shrink-0">
                {language === 'vi' ? 'Hôm nay' : 'Today'}
              </span>
            )}
          </div>
        </div>

        {/* Tier 3: Full-Width Day Switcher Tabs */}
        <div className="grid grid-cols-6 gap-1 p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] w-full shadow-xs">
          {days.map((d) => {
            const isSelected = viewMode === 'timeline' && selectedDay === d.dayKey;
            const label = language === 'vi' ? dayLabelsVi[d.dayKey] : dayLabelsEn[d.dayKey];

            return (
              <motion.button
                key={d.dayKey}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  onSelectDay(d.dayKey);
                  onViewModeChange('timeline');
                }}
                className={`relative py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center z-10 ${
                  isSelected 
                    ? 'text-[var(--bg)] font-black' 
                    : 'text-[var(--fg-secondary)] hover:text-[var(--fg)]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="minimal-active-tab-mobile"
                    className="absolute inset-0 bg-[var(--fg)] rounded-xl shadow-xs z-[-1]"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
};
