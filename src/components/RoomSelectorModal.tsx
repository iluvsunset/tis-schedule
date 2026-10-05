import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from './icons';
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
            className="fixed inset-0 bg-[#4a3b2f]/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Two-Panel Horizontal Screen Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl lg:max-w-5xl bg-[var(--surface-solid)] border-[1.5px] border-[var(--border)] shadow-puffy rounded-[28px] z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Top Bar: Title, Language Switcher, Close Button */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-subtle)]/40 shrink-0">
              <span className="text-xs sm:text-sm font-display font-bold tracking-wider uppercase text-[var(--fg)]">
                TIS SCHEDULE · {language === 'vi' ? 'CHỌN LỊCH HỌC' : 'CHOOSE SCHEDULE'}
              </span>

              <div className="flex items-center gap-2.5">
                {onLanguageChange && (
                  <div className="flex items-center border border-[var(--border)] rounded-full p-0.5 text-xs font-mono bg-[var(--surface-solid)] shadow-xs">
                    <button
                      type="button"
                      onClick={() => onLanguageChange('vi')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer font-bold ${
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
                      className={`px-3 py-1 rounded-full transition cursor-pointer font-bold ${
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
                    type="button"
                    onClick={onClose}
                    className="btn-cozy text-xs font-bold px-3 py-1.5 rounded-2xl cursor-pointer flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Đóng' : 'Close'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Two Panels: Left = Room Type-In, Right = Class Choosing */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)] overflow-y-auto no-scrollbar">
              
              {/* LEFT PANEL: Room Number Type-In (Centered Box) */}
              <div className="p-6 sm:p-8 flex flex-col justify-center space-y-6">
                <div>
                  <div className="mb-5 text-center sm:text-left">
                    <p className="text-xs text-[var(--fg-muted)] font-medium">
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
                        className={`w-full text-center py-4 px-6 text-2xl sm:text-3xl font-display font-bold tracking-wider text-[var(--fg)] bg-[var(--bg)] border-2 rounded-[22px] outline-none transition-all placeholder:text-[var(--fg-faint)] shadow-inner ${
                          isTypedInvalid
                            ? 'border-[var(--danger)] ring-2 ring-[var(--danger-muted)]'
                            : 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-muted)]'
                        }`}
                        autoFocus
                      />
                    </div>

                    {/* Room Resolution / Real-time Feedback */}
                    <div className="min-h-6 flex items-center justify-center text-center px-2">
                      {matchedRoom ? (
                        <div className="text-xs font-mono text-[var(--success)] font-semibold">
                          ✓ {language === 'vi' ? matchedRoom.nameVi : matchedRoom.nameEn} · {language === 'vi' ? matchedRoom.defaultClassVi : matchedRoom.defaultClassEn} ({language === 'vi' ? 'Nhấn Enter ↵' : 'Press Enter ↵'})
                        </div>
                      ) : isTypedInvalid ? (
                        <div className="text-xs font-mono text-[var(--danger)] font-medium leading-tight">
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
                      className="w-full py-3 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--accent-fg)] font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_3px_0_var(--edge)] active:translate-y-0.5"
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
                    <h3 className="text-xs font-display uppercase tracking-wider text-[var(--fg-muted)] font-bold">
                      {language === 'vi' ? 'HOẶC CHỌN THEO LỚP HỌC' : 'OR CHOOSE BY CLASS'}
                    </h3>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {language === 'vi' ? 'Danh sách các lớp THPT & THCS' : 'List of all High School & Middle School classes'}
                    </p>
                  </div>

                  {/* Scrollable Class List */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
                    
                    {/* THPT Group */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold tracking-wider text-[var(--fg-muted)] uppercase px-1 block">
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
                              className={`h-[66px] px-3.5 py-2.5 rounded-2xl border-[1.5px] text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
                                isCurrent
                                  ? 'chip-peach border-[var(--accent)]/40 shadow-xs'
                                  : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--fg)] shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5 w-full min-w-0">
                                <span className={`text-xs sm:text-[13px] truncate ${isCurrent ? 'font-bold' : 'font-semibold text-[var(--fg)]'}`}>
                                  {classNameStr}
                                </span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                                  isCurrent
                                    ? 'bg-[var(--accent)] text-[var(--accent-fg)] font-bold'
                                    : 'bg-[var(--bg-subtle)] text-[var(--fg-secondary)] font-medium'
                                }`}>
                                  {formatRoomBadge(c.room)}
                                </span>
                              </div>
                              <span className={`text-[11px] truncate w-full ${isCurrent ? 'opacity-85 font-medium' : 'text-[var(--fg-muted)]'}`}>
                                {language === 'vi' ? 'GV' : 'HR'}: {c.homeroomTeacher}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* THCS Group */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold tracking-wider text-[var(--fg-muted)] uppercase px-1 block">
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
                              className={`h-[66px] px-3.5 py-2.5 rounded-2xl border-[1.5px] text-left transition cursor-pointer flex flex-col justify-between overflow-hidden ${
                                isCurrent
                                  ? 'chip-peach border-[var(--accent)]/40 shadow-xs'
                                  : 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--fg)] shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1.5 w-full min-w-0">
                                <span className={`text-xs sm:text-[13px] truncate ${isCurrent ? 'font-bold' : 'font-semibold text-[var(--fg)]'}`}>
                                  {classNameStr}
                                </span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                                  isCurrent
                                    ? 'bg-[var(--accent)] text-[var(--accent-fg)] font-bold'
                                    : 'bg-[var(--bg-subtle)] text-[var(--fg-secondary)] font-medium'
                                }`}>
                                  {formatRoomBadge(c.room)}
                                </span>
                              </div>
                              <span className={`text-[11px] truncate w-full ${isCurrent ? 'opacity-85 font-medium' : 'text-[var(--fg-muted)]'}`}>
                                {language === 'vi' ? 'GV' : 'HR'}: {c.homeroomTeacher}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--fg-muted)]">
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
