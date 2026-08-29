import React, { useState } from 'react';
import { Clock, MapPin, User, SlidersHorizontal } from 'lucide-react';
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
    <div className="glass-card border border-white/80 rounded-2xl p-3 sm:p-3.5 shadow-soft mb-4 no-print flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
      
      {/* Left: Live Status Indicator */}
      <div className="flex items-center gap-3 min-w-0 flex-1">

        {/* Current Class Pill */}
        <div className="flex items-center gap-2 min-w-0 truncate">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            <CustomSubjectIcon type={currentEvent?.type || 'event'} className="w-8 h-8" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate text-xs sm:text-sm">
              <span className="truncate">{currentSubject}</span>
              {currentEvent && currentEvent.period !== 'recess' && (
                <span className="text-[11px] font-semibold text-rose-600 px-1.5 py-0.2 bg-rose-50 rounded-md border border-rose-100 shrink-0">
                  T{currentEvent.period}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
              <span>{currentEvent?.teacher || 'Trường TIS'}</span>
              {currentEvent && (
                <>
                  <span>•</span>
                  <span className="text-rose-600 font-semibold">{remainingMinutes}p {language === 'vi' ? 'nữa' : 'left'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Next Up Info (desktop) */}
        {nextEvent && (
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-slate-500 shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">{language === 'vi' ? 'Tiếp:' : 'Next:'}</span>
            <span className="font-semibold text-slate-700">
              {language === 'vi' ? nextEvent.subjectVi : nextEvent.subjectEn} ({nextEvent.startTime})
            </span>
          </div>
        )}
      </div>

      {/* Right: Vietnam Time & Class Info Badges */}
      <div className="flex items-center gap-2 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
        
        {/* Vietnam Clock */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[11px]" title="Giờ Việt Nam (UTC+7 / Asia/Ho_Chi_Minh)">
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-mono">{vnTime.timeWithSeconds}</span>
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(GMT+7)</span>
        </div>

        {/* Room & Teacher Badges */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="px-2 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-200 flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Cô Tiềng</span>
          </span>
          <span className="px-2 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>P.504</span>
          </span>
        </div>

        {/* Simulation Toggle */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`p-1.5 rounded-xl border transition cursor-pointer ${
            isSimulating ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
          }`}
          title="Mô phỏng giờ học"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Simulator Panel */}
      {isSimulating && (
        <div className="w-full mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50/60 p-2 rounded-xl">
          <span className="font-bold text-amber-900">Mô phỏng thời gian học:</span>
          <div className="flex items-center gap-2">
            <select
              value={simDay}
              onChange={(e) => {
                const d = Number(e.target.value);
                setSimDay(d);
                const dayMap: Record<number, DayKey> = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
                if (dayMap[d]) onSelectDay(dayMap[d]);
              }}
              className="p-1 rounded-lg border border-amber-300 bg-white text-xs"
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
              className="p-1 rounded-lg border border-amber-300 bg-white text-xs"
            />
            <button
              onClick={() => setIsSimulating(false)}
              className="text-xs text-rose-600 font-bold hover:underline cursor-pointer ml-1"
            >
              Đặt lại
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
