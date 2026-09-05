import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeekTabInfo, Language } from '../types/schedule';
import { gestureTokens, dropdownVariants } from '../utils/motionTokens';

interface WeekSelectorProps {
  availableWeeks: WeekTabInfo[];
  selectedWeekGid?: string;
  onSelectWeek?: (gid: string) => void;
  language: Language;
}

export const WeekSelectorButton: React.FC<WeekSelectorProps> = ({
  availableWeeks,
  selectedWeekGid,
  onSelectWeek,
  language
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeWeekObj = availableWeeks.find(w => w.gid === selectedWeekGid) || availableWeeks[availableWeeks.length - 1];
  const activeWeekName = activeWeekObj?.name || 'Tuần 5/8';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!availableWeeks || availableWeeks.length <= 1) return null;

  return (
    <div className={`relative inline-block shrink-0 no-print ${isOpen ? 'z-50' : 'z-30'}`} ref={dropdownRef}>
      <motion.button
        whileTap={gestureTokens.button.whileTap}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0 shadow-2xs"
        title={language === 'vi' ? "Chọn tuần học" : "Select week"}
      >
        <span>{activeWeekName}</span>
        <span className={`text-[10px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-2 w-48 z-[100] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 space-y-1"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
              {language === 'vi' ? 'Tuần biểu' : 'Week Schedule'}
            </div>
            {availableWeeks.map((week) => {
              const isSelected = week.gid === selectedWeekGid || (!selectedWeekGid && week === activeWeekObj);
              return (
                <button
                  key={week.gid}
                  onClick={() => {
                    onSelectWeek?.(week.gid);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{week.name}</span>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-mono tracking-wider">Active</span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
