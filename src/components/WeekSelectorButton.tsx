import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Check } from 'lucide-react';
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
        className="px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
        title={language === 'vi' ? "Chọn tuần học" : "Select week"}
      >
        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
        <span className="whitespace-nowrap">{activeWeekName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-1.5 w-44 z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-0.5 ring-1 ring-black/10"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
              {language === 'vi' ? 'Danh Sách Tuần' : 'School Weeks'}
            </div>
            {availableWeeks.slice().reverse().map((w) => {
              const isSelected = w.gid === selectedWeekGid || (!selectedWeekGid && w.isLatest);
              return (
                <button
                  key={w.gid}
                  onClick={() => {
                    onSelectWeek?.(w.gid);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{w.name}</span>
                    {w.isLatest && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        isSelected 
                          ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900' 
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        Mới
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
