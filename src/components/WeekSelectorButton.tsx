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
        className="px-3 py-1.5 rounded-2xl text-xs font-mono font-bold bg-[var(--surface-solid)] hover:bg-[var(--surface-hover)] border-[1.5px] border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--fg)] transition-all flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0 shadow-xs"
        title={language === 'vi' ? "Chọn tuần học" : "Select week"}
      >
        <span>{activeWeekName}</span>
        <span className={`text-[10px] text-[var(--fg-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-2 w-48 z-[100] bg-[var(--surface-solid)] border-[1.5px] border-[var(--border)] rounded-[24px] shadow-puffy p-2 space-y-1 backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-muted)] border-b border-[var(--border)]">
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
                      ? 'bg-[var(--fg)] text-[var(--bg)] font-bold'
                      : 'text-[var(--fg-secondary)] hover:bg-[var(--surface-active)] hover:text-[var(--fg)]'
                  }`}
                >
                  <span>{week.name}</span>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider">Active</span>
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
