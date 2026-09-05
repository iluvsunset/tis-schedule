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
    return rooms.find(r => r.id.toLowerCase() === cleanTypedId.toLowerCase()) || null;
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

  const handlePickRoomChip = (roomId: string) => {
    setTypedRoom(roomId);
    onSelectRoom(roomId);
    onClose();
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
            className="fixed inset-0 bg-black/75 dark:bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Two-Panel Horizontal Screen Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl lg:max-w-5xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Top Bar: Title, Language Switcher, Close Button */}
            <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                TIS SCHEDULE · {language === 'vi' ? 'CHỌN LỊCH HỌC' : 'CHOOSE SCHEDULE'}
              </span>

              <div className="flex items-center gap-2.5">
                {onLanguageChange && (
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => onLanguageChange('vi')}
                      className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                        language === 'vi' 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold' 
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
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold' 
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
                    className="text-xs font-mono uppercase text-slate-400 hover:text-slate-700 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    {language === 'vi' ? 'Đóng' : 'Close'}
                  </button>
                )}
              </div>
            </div>

            {/* Two Panels: Left = Room Type-In, Right = Class Choosing */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800/80 overflow-y-auto">
              
              {/* LEFT PANEL: Room Number Type-In (Centered Box) */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
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
                        inputMode="numeric"
                        value={typedRoom}
                        onChange={(e) => setTypedRoom(e.target.value)}
                        placeholder="4012"
                        className={`w-full text-center py-4 px-6 text-3xl sm:text-4xl font-mono font-bold tracking-widest text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/90 border-2 rounded-[22px] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner ${
                          isTypedInvalid
                            ? 'border-rose-400 dark:border-rose-500/80 ring-2 ring-rose-400/20'
                            : 'border-slate-300 dark:border-slate-700/90 focus:border-slate-900 dark:focus:border-slate-300'
                        }`}
                        autoFocus
                      />
                    </div>

                    {/* Room Resolution / Real-time Feedback */}
                    <div className="min-h-10 flex items-center justify-center text-center px-2">
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
                      ) : (
                        <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                          {language === 'vi' ? 'Gợi ý: 504, 4012, 307, 4010, 4011, 503, 502, 501' : 'Examples: 504, 4012, 307, 4010, 4011, 503, 502, 501'}
                        </div>
                      )}
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

                {/* Quick Room Suggestions */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    {language === 'vi' ? 'HOẶC CHỌN NHANH PHÒNG:' : 'OR QUICK CHOOSE ROOM:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {rooms.map(r => {
                      const isSelected = r.id === selectedRoomId;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => handlePickRoomChip(r.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          P.{r.id}
                        </button>
                      );
                    })}
                  </div>
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
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                    
                    {/* THPT Group */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-1 block">
                        {language === 'vi' ? 'Khối THPT' : 'High School'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {highSchoolClasses.map(c => {
                          const isCurrent = c.id === selectedClassId || c.room === selectedRoomId;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handlePickClass(c)}
                              className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                                isCurrent
                                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs sm:text-sm">
                                  {language === 'vi' ? c.nameVi : c.nameEn}
                                </span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  isCurrent
                                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900 font-bold'
                                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  P.{c.room}
                                </span>
                              </div>
                              <span className={`text-[11px] truncate mt-1 ${isCurrent ? 'text-white/70 dark:text-slate-900/70' : 'text-slate-500 dark:text-slate-400'}`}>
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
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handlePickClass(c)}
                              className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                                isCurrent
                                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-bold text-xs sm:text-sm">
                                  {language === 'vi' ? c.nameVi : c.nameEn}
                                </span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                  isCurrent
                                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900 font-bold'
                                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                  P.{c.room}
                                </span>
                              </div>
                              <span className={`text-[11px] truncate mt-1 ${isCurrent ? 'text-white/70 dark:text-slate-900/70' : 'text-slate-500 dark:text-slate-400'}`}>
                                {language === 'vi' ? 'GV' : 'HR'}: {c.homeroomTeacher}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
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
