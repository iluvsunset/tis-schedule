import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, School, Search } from 'lucide-react';
import { ClassInfo, Language } from '../types/schedule';
import { modalBackdropVariants, modalContentVariants, listContainerVariants, listItemVariants, springTactile } from '../utils/motionTokens';

interface ClassSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassInfo[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  language: Language;
  allowClose?: boolean;
}

/**
 * Minimalist luxury 1-stroke checkmark (clean single-ring vector animation)
 */
const LuxuryAnimatedCheckmark: React.FC = () => (
  <motion.div
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.6, opacity: 0 }}
    transition={springTactile}
    className="w-6 h-6 flex items-center justify-center shrink-0 text-amber-500 dark:text-amber-400"
  >
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="w-5 h-5"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-30"
      />
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      <motion.path
        d="M7.5 12.2L10.5 15.2L16.5 8.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
      />
    </svg>
  </motion.div>
);

export const ClassSelectorModal: React.FC<ClassSelectorModalProps> = ({
  isOpen,
  onClose,
  classes,
  selectedClassId,
  onSelectClass,
  language,
  allowClose = true
}) => {
  const [search, setSearch] = useState('');

  const filteredClasses = classes.filter(c => {
    const q = search.toLowerCase();
    return (
      c.nameVi.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.room.toLowerCase().includes(q) ||
      c.homeroomTeacher.toLowerCase().includes(q)
    );
  });

  const middleSchool = filteredClasses.filter(c => c.level === 'middle');
  const highSchool = filteredClasses.filter(c => c.level === 'high');

  const handleChoose = (id: string) => {
    onSelectClass(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          
          {/* Backdrop with Fade */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={allowClose ? onClose : undefined}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Window with spring sheet pop-in */}
          <motion.div
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 max-h-[85vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
          >
            
            {/* Sticky Header with Official TIS Logo & Search Box */}
            <div className="p-4 sm:p-6 pb-3 shrink-0 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                    <img 
                      src="/tis-logo.png" 
                      alt="TIS Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      The International School • TIS
                    </div>
                    <h3 className="font-display font-black text-lg sm:text-2xl text-slate-900 dark:text-slate-100">
                      {language === 'vi' ? 'Chọn Lớp Học Của Bạn' : 'Select Your Class'}
                    </h3>
                  </div>
                </div>

                {allowClose && (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={language === 'vi' ? "Tìm theo tên lớp, phòng học, giáo viên..." : "Search by class, room, teacher..."}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-slate-400 dark:focus:border-slate-500 transition"
                />
              </div>
            </div>

            {/* Scrollable Classes List (iOS Safari Touch Pan Enabled) */}
            <div 
              className="p-4 sm:p-6 pt-3 overflow-y-auto overscroll-contain flex-1 touch-pan-y space-y-5"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* THPT Section */}
              {highSchool.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <GraduationCap className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? 'Khối Trung Học Phổ Thông (THPT)' : 'High School (Grades 10 – 12)'}
                    </h4>
                  </div>
                  <motion.div 
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    {highSchool.map((c) => {
                      const isSelected = selectedClassId === c.id;
                      return (
                        <motion.button
                          key={c.id}
                          variants={listItemVariants}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChoose(c.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-amber-500/80 dark:border-amber-400/80 shadow-md ring-2 ring-amber-400/25'
                              : 'bg-slate-100/80 hover:bg-slate-200/70 dark:bg-slate-800/70 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 shadow-2xs'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-display font-extrabold text-base ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                                {language === 'vi' ? c.nameVi : c.nameEn}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                                isSelected
                                   ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                              }`}>
                                Phòng {c.room}
                              </span>
                            </div>
                            <div className={`text-xs mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                              GVQN: {c.homeroomTeacher}
                            </div>
                          </div>

                          {isSelected && <LuxuryAnimatedCheckmark />}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              )}

              {/* THCS Section */}
              {middleSchool.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <School className="w-4 h-4 text-blue-500" />
                    <h4 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? 'Khối Trung Học Cơ Sở (THCS)' : 'Middle School (Grades 6 – 9)'}
                    </h4>
                  </div>
                  <motion.div 
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    {middleSchool.map((c) => {
                      const isSelected = selectedClassId === c.id;
                      return (
                        <motion.button
                          key={c.id}
                          variants={listItemVariants}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChoose(c.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-amber-500/80 dark:border-amber-400/80 shadow-md ring-2 ring-amber-400/25'
                              : 'bg-slate-100/80 hover:bg-slate-200/70 dark:bg-slate-800/70 dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 shadow-2xs'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-display font-extrabold text-base ${isSelected ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                                {language === 'vi' ? c.nameVi : c.nameEn}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                                isSelected
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                              }`}>
                                Phòng {c.room}
                              </span>
                            </div>
                            <div className={`text-xs mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                              GVQN: {c.homeroomTeacher}
                            </div>
                          </div>

                          {isSelected && <LuxuryAnimatedCheckmark />}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
