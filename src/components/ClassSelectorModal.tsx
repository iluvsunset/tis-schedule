import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ClassInfo, Language } from '../types/schedule';

interface ClassSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassInfo[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  allowClose?: boolean;
}

// Letter-by-letter title container
const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.05,
    },
  },
};

// Letter variant: delicate spring reveal with blur clear
const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: 'blur(5px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 450,
      damping: 26,
    },
  },
};

// Stagger container: reveals every class one at a time
const listContainerVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
      staggerChildren: 0.045, // Stagger each class item sequentially
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// Item variant: slide up, de-blur, and spring into place
const classItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 28,
    },
  },
};

export const ClassSelectorModal: React.FC<ClassSelectorModalProps> = ({
  isOpen,
  onClose,
  classes,
  selectedClassId,
  onSelectClass,
  language,
  onLanguageChange,
  allowClose = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll completely while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [isOpen]);

  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isExpanded) {
          setIsExpanded(false);
        } else if (allowClose) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isExpanded, allowClose, onClose]);

  // Click outside to collapse
  useEffect(() => {
    if (!isExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  const selectedClass = useMemo(() => {
    return classes.find(c => c.id === selectedClassId);
  }, [classes, selectedClassId]);

  const highSchool = useMemo(() => classes.filter(c => c.level === 'high'), [classes]);
  const middleSchool = useMemo(() => classes.filter(c => c.level === 'middle'), [classes]);

  const handleSelect = (id: string) => {
    onSelectClass(id);
    setIsExpanded(false);
    onClose();
  };

  const questionText = language === 'vi' ? 'Bạn học ở lớp nào?' : 'Which class are you in?';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-[150] w-screen h-[100dvh] max-h-[100dvh] bg-[#f2f2f7] dark:bg-black sm:dark:bg-[#09090b] text-slate-900 dark:text-white flex flex-col justify-between p-5 sm:p-8 overflow-hidden select-none font-sans transition-colors duration-300 overscroll-none touch-none"
      >
        {/* Minimalist Top Bar (Zero Icons) */}
        <header className="w-full max-w-md mx-auto flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500">
            TIS SCHEDULE
          </span>

          <div className="flex items-center gap-2">
            {/* Apple-Style Minimalist Language Switcher Pill */}
            {onLanguageChange && (
              <div className="flex items-center p-0.5 rounded-full bg-black/5 dark:bg-white/[0.06] border border-black/10 dark:border-white/[0.08] text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => onLanguageChange('vi')}
                  className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                    language === 'vi'
                      ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  VI
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                    language === 'en'
                      ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            )}

            {allowClose && (
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-black/5 hover:bg-black/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-black/10 dark:border-white/[0.08] transition cursor-pointer"
              >
                <span>{language === 'vi' ? 'Đóng' : 'Close'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Center Stage: Question with Letter-by-Letter Animation + Minimized Button / Staggered Expanded List */}
        <main className="w-full max-w-md mx-auto my-auto py-4 sm:py-8 flex flex-col items-center">
          {/* Pure Question with Letter-by-Letter Staggered Spring Reveal */}
          <motion.h1
            key={questionText}
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white text-center mb-6 flex flex-wrap justify-center"
          >
            {questionText.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-2 last:mr-0">
                {Array.from(word).map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.h1>

          <div ref={containerRef} className="w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                /* Minimized Button (Zero Icons) */
                <motion.button
                  key="minimized-trigger"
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsExpanded(true)}
                  className="w-full max-w-sm px-5 py-3.5 rounded-2xl bg-white dark:bg-white/[0.06] text-slate-900 dark:text-white border border-black/[0.06] dark:border-white/[0.08] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex flex-col text-left truncate mr-2">
                    <span className="text-[15px] font-medium text-slate-900 dark:text-white truncate">
                      {selectedClass 
                        ? (language === 'vi' ? selectedClass.nameVi : selectedClass.nameEn)
                        : (language === 'vi' ? 'Chọn lớp học' : 'Select your class')}
                    </span>
                    {selectedClass && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {language === 'vi' ? 'Phòng' : 'Room'} {selectedClass.room} • {selectedClass.homeroomTeacher}
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 px-3 py-1 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    {language === 'vi' ? 'Chọn lớp' : 'Choose'}
                  </span>
                </motion.button>
              ) : (
                /* Expanded Apple Inset Grouped List with Staggered Entrance */
                <motion.div
                  key="expanded-list"
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full max-h-[58vh] sm:max-h-[68vh] overflow-y-auto overscroll-contain touch-pan-y rounded-2xl bg-white dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] shadow-md dark:shadow-none backdrop-blur-xl divide-y divide-black/[0.05] dark:divide-white/[0.06]"
                >
                  {/* Header with Collapse Button */}
                  <motion.div 
                    variants={classItemVariants}
                    className="px-4 py-2.5 bg-slate-100/60 dark:bg-white/[0.03] flex items-center justify-between sticky top-0 backdrop-blur-md z-10"
                  >
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {language === 'vi' ? 'Danh sách lớp học' : 'All Classes'}
                    </span>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                    >
                      {language === 'vi' ? 'Thu gọn' : 'Minimize'}
                    </button>
                  </motion.div>

                  {/* THPT Group Header */}
                  <motion.div 
                    variants={classItemVariants}
                    className="px-4 py-1.5 bg-slate-50/50 dark:bg-white/[0.01] text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                  >
                    {language === 'vi' ? 'Khối THPT' : 'High School'}
                  </motion.div>

                  {/* THPT Classes: Each appears one at a time */}
                  {highSchool.map((c) => {
                    const isSelected = selectedClassId === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        variants={classItemVariants}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelect(c.id)}
                        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-white/[0.08]'
                            : 'hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/[0.04] dark:active:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-[15px] ${
                            isSelected 
                              ? 'font-semibold text-amber-600 dark:text-amber-400' 
                              : 'font-medium text-slate-900 dark:text-slate-100'
                          }`}>
                            {language === 'vi' ? c.nameVi : c.nameEn}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {language === 'vi' ? 'GVCN' : 'Homeroom'}: {c.homeroomTeacher}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {language === 'vi' ? 'Phòng' : 'Room'} {c.room}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/15 dark:bg-amber-400/10">
                              {language === 'vi' ? 'Đang chọn' : 'Selected'}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* THCS Group Header */}
                  <motion.div 
                    variants={classItemVariants}
                    className="px-4 py-1.5 bg-slate-50/50 dark:bg-white/[0.01] text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-t border-black/[0.05] dark:border-white/[0.06]"
                  >
                    {language === 'vi' ? 'Khối THCS' : 'Middle School'}
                  </motion.div>

                  {/* THCS Classes: Each appears one at a time */}
                  {middleSchool.map((c) => {
                    const isSelected = selectedClassId === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        variants={classItemVariants}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelect(c.id)}
                        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-white/[0.08]'
                            : 'hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/[0.04] dark:active:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-[15px] ${
                            isSelected 
                              ? 'font-semibold text-amber-600 dark:text-amber-400' 
                              : 'font-medium text-slate-900 dark:text-slate-100'
                          }`}>
                            {language === 'vi' ? c.nameVi : c.nameEn}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {language === 'vi' ? 'GVCN' : 'Homeroom'}: {c.homeroomTeacher}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {language === 'vi' ? 'Phòng' : 'Room'} {c.room}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-500/15 dark:bg-amber-400/10">
                              {language === 'vi' ? 'Đang chọn' : 'Selected'}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Quiet Footer */}
        <footer className="w-full max-w-md mx-auto text-center shrink-0">
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-600">
            The International School • UTC+7
          </span>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
