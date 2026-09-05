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
    if (cleanTypedId) {
      onSelectRoom(cleanTypedId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden">
          
          {/* Backdrop (click to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={allowClose ? onClose : undefined}
            className="fixed inset-0 bg-black/75 dark:bg-black/85 backdrop-blur-sm cursor-pointer"
          />

          {/* Minimal Distraction-Free Room Input (Just the box) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm z-10 space-y-3"
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="text-center space-y-2.5">
                {/* Header Label matching media_1788595595455.png */}
                <label className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-slate-400 dark:text-slate-400 font-medium block">
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
                    className="w-full text-center py-4 px-6 text-3xl sm:text-4xl font-mono font-bold tracking-widest text-slate-900 dark:text-white bg-white dark:bg-[#151720] border-2 border-slate-300 dark:border-slate-700/90 focus:border-slate-900 dark:focus:border-slate-300 rounded-[22px] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-2xl"
                    autoFocus
                  />
                </div>
              </div>

              {/* Minimal Room Subtitle / Detection */}
              <div className="h-5 flex items-center justify-center text-center">
                {matchedRoom ? (
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                    {language === 'vi' ? matchedRoom.nameVi : matchedRoom.nameEn} · {language === 'vi' ? matchedRoom.defaultClassVi : matchedRoom.defaultClassEn}
                  </div>
                ) : cleanTypedId ? (
                  <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    {language === 'vi' ? `Phòng ${cleanTypedId}` : `Room ${cleanTypedId}`} · Enter ↵
                  </div>
                ) : null}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
