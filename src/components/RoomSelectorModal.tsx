import React, { useState, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  // Filter rooms based on search term
  const filteredRooms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rooms;
    return rooms.filter(r => 
      r.id.toLowerCase().includes(term) ||
      r.nameEn.toLowerCase().includes(term) ||
      r.nameVi.toLowerCase().includes(term) ||
      r.defaultClassEn.toLowerCase().includes(term) ||
      r.defaultClassVi.toLowerCase().includes(term) ||
      r.homeroomTeacher.toLowerCase().includes(term)
    );
  }, [rooms, searchTerm]);

  // Group rooms by floor (Aman / Hotel Hoa Nắng floor directory style)
  const groupedByFloor = useMemo(() => {
    const groups: { floorKey: string; floorTitle: string; rooms: RoomInfo[] }[] = [];
    const floorMap = new Map<string, RoomInfo[]>();

    filteredRooms.forEach(room => {
      const fKey = room.floorEn || 'Other';
      if (!floorMap.has(fKey)) {
        floorMap.set(fKey, []);
      }
      floorMap.get(fKey)!.push(room);
    });

    // Order: Floor 5, Floor 4, Floor 3, Others
    const sortedKeys = Array.from(floorMap.keys()).sort((a, b) => b.localeCompare(a));
    sortedKeys.forEach(fKey => {
      const rList = floorMap.get(fKey)!;
      const title = language === 'vi' ? (rList[0]?.floorVi || fKey) : fKey;
      groups.push({
        floorKey: fKey,
        floorTitle: title,
        rooms: rList
      });
    });

    return groups;
  }, [filteredRooms, language]);

  const handleSelect = (roomId: string) => {
    onSelectRoom(roomId);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchTerm.trim().replace(/^room\s*/i, '').replace(/^p\.?\s*/i, '');
    if (cleanId) {
      handleSelect(cleanId);
    }
  };

  const hasExactMatch = rooms.some(r => r.id.toLowerCase() === searchTerm.trim().toLowerCase());

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-hidden">
          
          {/* Subtle Atmospheric Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={allowClose ? onClose : undefined}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Luxury Editorial Room Selector Card (Zero Icons) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#0f1016] border border-white/[0.08] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh] z-10"
          >
            
            {/* Header with Title and Language Toggle (Zero Icons) */}
            <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a869] font-medium">
                  TIS Directory
                </span>
                <h2 className="text-lg font-semibold tracking-tight text-white mt-0.5">
                  {language === 'vi' ? 'Chọn Phòng Học' : 'Select Classroom'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                {onLanguageChange && (
                  <div className="flex items-center border border-white/10 rounded-full p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => onLanguageChange('vi')}
                      className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                        language === 'vi' ? 'bg-[#c5a869] text-black font-bold' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      VI
                    </button>
                    <button
                      type="button"
                      onClick={() => onLanguageChange('en')}
                      className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                        language === 'en' ? 'bg-[#c5a869] text-black font-bold' : 'text-white/50 hover:text-white'
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
                    className="text-xs font-mono uppercase tracking-wider text-white/40 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
                  >
                    {language === 'vi' ? 'Đóng' : 'Close'}
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Room Number Input (Zero Icons) */}
            <div className="p-6 pb-4 shrink-0 border-b border-white/[0.06]">
              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
                  {language === 'vi' ? 'Tìm hoặc nhập số phòng' : 'Search or enter room number'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'vi' ? 'VD: 504, 4012, 307...' : 'e.g. 504, 4012, 307...'}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#c5a869] transition"
                    autoFocus
                  />
                  {searchTerm.trim() && !hasExactMatch && (
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#c5a869] text-black text-xs font-mono font-bold hover:bg-[#d4b97a] transition cursor-pointer shrink-0"
                    >
                      {language === 'vi' ? 'Xem phòng này' : 'View Room'}
                    </button>
                  )}
                </div>

                {/* Quick Selection Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-white/40 self-center mr-1 uppercase">Quick:</span>
                  {['504', '4012', '307', '4010', '4011', '503'].map((rid) => (
                    <button
                      key={rid}
                      type="button"
                      onClick={() => handleSelect(rid)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                        selectedRoomId === rid
                          ? 'bg-[#c5a869] text-black border-[#c5a869] font-bold'
                          : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {rid}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Scrollable Floor & Room List (Zero Icons, Aman Architectural Elegance) */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06] p-2">
              {groupedByFloor.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-white/40">
                  {language === 'vi' ? 'Không tìm thấy phòng phù hợp' : 'No rooms matching search'}
                </div>
              ) : (
                groupedByFloor.map((group) => (
                  <div key={group.floorKey} className="py-2">
                    {/* Floor Label */}
                    <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a869] font-semibold sticky top-0 bg-[#0f1016]/95 backdrop-blur-md">
                      {group.floorTitle}
                    </div>

                    {/* Rooms on this Floor */}
                    <div className="mt-1 space-y-1">
                      {group.rooms.map((room) => {
                        const isSelected = selectedRoomId.toLowerCase() === room.id.toLowerCase();
                        return (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => handleSelect(room.id)}
                            className={`w-full px-4 py-3 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#c5a869]/15 border border-[#c5a869]/40'
                                : 'hover:bg-white/[0.04] border border-transparent'
                            }`}
                          >
                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className={`text-sm font-semibold tracking-tight ${isSelected ? 'text-[#c5a869]' : 'text-white'}`}>
                                  {language === 'vi' ? room.nameVi : room.nameEn}
                                </span>
                                <span className="text-xs text-white/40">
                                  {language === 'vi' ? room.defaultClassVi : room.defaultClassEn}
                                </span>
                              </div>
                              <div className="text-[11px] text-white/50 mt-0.5">
                                {language === 'vi' ? `GVCN: ${room.homeroomTeacher}` : `Homeroom: ${room.homeroomTeacher}`}
                              </div>
                            </div>

                            {isSelected ? (
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#c5a869] text-black font-bold">
                                {language === 'vi' ? 'Đang chọn' : 'Active'}
                              </span>
                            ) : (
                              <span className="text-xs font-mono text-white/30">
                                {room.id}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtle Footer info */}
            <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.01] text-[11px] font-mono text-white/40 text-center">
              {language === 'vi' ? 'Lịch học phòng tự động đồng bộ theo tuần' : 'Room schedule synchronizes live with school master tabs'}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
