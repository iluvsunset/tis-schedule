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

  // Auto focus input whenever modal opens and select text for fast overwriting
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

  // Clean room number string
  const cleanTypedId = useMemo(() => {
    return typedRoom.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
  }, [typedRoom]);

  // Find exact or closest match in known rooms
  const matchedRoom = useMemo(() => {
    if (!cleanTypedId) return null;
    return rooms.find(r => r.id.toLowerCase() === cleanTypedId.toLowerCase()) || null;
  }, [rooms, cleanTypedId]);

  // Submit action
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cleanTypedId) {
      onSelectRoom(cleanTypedId);
      onClose();
    }
  };

  // On-screen luxury keypad click handler (ideal for mobile / tablet / signage kiosks)
  const handleKeypadPress = (val: string) => {
    if (val === 'clear') {
      setTypedRoom('');
      inputRef.current?.focus();
    } else if (val === 'backspace') {
      setTypedRoom(prev => prev.slice(0, -1));
      inputRef.current?.focus();
    } else if (val === 'enter') {
      handleSubmit();
    } else {
      setTypedRoom(prev => (prev.length < 6 ? prev + val : prev));
      inputRef.current?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden">
          
          {/* Atmospheric Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={allowClose ? onClose : undefined}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Luxury Editorial Room Type-In Stage (Aman / Hotel Hoa Nắng Inspired - Zero Icons) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#0e0f14] border border-white/[0.09] shadow-2xl rounded-3xl overflow-hidden flex flex-col z-10"
          >
            
            {/* Header: Title & Language (Zero Icons) */}
            <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a869] font-medium block">
                  Classroom Access
                </span>
                <h2 className="text-base font-semibold tracking-tight text-white mt-0.5">
                  {language === 'vi' ? 'Nhập Số Phòng Học' : 'Type In Room Number'}
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                {onLanguageChange && (
                  <div className="flex items-center border border-white/10 rounded-full p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => onLanguageChange('vi')}
                      className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                        language === 'vi' ? 'bg-[#c5a869] text-black font-bold' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      VI
                    </button>
                    <button
                      type="button"
                      onClick={() => onLanguageChange('en')}
                      className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                        language === 'en' ? 'bg-[#c5a869] text-black font-bold' : 'text-white/40 hover:text-white'
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
                    className="text-xs font-mono uppercase text-white/40 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
                  >
                    {language === 'vi' ? 'Đóng' : 'Close'}
                  </button>
                )}
              </div>
            </div>

            {/* Centerpiece: Prominent Type-In Input Form */}
            <div className="p-6 space-y-5">
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                    {language === 'vi' ? 'Gõ số phòng trên bàn phím' : 'Type room number on keyboard'}
                  </span>
                  
                  {/* Grand Numeric Display Box */}
                  <div className="relative max-w-xs mx-auto">
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      value={typedRoom}
                      onChange={(e) => setTypedRoom(e.target.value)}
                      placeholder="504"
                      className="w-full text-center py-3.5 px-4 text-3xl sm:text-4xl font-mono font-bold tracking-widest text-white bg-white/[0.04] border-2 border-white/10 focus:border-[#c5a869] rounded-2xl outline-none transition-all placeholder:text-white/15"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Real-time Room Resolution Card */}
                <div className="h-14 flex items-center justify-center">
                  {matchedRoom ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-0.5"
                    >
                      <div className="text-xs font-mono text-[#c5a869] font-medium">
                        {language === 'vi' ? matchedRoom.nameVi : matchedRoom.nameEn} · {language === 'vi' ? matchedRoom.floorVi : matchedRoom.floorEn}
                      </div>
                      <div className="text-[11px] text-white/60">
                        {language === 'vi' ? matchedRoom.defaultClassVi : matchedRoom.defaultClassEn} · {matchedRoom.homeroomTeacher}
                      </div>
                    </motion.div>
                  ) : cleanTypedId ? (
                    <div className="text-center text-xs font-mono text-white/50">
                      {language === 'vi' ? `Xem lịch tổng hợp Phòng ${cleanTypedId}` : `View master schedule for Room ${cleanTypedId}`}
                    </div>
                  ) : (
                    <div className="text-center text-[11px] font-mono text-white/30">
                      {language === 'vi' ? 'Gõ số phòng như: 504, 4012, 307, 4010...' : 'Type any room: 504, 4012, 307, 4010...'}
                    </div>
                  )}
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={!cleanTypedId}
                  className="w-full py-3 rounded-2xl bg-[#c5a869] hover:bg-[#d4b97a] disabled:opacity-30 disabled:cursor-not-allowed text-black font-mono font-bold text-xs uppercase tracking-widest transition cursor-pointer shadow-lg"
                >
                  {language === 'vi' ? `VÀO XEM PHÒNG ${cleanTypedId || '...'}` : `ENTER ROOM ${cleanTypedId || '...'}`}
                </button>
              </form>

              {/* Tactile Keypad (Numbers 1-9, Clear, 0, Enter) for Touch Screens */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <div className="grid grid-cols-3 gap-1.5 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleKeypadPress(num)}
                      className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 text-white font-mono text-base font-semibold transition cursor-pointer flex items-center justify-center"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('clear')}
                    className="h-11 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] active:bg-white/[0.1] border border-white/10 text-white/40 hover:text-white font-mono text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="h-11 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.12] border border-white/10 text-white font-mono text-base font-semibold transition cursor-pointer flex items-center justify-center"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('backspace')}
                    className="h-11 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] active:bg-white/[0.1] border border-white/10 text-white/40 hover:text-white font-mono text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center"
                  >
                    ⌫
                  </button>
                </div>

                {/* Fast-Fill Chips for School's Primary Rooms */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
                  <span className="text-[10px] font-mono text-white/30 uppercase mr-1">Quick:</span>
                  {['504', '4012', '307', '4010', '4011', '503'].map((rid) => (
                    <button
                      key={rid}
                      type="button"
                      onClick={() => {
                        setTypedRoom(rid);
                        inputRef.current?.focus();
                      }}
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono transition cursor-pointer border ${
                        cleanTypedId === rid
                          ? 'bg-[#c5a869]/20 text-[#c5a869] border-[#c5a869]/40 font-bold'
                          : 'bg-white/[0.02] text-white/50 border-white/10 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {rid}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
