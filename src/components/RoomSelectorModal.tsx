import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomInfo, ClassInfo, Language, INITIAL_CLASSES } from '../types/schedule';

interface RoomSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomId: string;
  selectedClassId?: string;
  onSelectRoom: (roomId: string) => void;
  onSelectClass?: (classId: string, mappedRoomId: string) => void;
  rooms?: RoomInfo[];
  classes?: ClassInfo[];
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  allowClose?: boolean;
}

export const RoomSelectorModal: React.FC<RoomSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedRoomId,
  selectedClassId,
  onSelectRoom,
  onSelectClass,
  classes = INITIAL_CLASSES,
  language,
  onLanguageChange,
  allowClose = true
}) => {
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

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && allowClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, allowClose, onClose]);

  const handlePickClass = (c: ClassInfo) => {
    if (onSelectClass) {
      onSelectClass(c.id, c.room);
    } else {
      onSelectRoom(c.room);
    }
    onClose();
  };

  const formatRoomBadge = (room: string) => {
    if (!room) return '';
    const clean = room.replace(/^phòng\s*/i, '').replace(/^p\.?\s*/i, '').trim();
    const cleanLower = clean.toLowerCase();
    if (cleanLower.includes('tâm lý') || cleanLower.includes('tam ly') || cleanLower === 'tl') {
      return language === 'vi' ? 'P. Tâm lý' : 'Psych Rm';
    }
    return language === 'vi' ? `P.${clean}` : `Rm ${clean}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 select-none overflow-hidden">
          
          {/* Backdrop (click to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={allowClose ? onClose : undefined}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
          />

          {/* Focused Grade 11 Class Switcher Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white/95 dark:bg-[#10131c]/95 border border-slate-200/80 dark:border-white/[0.08] shadow-2xl backdrop-blur-2xl rounded-3xl z-10 overflow-hidden flex flex-col"
          >
            {/* Top Bar: Title, Language Switcher, Close Button */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02] shrink-0">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                TIS SCHEDULE · {language === 'vi' ? 'CHỌN LỚP HỌC' : 'CHOOSE CLASS'}
              </span>

              <div className="flex items-center gap-2.5">
                {onLanguageChange && (
                  <div className="flex items-center border border-slate-200 dark:border-white/[0.1] rounded-full p-0.5 text-xs font-mono bg-slate-100/60 dark:bg-white/[0.04]">
                    <button
                      type="button"
                      onClick={() => onLanguageChange('vi')}
                      className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                        language === 'vi' 
                          ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-bold shadow-xs' 
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      VI
                    </button>
                    <button
                      type="button"
                      onClick={() => onLanguageChange('en')}
                      className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                        language === 'en' 
                          ? 'bg-white dark:bg-white/20 text-slate-900 dark:text-white font-bold shadow-xs' 
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                )}

                {allowClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs font-mono uppercase text-slate-400 hover:text-slate-700 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition cursor-pointer"
                  >
                    {language === 'vi' ? 'Đóng' : 'Close'}
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body: Two Grade 11 Class Cards */}
            <div className="p-6 sm:p-7 space-y-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {language === 'vi' ? 'Khối 11 (Năm học 2026 - 2027)' : 'Grade 11 (Academic Year 2026 - 2027)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'vi' 
                    ? 'Chọn lớp học của bạn để xem thời khóa biểu chi tiết' 
                    : 'Select your class to view the full timetable'}
                </p>
              </div>

              {/* Class Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {classes.map(c => {
                  const isCurrent = c.id === selectedClassId || c.room === selectedRoomId;
                  const classNameStr = language === 'vi' ? c.nameVi : c.nameEn;
                  const is11_1 = c.id.includes('11.1') || c.id === '11-tn';
                  
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handlePickClass(c)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden group ${
                        isCurrent
                          ? 'bg-amber-500/10 text-amber-950 dark:text-amber-200 border-amber-500/40 shadow-sm ring-1 ring-amber-500/20'
                          : 'bg-slate-50/80 hover:bg-slate-100/90 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border-slate-200/80 dark:border-white/[0.08] text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className={`text-base font-bold tracking-tight ${isCurrent ? 'text-amber-700 dark:text-amber-300' : 'text-slate-900 dark:text-white'}`}>
                          {classNameStr}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 font-semibold ${
                          isCurrent
                            ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-200/60 dark:bg-white/[0.08] text-slate-600 dark:text-slate-400'
                        }`}>
                          {formatRoomBadge(c.room)}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>{language === 'vi' ? 'Vị trí:' : 'Floor:'}</span>
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            {is11_1 ? (language === 'vi' ? 'Tầng 5 · P.504' : 'Floor 5 · Rm 504') : (language === 'vi' ? 'Tầng 5 · P. Tâm lý' : 'Floor 5 · Psych Rm')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>{language === 'vi' ? 'GVCN:' : 'Homeroom:'}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {c.homeroomTeacher}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold pt-1 border-t border-amber-500/20 flex items-center gap-1">
                          <span>●</span> {language === 'vi' ? 'Đang chọn' : 'Active'}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {language === 'vi' 
                    ? 'Thời khóa biểu Khối 11 · Trường TIS' 
                    : 'Grade 11 Timetable · The International School'}
                </span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
