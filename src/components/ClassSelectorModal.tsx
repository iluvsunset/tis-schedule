import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, School, Check, Search, Sparkles } from 'lucide-react';
import { ClassInfo, Language } from '../types/schedule';

interface ClassSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassInfo[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  language: Language;
  allowClose?: boolean;
}

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

  if (!isOpen) return null;

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
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={allowClose ? onClose : undefined}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: "spring", damping: 26, stiffness: 420 }}
          className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 z-10 my-auto max-h-[90vh] overflow-y-auto"
        >
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{language === 'vi' ? 'Thời Khóa Biểu Toàn Trường' : 'Universal School Schedule'}</span>
                </div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
                  {language === 'vi' ? 'Chọn Lớp Học Của Bạn' : 'Select Your Class'}
                </h3>
              </div>
            </div>

            {allowClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative mb-5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'vi' ? "Tìm theo tên lớp, phòng học, giáo viên..." : "Search by class, room, teacher..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Classes Grid by Level */}
          <div className="space-y-5">
            
            {/* THPT Section */}
            {highSchool.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'vi' ? 'Khối Trung Học Phổ Thông (THPT)' : 'High School (Grades 10 – 12)'}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {highSchool.map((c) => {
                    const isSelected = selectedClassId === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoose(c.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg ring-2 ring-emerald-400/40'
                            : 'bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-extrabold text-base">
                              {language === 'vi' ? c.nameVi : c.nameEn}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900 font-bold'
                                : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                            }`}>
                              Phòng {c.room}
                            </span>
                          </div>
                          <div className={`text-xs mt-0.5 truncate ${isSelected ? 'opacity-85' : 'text-slate-400 dark:text-slate-500'}`}>
                            GVQN: {c.homeroomTeacher}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* THCS Section */}
            {middleSchool.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <School className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {language === 'vi' ? 'Khối Trung Học Cơ Sở (THCS)' : 'Middle School (Grades 6 – 9)'}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {middleSchool.map((c) => {
                    const isSelected = selectedClassId === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleChoose(c.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg ring-2 ring-emerald-400/40'
                            : 'bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-extrabold text-base">
                              {language === 'vi' ? c.nameVi : c.nameEn}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900 font-bold'
                                : 'bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300'
                            }`}>
                              Phòng {c.room}
                            </span>
                          </div>
                          <div className={`text-xs mt-0.5 truncate ${isSelected ? 'opacity-85' : 'text-slate-400 dark:text-slate-500'}`}>
                            GVQN: {c.homeroomTeacher}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
