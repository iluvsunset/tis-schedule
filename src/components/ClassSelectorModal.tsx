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

  const formatRoomLabel = (room: string) => {
    if (!room) return '';
    const clean = room.replace(/^phòng\s*/i, '').replace(/^p\.?\s*/i, '').trim();
    const cleanLower = clean.toLowerCase();
    if (cleanLower.includes('tâm lý') || cleanLower.includes('tam ly') || cleanLower === 'tl') {
      return language === 'vi' ? 'Phòng Tâm lý' : 'Psychology Room';
    }
    return `${language === 'vi' ? 'Phòng' : 'Room'} ${clean}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-[150] w-screen h-[100dvh] max-h-[100dvh] bg-[var(--bg)]/95 backdrop-blur-2xl text-[var(--fg)] flex flex-col justify-between p-5 sm:p-8 overflow-hidden select-none font-sans transition-colors duration-300 overscroll-none touch-none"
      >
        {/* Minimalist Top Bar */}
        <header className="w-full max-w-md mx-auto flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[var(--fg-muted)] font-bold">
            TIS SCHEDULE
          </span>

          <div className="flex items-center gap-2">
            {/* Minimalist Language Switcher Pill */}
            {onLanguageChange && (
              <div className="flex items-center p-0.5 rounded-full bg-[var(--surface-solid)] border border-[var(--border)] text-[11px] font-mono shadow-xs">
                <button
                  type="button"
                  onClick={() => onLanguageChange('vi')}
                  className={`px-3 py-0.5 rounded-full transition cursor-pointer font-bold ${
                    language === 'vi'
                      ? 'bg-[var(--fg)] text-[var(--bg)] shadow-xs'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  VI
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`px-3 py-0.5 rounded-full transition cursor-pointer font-bold ${
                    language === 'en'
                      ? 'bg-[var(--fg)] text-[var(--bg)] shadow-xs'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  EN
                </button>
              </div>
            )}

            {allowClose && (
              <button
                onClick={onClose}
                className="btn-cozy px-3 py-1 rounded-2xl text-xs font-bold text-[var(--fg)] transition cursor-pointer"
              >
                <span>{language === 'vi' ? 'Đóng' : 'Close'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Center Stage: Question + Minimized Button / Staggered Expanded List */}
        <main className="w-full max-w-md mx-auto my-auto py-4 sm:py-8 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-[var(--fg)] text-center mb-6"
          >
            {questionText}
          </motion.h1>

          <div ref={containerRef} className="w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                /* Minimized Button */
                <motion.button
                  key="minimized-trigger"
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsExpanded(true)}
                  className="btn-cozy w-full max-w-sm px-5 py-4 rounded-[22px] bg-[var(--surface-solid)] text-[var(--fg)] border-[1.5px] border-[var(--border)] shadow-puffy transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex flex-col text-left truncate mr-2">
                    <span className="text-[15px] font-bold text-[var(--fg)] truncate">
                      {selectedClass 
                        ? (language === 'vi' ? selectedClass.nameVi : selectedClass.nameEn)
                        : (language === 'vi' ? 'Chọn lớp học' : 'Select your class')}
                    </span>
                    {selectedClass && (
                      <span className="text-xs text-[var(--fg-muted)] truncate">
                        {formatRoomLabel(selectedClass.room)} • {selectedClass.homeroomTeacher}
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold chip-peach">
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
                  className="w-full rounded-[28px] bg-[var(--surface-solid)] border-[1.5px] border-[var(--border)] shadow-puffy overflow-hidden flex flex-col"
                >
                  {/* Fixed Header with Collapse Button */}
                  <div className="px-5 py-3.5 bg-[var(--bg-subtle)]/60 border-b border-[var(--border)] flex items-center justify-between shrink-0 z-20">
                    <span className="text-[11px] font-display font-bold text-[var(--fg-muted)] uppercase tracking-wider">
                      {language === 'vi' ? 'Danh sách lớp học' : 'All Classes'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="btn-cozy text-xs font-bold text-[var(--fg)] px-3 py-1 rounded-xl transition cursor-pointer"
                    >
                      {language === 'vi' ? 'Thu gọn' : 'Minimize'}
                    </button>
                  </div>

                  {/* Scrollable Container (Strictly class items) */}
                  <div className="w-full max-h-[50vh] sm:max-h-[60vh] overflow-y-auto overscroll-contain touch-pan-y divide-y divide-[var(--border)] no-scrollbar">
                    {/* THPT Group Header */}
                    <div className="px-4 py-2 bg-[var(--bg-subtle)]/90 backdrop-blur-md sticky top-0 z-10 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wider border-b border-[var(--border)]">
                      {language === 'vi' ? 'Khối THPT' : 'High School'}
                    </div>

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
                              ? 'chip-peach'
                              : 'hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className={`text-[15px] ${
                              isSelected 
                                ? 'font-bold' 
                                : 'font-semibold text-[var(--fg)]'
                            }`}>
                              {language === 'vi' ? c.nameVi : c.nameEn}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'opacity-85 font-medium' : 'text-[var(--fg-muted)]'}`}>
                              {language === 'vi' ? 'GVCN' : 'Homeroom'}: {c.homeroomTeacher}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className={`text-xs font-mono text-right max-w-[130px] truncate ${isSelected ? 'opacity-90 font-semibold' : 'text-[var(--fg-muted)]'}`}>
                              {formatRoomLabel(c.room)}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] shrink-0">
                                {language === 'vi' ? 'Đang chọn' : 'Selected'}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}

                    {/* THCS Group Header */}
                    <div className="px-4 py-2 bg-[var(--bg-subtle)]/90 backdrop-blur-md sticky top-0 z-10 text-[10px] font-bold text-[var(--fg-muted)] uppercase tracking-wider border-b border-[var(--border)]">
                      {language === 'vi' ? 'Khối THCS' : 'Middle School'}
                    </div>

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
                              ? 'chip-peach'
                              : 'hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className={`text-[15px] ${
                              isSelected 
                                ? 'font-bold' 
                                : 'font-semibold text-[var(--fg)]'
                            }`}>
                              {language === 'vi' ? c.nameVi : c.nameEn}
                            </span>
                            <span className={`text-xs mt-0.5 ${isSelected ? 'opacity-85 font-medium' : 'text-[var(--fg-muted)]'}`}>
                              {language === 'vi' ? 'GVCN' : 'Homeroom'}: {c.homeroomTeacher}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            <span className={`text-xs font-mono text-right max-w-[130px] truncate ${isSelected ? 'opacity-90 font-semibold' : 'text-[var(--fg-muted)]'}`}>
                              {formatRoomLabel(c.room)}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] shrink-0">
                                {language === 'vi' ? 'Đang chọn' : 'Selected'}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Quiet Footer */}
        <footer className="w-full max-w-md mx-auto text-center shrink-0">
          <span className="text-[11px] font-mono text-[var(--fg-muted)]">
            The International School • UTC+7
          </span>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};
