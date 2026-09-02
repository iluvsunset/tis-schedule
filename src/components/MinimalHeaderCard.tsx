import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Minimize2, 
  Sun, 
  Moon, 
  Laptop 
} from 'lucide-react';
import { Language, ThemeKey, ViewMode, DayKey, ScheduleData, WeekTabInfo } from '../types/schedule';
import { VietnamTimeInfo, getDateStatus } from '../utils/vietnamTime';
import { WeekSelectorButton } from './WeekSelectorButton';
import { SCHEDULE_DATA } from '../data/scheduleData';

interface MinimalHeaderCardProps {
  vnTime: VietnamTimeInfo;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  language: Language;
  theme: ThemeKey;
  onThemeChange: (theme: ThemeKey) => void;
  scheduleData: ScheduleData;
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
  theme,
  onThemeChange,
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

  const cycleTheme = () => {
    if (theme === 'system') onThemeChange('dark');
    else if (theme === 'dark') onThemeChange('light');
    else onThemeChange('system');
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
      className="glass-card border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl mb-2.5 sm:mb-4 sticky top-0 z-30 pt-[max(0.25rem,env(safe-area-inset-top,0px))] w-full"
    >
      {/* DESKTOP LAYOUT (>= md screens) */}
      <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Clock & Date */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                {vnTime.timeStr}
              </span>
              <span className="text-sm font-mono font-bold text-amber-500 dark:text-amber-400">
                :{String(vnTime.seconds).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-900 dark:text-slate-200 font-bold">
                {displayDayName} • {currentDayData.date}
              </span>
              {isSelectedToday && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md shadow-2xs">
                  {language === 'vi' ? 'Hôm nay' : 'Today'}
                </span>
              )}
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-[11px] font-medium text-slate-400">
                {currentSchedule.gradeTitleVi || 'Lớp 11-TN'} (P.{currentSchedule.room || '504'})
              </span>
            </div>
          </div>
        </div>

        {/* Center: Day Switcher */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80">
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
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center z-10 ${
                    isSelected 
                      ? 'text-white dark:text-slate-900' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="minimal-active-tab-desktop"
                      className="absolute inset-0 bg-slate-900 dark:bg-white rounded-xl shadow-sm z-[-1]"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
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
            onClick={cycleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center shadow-2xs"
            title={language === 'vi' ? "Chuyển giao diện Sáng / Tối" : "Toggle Theme"}
          >
            {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {theme === 'dark' && <Moon className="w-4 h-4 text-blue-400" />}
            {theme === 'system' && <Laptop className="w-4 h-4 text-slate-400" />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onToggleMinimalMode}
            className="p-2 rounded-xl border border-amber-400 bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition cursor-pointer flex items-center justify-center shadow-2xs"
            title={language === 'vi' ? "Thoát chế độ tối giản (Escape hoặc F)" : "Exit full-screen minimal mode (Esc / F)"}
          >
            <Minimize2 className="w-4 h-4 text-slate-950" />
          </motion.button>
        </div>
      </div>

      {/* MOBILE LAYOUT (< md screens) */}
      <div className="flex md:hidden flex-col gap-2.5">
        {/* Tier 1: Clock (Left) + Quick Actions (Right) */}
        <div className="flex items-center justify-between gap-2">
          {/* Digital Clock */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl xs:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              {vnTime.timeStr}
            </span>
            <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400">
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
              onClick={cycleTheme}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center shadow-2xs"
              title={language === 'vi' ? "Chuyển giao diện" : "Theme"}
            >
              {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-blue-400" />}
              {theme === 'system' && <Laptop className="w-3.5 h-3.5 text-slate-400" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={onToggleMinimalMode}
              className="p-1.5 rounded-xl border border-amber-400 bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition cursor-pointer flex items-center justify-center shadow-2xs"
              title={language === 'vi' ? "Thoát chế độ tối giản" : "Exit"}
            >
              <Minimize2 className="w-3.5 h-3.5 text-slate-950" />
            </motion.button>
          </div>
        </div>

        {/* Tier 2: Date, Class & Period Count */}
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-slate-900 dark:text-slate-200 font-bold truncate">
              {displayDayName} • {currentDayData.date}
            </span>
            {isSelectedToday && (
              <span className="px-1 py-0.2 text-[8px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded shadow-2xs shrink-0">
                {language === 'vi' ? 'Hôm nay' : 'Today'}
              </span>
            )}
          </div>
        </div>

        {/* Tier 3: Full-Width Day Switcher Tabs */}
        <div className="grid grid-cols-6 gap-1 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 w-full">
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
                className={`relative py-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center justify-center z-10 ${
                  isSelected 
                    ? 'text-white dark:text-slate-900' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="minimal-active-tab-mobile"
                    className="absolute inset-0 bg-slate-900 dark:bg-white rounded-lg shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
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
