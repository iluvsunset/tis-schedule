import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoomInfo, Language, INITIAL_ROOMS } from '../types/schedule';

interface RoomSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  rooms?: RoomInfo[];
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  allowClose?: boolean;
}

export const RoomSelectorModal: React.FC<RoomSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedRoomId,
  onSelectRoom,
  rooms = INITIAL_ROOMS,
  language,
  onLanguageChange,
  allowClose = true
}) => {
  const [typedRoom, setTypedRoom] = useState(selectedRoomId || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input whenever modal opens and select text for fast typing
  useEffect(() => {
    if (isOpen) {
      setTypedRoom(selectedRoomId || '');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, selectedRoomId]);

  const cleanTypedId = useMemo(() => {
    return typedRoom.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  }, [typedRoom]);

  const matchedRoom = useMemo(() => {
    if (!cleanTypedId) return null;
    return rooms.find(r => r.id.toLowerCase() === cleanTypedId.toLowerCase()) || null;
  }, [rooms, cleanTypedId]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cleanTypedId) {
      onSelectRoom(cleanTypedId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={allowClose ? onClose : undefined}
            className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md"
          />

          {/* Minimal Distraction-Free Room Input Box (Just the box) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm bg-white dark:bg-[#151720] border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 sm:p-7 z-10 space-y-4"
          >
            {/* Top controls: Language & Close */}
            <div className="flex items-center justify-between">
              {onLanguageChange ? (
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
              ) : <div />}

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

            {/* The Input Form (Just the box) */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 dark:text-slate-400 font-medium block">
                  {language === 'vi' ? 'GÕ SỐ PHÒNG TRÊN BÀN PHÍM' : 'TYPE ROOM NUMBER ON KEYBOARD'}
                </label>
                
                {/* The Box */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={typedRoom}
                    onChange={(e) => setTypedRoom(e.target.value)}
                    placeholder="4012"
                    className="w-full text-center py-4 px-4 text-3xl sm:text-4xl font-mono font-bold tracking-widest text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/90 border-2 border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white rounded-2xl outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-inner"
                    autoFocus
                  />
                </div>
              </div>

              {/* Real-time Room Resolution Text */}
              <div className="h-6 flex items-center justify-center text-center">
                {matchedRoom ? (
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                    {language === 'vi' ? matchedRoom.nameVi : matchedRoom.nameEn} · {language === 'vi' ? matchedRoom.defaultClassVi : matchedRoom.defaultClassEn}
                  </div>
                ) : cleanTypedId ? (
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {language === 'vi' ? `Phòng ${cleanTypedId}` : `Room ${cleanTypedId}`}
                  </div>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!cleanTypedId}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-slate-900 font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
              >
                {language === 'vi' ? 'Xem Thời Khóa Biểu (Enter)' : 'View Schedule (Enter)'}
              </button>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
