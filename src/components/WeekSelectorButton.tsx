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
        className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 transition-all flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0"
        title={language === 'vi' ? "Chọn tuần học" : "Select week"}
      >
        <span>{activeWeekName}</span>
        <span className={`text-[10px] text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-2 w-48 z-[100] bg-[#0f1016] border border-white/[0.08] rounded-2xl shadow-2xl p-1.5 space-y-1"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a869] border-b border-white/[0.06]">
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
                      ? 'bg-[#c5a869]/15 text-[#c5a869] font-bold border border-[#c5a869]/30'
                      : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <span>{week.name}</span>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#c5a869]">Active</span>
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
