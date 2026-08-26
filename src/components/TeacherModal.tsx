import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Sparkles } from 'lucide-react';
import { Language } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { CustomSubjectIcon } from './CustomSubjectIcons';

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Animated Spring Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25, rotateX: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="relative z-10 bg-white/95 backdrop-blur-2xl border border-rose-200/90 rounded-[32px] p-5 sm:p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded-md border border-purple-100">
                      TIS Faculty 11-TN
                    </span>
                    <Sparkles className="w-3 h-3 text-purple-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-slate-900 mt-0.5">
                    {language === 'vi' ? 'Đội Ngũ Giáo Viên Lớp 11-TN' : 'Grade 11-TN Faculty Directory'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'vi' ? `GVQN: ${homeroomTeacher.name} • Phòng học 504` : `Homeroom: ${homeroomTeacher.name} • Room 504`}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Teacher Cards Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.04 }
                }
              }}
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
                    variants={{
                      hidden: { opacity: 0, y: 12, scale: 0.96 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-soft hover:border-purple-200 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          <CustomSubjectIcon type={subType} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-800 truncate">{t.name}</h4>
                          <span className="text-[11px] font-semibold text-purple-600 block truncate">{subject}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-50">
                      <span>{t.room}</span>
                      <span className="bg-purple-50 text-purple-600 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">TIS</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
