import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap } from './icons';
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
  // Lock body scroll while modal is open
  React.useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);
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
            className="fixed inset-0 bg-[#4a3b2f]/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Animated Spring Modal Container */}
          <motion.div
            variants={modalSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 bg-[var(--surface-solid)] border-[1.5px] border-[var(--border)] rounded-[28px] shadow-puffy max-w-3xl w-full max-h-[85vh] sm:max-h-[85vh] flex flex-col overflow-hidden text-[var(--fg)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-[var(--border)] shrink-0 bg-[var(--bg-subtle)]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shadow-[0_2px_0_var(--edge)] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-display font-bold text-[var(--fg)]">
                    {language === 'vi' ? 'Đội Ngũ Giáo Viên Bộ Môn' : 'Faculty Directory'}
                  </h3>
                  <p className="text-xs text-[var(--fg-muted)]">
                    {language === 'vi' ? `GVQN: ${homeroomTeacher.name} • Phòng 504` : `Homeroom: ${homeroomTeacher.name} • Room 504`}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={gestureTokens.iconButton.whileTap}
                onClick={onClose}
                className="btn-cozy w-9 h-9 rounded-2xl flex items-center justify-center transition cursor-pointer text-[var(--fg)]"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Teacher Cards Grid (Scrollable with iOS touch support) */}
            <div 
              className="p-5 sm:p-6 pt-4 overflow-y-auto overscroll-contain flex-1 touch-pan-y no-scrollbar"
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
                      className="p-3.5 rounded-2xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-[1.5px] border-[var(--border)] hover:border-[var(--border-hover)] shadow-xs transition-all flex flex-col justify-between cursor-default"
                    >
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-[var(--surface-solid)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-2xs">
                            <CustomSubjectIcon type={subType} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-[var(--fg)] truncate">{t.name}</h4>
                            <span className="text-[11px] font-semibold text-[var(--fg-muted)] block truncate">{subject}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[var(--fg-muted)] font-medium pt-2 border-t border-[var(--border)]">
                        <span className="font-mono">{t.room}</span>
                        <span className="chip-mist font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">TIS</span>
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
