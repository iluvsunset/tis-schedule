import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomInfo, ClassInfo, Language, INITIAL_ROOMS, INITIAL_CLASSES } from '../types/schedule';

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
  rooms = INITIAL_ROOMS,
  classes = INITIAL_CLASSES,
  language,
  onLanguageChange,
  allowClose = true
}) => {
  const [typedRoom, setTypedRoom] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll completely while modal is open to hide background window scrollbar
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

  // Auto focus input whenever modal opens, keeping it blank without auto typing
  useEffect(() => {
    if (isOpen) {
      setTypedRoom('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  const cleanTypedId = useMemo(() => {
    return typedRoom.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  }, [typedRoom]);

  const matchedRoom = useMemo(() => {
    if (!cleanTypedId) return null;
    const cleanLower = cleanTypedId.toLowerCase();
    const cleanNoDiacritics = cleanLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return rooms.find(r => {
      const rIdClean = r.id.toLowerCase().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
      const rNameClean = r.nameVi.toLowerCase().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
      const rNameEn = r.nameEn.toLowerCase();
      const rNoDiacritics = rNameClean.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      return rIdClean === cleanLower ||
             rNameClean === cleanLower ||
             rNameEn === cleanLower ||
             rNoDiacritics === cleanNoDiacritics ||
             rNoDiacritics.includes(cleanNoDiacritics) ||
             (cleanNoDiacritics === 'tl' && rNoDiacritics.includes('tam ly')) ||
             (cleanNoDiacritics === 'tam ly' && rNoDiacritics.includes('tam ly'));
    }) || null;
  }, [rooms, cleanTypedId]);

  // Is typed room valid or invalid?
  const isTypedInvalid = cleanTypedId.length > 0 && !matchedRoom;

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (matchedRoom) {
      onSelectRoom(matchedRoom.id);
      onClose();
    }
  };

  const handlePickClass = (c: ClassInfo) => {
    if (onSelectClass) {
      onSelectClass(c.id, c.room);
    } else {
      onSelectRoom(c.room);
    }
    onClose();
  };

  const highSchoolClasses = useMemo(() => classes.filter(c => c.level === 'high'), [classes]);
  const middleSchoolClasses = useMemo(() => classes.filter(c => c.level === 'middle'), [classes]);

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

          {/* Two-Panel Horizontal Screen Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl lg:max-w-5xl bg-white/95 dark:bg-[#10131c]/95 border border-slate-200/80 dark:border-white/[0.08] shadow-2xl backdrop-blur-2xl rounded-3xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Top Bar: Title, Language Switcher, Close Button */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02] shrink-0">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                TIS SCHEDULE · {language === 'vi' ? 'CHỌN LỊCH HỌC' : 'CHOOSE SCHEDULE'}
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

            {/* Two Panels: Left = Room Type-In, Right = Class Choosing */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/[0.08] overflow-y-auto no-scrollbar">
              
              {/* LEFT PANEL: Room Number Type-In (Centered Box) */}
              <div className="p-6 sm:p-8 flex flex-col justify-center space-y-6">
                <div>
                  <div className="mb-5 text-center sm:text-left">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {language === 'vi' ? 'Nhập mã phòng để tra cứu lịch phòng học trực tiếp' : 'Enter room number to view live room schedule'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* The Centerpiece Box */}
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        inputMode="text"
                        value={typedRoom}
                        onChange={(e) => setTypedRoom(e.target.value)}
                        placeholder={language === 'vi' ? "504, 4012, Tâm lý..." : "504, 4012, Psychology..."}
                        className={`w-full text-center py-4 px-6 text-2xl sm:text-3xl font-mono font-bold tracking-wider text-slate-900 dark:text-white bg-slate-50/80 dark:bg-white/[0.03] border-2 rounded-[22px] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner ${
                          isTypedInvalid
                            ? 'border-rose-400 dark:border-rose-500/80 ring-2 ring-rose-400/20'
                            : 'border-slate-200 dark:border-white/[0.1] focus:border-slate-900 dark:focus:border-white/40 focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10'
                        }`}
                        autoFocus
                      />
                    </div>

                    {/* Room Resolution / Real-time Feedback */}
                    <div className="min-h-6 flex items-center justify-center text-center px-2">
                      {matchedRoom ? (
                        <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ {language === 'vi' ? matchedRoom.nameVi : matchedRoom.nameEn} · {language === 'vi' ? matchedRoom.defaultClassVi : matchedRoom.defaultClassEn} ({language === 'vi' ? 'Nhấn Enter ↵' : 'Press Enter ↵'})
                        </div>
                      ) : isTypedInvalid ? (
                        <div className="text-xs font-mono text-rose-500 dark:text-rose-400 font-medium leading-tight">
                          ⚠ {language === 'vi' 
                            ? `Không tìm thấy phòng "${cleanTypedId}". Vui lòng thử lại hoặc chọn theo Lớp học bên phải ➔` 
                            : `Room "${cleanTypedId}" not found. Please try again or select your class on the right ➔`}
                        </div>
                      ) : null}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!matchedRoom}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-slate-900 font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
                    >
                      {matchedRoom 
                        ? (language === 'vi' ? 'Xem Thời Khóa Biểu (Enter)' : 'View Schedule (Enter)') 
                        : isTypedInvalid 
                            ? (language === 'vi' ? 'Phòng không tồn tại' : 'Room Not Found')
                            : (language === 'vi' ? 'Nhập số phòng...' : 'Enter room...')}
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT PANEL: Class Choosing (Like the old one) */}
              <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[500px] md:max-h-[560px]">
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="space-y-1 mb-4">
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400 font-bold">
                      {language === 'vi' ? 'HOẶC CHỌN THEO LỚP HỌC' : 'OR CHOOSE BY CLASS'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === 'vi' ? 'Danh sách các lớp THPT & THCS' : 'List of all High School & Middle School classes'}
                    </p>
                  </div>

                  {/* Scrollable Class List */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
                    
                    {/* THPT Group */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1 block">
                        {language === 'vi' ? 'Khối THPT' : 'High School'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {highSchoolClasses.map(c => {
                          const isCurrent = c.id === selectedClassId || c.room === selectedRoomId;
                          const classNameStr = language === 'vi' ? c.nameVi : c.nameEn;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handlePickClass(c)}
                              title={`${classNameStr} • ${c.homeroomTeacher}`}
                              className={`h-[64px] px-3 py-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
                                isCurrent
                                  ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-500/30 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border-slate-200/80 dark:border-white/[0.06] text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5 w-full min-w-0">
                                <span className={`text-xs sm:text-[13px] truncate ${isCurrent ? 'font-bold text-amber-700 dark:text-amber-400' : 'font-semibold'}`}>
                                  {classNameStr}
                                </span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                                  isCurrent
                                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold'
                                    : 'bg-slate-200/60 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
                                }`}>
                                  {formatRoomBadge(c.room)}
                                </span>
                              </div>
                              <span className={`text-[11px] truncate w-full ${isCurrent ? 'text-amber-700/80 dark:text-amber-300/80 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === 'vi' ? 'GV' : 'HR'}: {c.homeroomTeacher}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* THCS Group */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1 block">
                        {language === 'vi' ? 'Khối THCS' : 'Middle School'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {middleSchoolClasses.map(c => {
                          const isCurrent = c.id === selectedClassId || c.room === selectedRoomId;
                          const classNameStr = language === 'vi' ? c.nameVi : c.nameEn;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handlePickClass(c)}
                              title={`${classNameStr} • ${c.homeroomTeacher}`}
                              className={`h-[64px] px-3 py-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
                                isCurrent
                                  ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-500/30 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border-slate-200/80 dark:border-white/[0.06] text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5 w-full min-w-0">
                                <span className={`text-xs sm:text-[13px] truncate ${isCurrent ? 'font-bold text-amber-700 dark:text-amber-400' : 'font-semibold'}`}>
                                  {classNameStr}
                                </span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                                  isCurrent
                                    ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold'
                                    : 'bg-slate-200/60 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
                                }`}>
                                  {formatRoomBadge(c.room)}
                                </span>
                              </div>
                              <span className={`text-[11px] truncate w-full ${isCurrent ? 'text-amber-700/80 dark:text-amber-300/80 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === 'vi' ? 'GV' : 'HR'}: {c.homeroomTeacher}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.08] text-center">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {language === 'vi' ? 'Chọn lớp học để tự động mở thời khóa biểu của phòng tương ứng' : 'Select a class to automatically load its room schedule'}
                  </span>
                </div>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
