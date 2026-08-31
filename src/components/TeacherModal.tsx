import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap } from 'lucide-react';
import { Language } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { CustomSubjectIcon } from './CustomSubjectIcons';
import { 
  modalBackdropVariants, 
  modalSheetVariants, 
  staggerListContainer, 
  staggerListItem, 
  gestureTokens 
} from '../utils/motionTokens';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const { teachers, homeroomTeacher } = SCHEDULE_DATA;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Animated Ambient Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Animated Spring Modal Container */}
          <motion.div
            variants={modalSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] sm:max-h-[85vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center shadow-sm shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-display font-extrabold text-slate-900 dark:text-slate-100">
                    {language === 'vi' ? 'Đội Ngũ Giáo Viên Lớp 11-TN' : 'Grade 11-TN Faculty Directory'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'vi' ? `GVQN: ${homeroomTeacher.name} • Phòng 504` : `Homeroom: ${homeroomTeacher.name} • Room 504`}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={gestureTokens.iconButton.whileTap}
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Teacher Cards Grid (Scrollable with iOS touch support) */}
            <div 
              className="p-5 sm:p-6 pt-4 overflow-y-auto overscroll-contain flex-1 touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5"
                initial="hidden"
                animate="visible"
                variants={staggerListContainer}
              >
                {teachers.map((t, idx) => {
                  const subject = language === 'vi' ? t.subjectVi : t.subjectEn;
                  const subLower = t.subjectVi.toLowerCase();
                  let subType: import('../types/schedule').SubjectType = 'event';
                  if (subLower.includes('toán')) subType = 'math';
                  else if (subLower.includes('anh')) subType = 'english';
                  else if (subLower.includes('văn')) subType = 'literature';
                  else if (subLower.includes('lý')) subType = 'physics';
                  else if (subLower.includes('hóa')) subType = 'chemistry';
                  else if (subLower.includes('sinh')) subType = 'biology';
                  else if (subLower.includes('tin')) subType = 'cs';
                  else if (subLower.includes('gdtc') || subLower.includes('thể dục')) subType = 'pe';

                  return (
                    <motion.div
                      key={idx}
                      variants={staggerListItem}
                      whileTap={gestureTokens.card.whileTap}
                      className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between cursor-default"
                    >
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-center shrink-0">
                            <CustomSubjectIcon type={subType} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{t.name}</h4>
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">{subject}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                        <span>{t.room}</span>
                        <span className="bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">TIS</span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
