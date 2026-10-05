import React, { useState } from 'react';
import { Clock, MapPin, User, SlidersHorizontal } from './icons';
import { Language, DayKey, ScheduleItem } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { VietnamTimeInfo } from '../utils/vietnamTime';
import { CustomSubjectIcon } from './CustomSubjectIcons';

interface LiveStatusBarProps {
  vnTime: VietnamTimeInfo;
  language: Language;
  onSelectDay: (day: DayKey) => void;
}

export const LiveStatusBar: React.FC<LiveStatusBarProps> = ({
  vnTime,
  language,
  onSelectDay
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simDay, setSimDay] = useState<number>(vnTime.dayOfWeek >= 1 && vnTime.dayOfWeek <= 6 ? vnTime.dayOfWeek : 1);
  const [simTimeStr, setSimTimeStr] = useState<string>("08:30");

  // Determine active day & time in minutes
  let activeDayKey: DayKey = 'mon';
  let totalMinutes = vnTime.totalMinutes;

  if (isSimulating) {
    const dayMap: Record<number, DayKey> = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
    activeDayKey = dayMap[simDay] || 'mon';
    const [h, m] = simTimeStr.split(':').map(Number);
    totalMinutes = (h || 8) * 60 + (m || 0);
  } else {
    if (vnTime.dayOfWeek >= 1 && vnTime.dayOfWeek <= 6) {
      const map: Record<number, DayKey> = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
      activeDayKey = map[vnTime.dayOfWeek];
    } else {
      activeDayKey = 'mon';
    }
  }

  const dayData = SCHEDULE_DATA.weekSchedule.find(d => d.dayKey === activeDayKey) || SCHEDULE_DATA.weekSchedule[0];

  interface FlattenedEvent extends Partial<ScheduleItem> {
    startMin: number;
    endMin: number;
    isLunch?: boolean;
  }

  const events: FlattenedEvent[] = [];

  dayData.morning.forEach(item => {
    const [sh, sm] = item.startTime.split(':').map(Number);
    const [eh, em] = item.endTime.split(':').map(Number);
    events.push({ ...item, startMin: sh * 60 + sm, endMin: eh * 60 + em });
  });

  const [lsh, lsm] = dayData.lunch.startTime.split(':').map(Number);
  const [leh, lem] = dayData.lunch.endTime.split(':').map(Number);
  events.push({
    period: 'recess',
    time: dayData.lunch.time,
    startTime: dayData.lunch.startTime,
    endTime: dayData.lunch.endTime,
    subjectVi: dayData.lunch.titleVi,
    subjectEn: dayData.lunch.titleEn,
    teacher: '',
    type: 'break',
    startMin: lsh * 60 + lsm,
    endMin: leh * 60 + lem,
    isLunch: true
  });

  dayData.afternoon.forEach(item => {
    const [sh, sm] = item.startTime.split(':').map(Number);
    const [eh, em] = item.endTime.split(':').map(Number);
    events.push({ ...item, startMin: sh * 60 + sm, endMin: eh * 60 + em });
  });

  // Find currently active event
  const currentEvent = events.find(e => totalMinutes >= e.startMin && totalMinutes < e.endMin);

  // Find next upcoming event
  const nextEvent = events.find(e => e.startMin > totalMinutes);

  const currentSubject = currentEvent 
    ? (language === 'vi' ? currentEvent.subjectVi : currentEvent.subjectEn) 
    : (totalMinutes < 8 * 60 
        ? (language === 'vi' ? 'Chưa vào tiết sáng' : 'Before school') 
        : (language === 'vi' ? 'Đã tan trường' : 'Dismissed'));

  const remainingMinutes = currentEvent 
    ? currentEvent.endMin - totalMinutes 
    : 0;

  return (
    <div className="od-glass rounded-2xl p-3 sm:p-3.5 border-[1.5px] border-[var(--border)] shadow-puffy mb-4 no-print flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
      
      {/* Left: Live Status Indicator */}
      <div className="flex items-center gap-3 min-w-0 flex-1">

        {/* Current Class Pill */}
        <div className="flex items-center gap-2 min-w-0 truncate">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            <CustomSubjectIcon type={currentEvent?.type || 'event'} className="w-8 h-8" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 font-display font-black text-[var(--fg)] truncate text-xs sm:text-sm">
              <span className="truncate">{currentSubject}</span>
              {currentEvent && currentEvent.period !== 'recess' && (
                <span className="chip-peach px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 shadow-xs">
                  T{currentEvent.period}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[var(--fg-muted)] truncate flex items-center gap-1.5 font-semibold">
              <span>{currentEvent?.teacher || 'Trường TIS'}</span>
              {currentEvent && (
                <>
                  <span className="text-[var(--fg-faint)]">•</span>
                  <span className="text-[var(--accent)] font-bold">{remainingMinutes}p {language === 'vi' ? 'nữa' : 'left'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Next Up Info (desktop) */}
        {nextEvent && (
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[var(--border)] text-[var(--fg-muted)] shrink-0">
            <span className="text-[11px] font-medium">{language === 'vi' ? 'Tiếp:' : 'Next:'}</span>
            <span className="font-bold text-[var(--fg)]">
              {language === 'vi' ? nextEvent.subjectVi : nextEvent.subjectEn} ({nextEvent.startTime})
            </span>
          </div>
        )}
      </div>

      {/* Right: Vietnam Time & Class Info Badges */}
      <div className="flex items-center gap-2 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-[var(--border)]">
        
        {/* Vietnam Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[var(--surface-solid)] text-[var(--fg)] font-bold text-[11px] border border-[var(--border)] shadow-xs" title="Giờ Việt Nam (UTC+7 / Asia/Ho_Chi_Minh)">
          <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="font-mono tabular-nums">{vnTime.timeWithSeconds}</span>
          <span className="text-[10px] text-[var(--fg-muted)] font-normal hidden sm:inline">(GMT+7)</span>
        </div>

        {/* Room & Teacher Badges */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="px-2.5 py-1 rounded-full chip-lilac font-bold flex items-center gap-1 shadow-xs">
            <User className="w-3 h-3" />
            <span>Cô Tiềng</span>
          </span>
          <span className="px-2.5 py-1 rounded-full chip-mist font-bold flex items-center gap-1 shadow-xs">
            <MapPin className="w-3 h-3" />
            <span>P.504</span>
          </span>
        </div>

        {/* Simulation Toggle */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`btn-cozy p-2 rounded-2xl border-[1.5px] cursor-pointer shadow-xs ${
            isSimulating ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-[var(--accent)] font-bold' : 'border-[var(--border)] text-[var(--fg-secondary)]'
          }`}
          title="Mô phỏng giờ học"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Simulator Panel */}
      {isSimulating && (
        <div className="w-full mt-2 pt-2.5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs bg-[var(--surface-active)]/70 p-2.5 rounded-2xl border border-[var(--border)]">
          <span className="font-bold text-[var(--fg)]">Mô phỏng thời gian học:</span>
          <div className="flex items-center gap-2">
            <select
              value={simDay}
              onChange={(e) => {
                const d = Number(e.target.value);
                setSimDay(d);
                const dayMap: Record<number, DayKey> = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
                if (dayMap[d]) onSelectDay(dayMap[d]);
              }}
              className="p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--fg)] text-xs font-semibold outline-none shadow-xs"
            >
              <option value="1">Thứ Hai (24/8)</option>
              <option value="2">Thứ Ba (25/8)</option>
              <option value="3">Thứ Tư (26/8)</option>
              <option value="4">Thứ Năm (27/8)</option>
              <option value="5">Thứ Sáu (28/8)</option>
            </select>
            <input
              type="time"
              value={simTimeStr}
              onChange={(e) => setSimTimeStr(e.target.value)}
              className="p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-[var(--fg)] text-xs font-mono font-semibold outline-none shadow-xs"
            />
            <button
              onClick={() => setIsSimulating(false)}
              className="text-xs text-[var(--accent)] font-bold hover:underline cursor-pointer ml-1"
            >
              Đặt lại
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
