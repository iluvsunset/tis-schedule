import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, MapPin, User } from 'lucide-react';
import { VietnamTimeInfo, getDateStatus } from '../utils/vietnamTime';
import { Language, ScheduleData, DayKey, ScheduleItem } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';

interface ScreensaverVideoLoopProps {
  vnTime: VietnamTimeInfo;
  language: Language;
  scheduleData?: ScheduleData | null;
  onDismiss: () => void;
  locked?: boolean;
}

export const ScreensaverVideoLoop: React.FC<ScreensaverVideoLoopProps> = ({
  vnTime,
  language,
  scheduleData,
  onDismiss,
  locked = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state with document
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Play video continuously in a loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Screensaver loop video playback notice:', err);
      });
    }
  }, []);

  // Keyboard shortcut (F) and user activity dismissal listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
        return;
      }
      if (!locked) {
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    if (locked) {
      return () => window.removeEventListener('keydown', handleKeyDown);
    }

    // 150ms debounce before attaching activity listeners to prevent immediate dismissal
    const timer = setTimeout(() => {
      const handleActivity = (e: Event) => {
        // Allow clicking interactive controls without dismissing
        const target = e.target;
        if (target instanceof Element && target.closest('button')) return;
        onDismiss();
      };

      const events = ['mousemove', 'mousedown', 'touchstart', 'wheel', 'scroll'];
      events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));

      return () => {
        events.forEach((evt) => window.removeEventListener(evt, handleActivity));
      };
    }, 150);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [onDismiss, locked]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const videoSource = isMobile
    ? '/The_International_School_Logo_mobile.mp4'
    : '/The_International_School_Logo.mp4';

  const gradeName = language === 'vi' 
    ? (scheduleData?.gradeTitleVi || 'Lớp 11-TN') 
    : (scheduleData?.gradeTitleEn || 'Grade 11-TN');
  const roomName = scheduleData?.room 
    ? (language === 'vi' ? `Phòng ${scheduleData.room}` : `Room ${scheduleData.room}`)
    : '';

  // Calculate today's schedule and active/starting + upcoming lessons
  const lessonInfo = useMemo(() => {
    const week = scheduleData?.weekSchedule || SCHEDULE_DATA.weekSchedule;
    if (!week || week.length === 0) return null;

    // First try exact date match
    let day = week.find((d) => getDateStatus(d.date, vnTime.dateStr) === 'today');
    // Then try dayKey match
    if (!day) {
      const dayKeys: DayKey[] = ['mon', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const currentDayKey = dayKeys[vnTime.dayOfWeek] || 'mon';
      day = week.find((d) => d.dayKey === currentDayKey) || week[0];
    }

    const periods = [...(day.morning || []), ...(day.afternoon || [])].filter(
      (p) => p.type !== 'break'
    );

    if (periods.length === 0) return null;

    const currentTotalMinutes = vnTime.totalMinutes;
    let activeItem: ScheduleItem | null = null;
    let nextStartingItem: ScheduleItem | null = null;
    let activeIndex = -1;
    let nextIndex = -1;
    let remainingMinutes = 0;
    let minutesUntilStart = 0;
    let progressPercent = 0;

    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      const [sh, sm] = (p.startTime || '').split(':').map(Number);
      const [eh, em] = (p.endTime || '').split(':').map(Number);
      const startMin = (sh || 0) * 60 + (sm || 0);
      const endMin = (eh || 0) * 60 + (em || 0);

      // Check if this lesson is currently live
      if (currentTotalMinutes >= startMin && currentTotalMinutes < endMin) {
        activeItem = p;
        activeIndex = i;
        const duration = endMin - startMin;
        const elapsed = currentTotalMinutes - startMin;
        remainingMinutes = endMin - currentTotalMinutes;
        progressPercent = duration > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / duration) * 100))) : 0;
        break;
      } else if (currentTotalMinutes < startMin && !nextStartingItem) {
        nextStartingItem = p;
        nextIndex = i;
        minutesUntilStart = startMin - currentTotalMinutes;
      }
    }

    if (activeItem) {
      return {
        status: 'live' as const,
        current: activeItem,
        badgeText: language === 'vi' ? 'Đang diễn ra' : 'Live In Session',
        remainingMinutes,
        minutesUntilStart: 0,
        progressPercent,
        upcoming: periods.slice(activeIndex + 1, activeIndex + 4),
        dayName: language === 'vi' ? day.dayNameVi : day.dayNameEn,
      };
    }

    if (nextStartingItem) {
      return {
        status: 'starting-soon' as const,
        current: nextStartingItem,
        badgeText: language === 'vi' ? 'Sắp bắt đầu' : 'Starting Soon',
        remainingMinutes: 0,
        minutesUntilStart,
        progressPercent: 0,
        upcoming: periods.slice(nextIndex + 1, nextIndex + 4),
        dayName: language === 'vi' ? day.dayNameVi : day.dayNameEn,
      };
    }

    // Outside class hours: preview next scheduled lesson
    return {
      status: 'scheduled' as const,
      current: periods[0],
      badgeText: language === 'vi' ? 'Tiết học dự kiến' : 'Next Scheduled Lesson',
      remainingMinutes: 0,
      minutesUntilStart: 0,
      progressPercent: 0,
      upcoming: periods.slice(1, 4),
      dayName: language === 'vi' ? day.dayNameVi : day.dayNameEn,
    };
  }, [scheduleData, vnTime, language]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      onClick={locked ? undefined : onDismiss}
      className={`fixed inset-0 z-[999998] bg-white w-screen h-screen select-none overflow-hidden ${
        locked ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {/* Background Looping School Video - Identical to IntroVideoLoader presentation */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none bg-white">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/tis-intro-poster.webp"
          className="w-full h-full object-contain scale-[2.2] sm:scale-[1.6] md:scale-[1.2] lg:scale-100 transition-transform duration-500 transform-gpu"
        >
          <source src={videoSource} type="video/mp4" />
        </video>
      </div>

      {/* Top Bar: Fullscreen Control & Class/Room Pill */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="absolute top-6 sm:top-8 left-6 sm:left-10 right-6 sm:right-10 z-20 flex items-center justify-between pointer-events-none"
      >
        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="liquid-glass flex items-center gap-2 px-3.5 py-1.5 rounded-full active:scale-95 text-xs font-medium text-white/90 transition-all cursor-pointer pointer-events-auto"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-[#ee5421]" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-[#ee5421]" />
          )}
          <span className="hidden sm:inline font-mono text-xs font-semibold tracking-wide">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </span>
        </button>

        {/* Class / Room Pill */}
        <div className="liquid-glass flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white/90 pointer-events-auto">
          <span>{gradeName}</span>
          {roomName && (
            <>
              <span className="text-white/40">•</span>
              <span className="text-[#ee5421] font-mono font-bold">{roomName}</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Ambient Digital Clock Card: On Top for Smaller Devices, Bottom-Left for Desktop */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="absolute top-16 left-4 right-4 sm:top-auto sm:bottom-8 sm:left-8 sm:right-auto z-20 pointer-events-auto"
      >
        <div className="liquid-glass w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3.5 rounded-2xl sm:rounded-3xl flex items-center justify-between sm:flex-col sm:items-start text-left transition-all">
          {/* Digital Time with Accented Seconds */}
          <div className="flex items-baseline justify-start gap-1 text-white">
            <span className="text-2xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight tabular-nums select-none">
              {vnTime.timeStr}
            </span>
            <span className="text-base sm:text-xl md:text-2xl font-mono font-bold text-[#ee5421] tabular-nums select-none">
              :{String(vnTime.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Full Date & Day Name */}
          <div className="text-xs font-medium text-slate-200 tracking-wide flex items-center justify-start gap-1.5 sm:gap-2 sm:mt-1">
            <span>{language === 'vi' ? vnTime.dayNameVi : vnTime.dayNameEn}</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-white/90 font-semibold">{vnTime.dateStr}</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Lesson Schedule Panel: Bottom for Smaller Devices, Bottom-Right for Desktop */}
      {lessonInfo && lessonInfo.current && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4, ease: 'easeOut' }}
          className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:right-8 sm:left-auto sm:max-w-[360px] md:max-w-[380px] w-auto sm:w-full z-20 flex flex-col items-end pointer-events-auto"
        >
          <div className="liquid-glass w-full rounded-2xl sm:rounded-3xl p-3 sm:p-4 transition-all text-white flex flex-col gap-2.5">
            {/* Status & Time Header */}
            <div className="flex items-center justify-between text-xs font-mono font-semibold">
              <span className="tracking-wider uppercase text-amber-300">
                {lessonInfo.badgeText}
              </span>
              <span className="text-white/70">
                {lessonInfo.current.time}
              </span>
            </div>

            {/* Starting / Active Lesson Hero Card */}
            <div className="liquid-glass-inner flex flex-col gap-1.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#ee5421] text-white font-mono text-xs font-bold shadow-xs">
                  {language === 'vi' ? `Tiết ${lessonInfo.current.period}` : `Period ${lessonInfo.current.period}`}
                </span>
                {lessonInfo.current.room && (
                  <span className="text-xs font-mono text-white/90 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#ee5421]" />
                    {language === 'vi' ? `Phòng ${lessonInfo.current.room}` : `Room ${lessonInfo.current.room}`}
                  </span>
                )}
              </div>

              <div className="text-sm sm:text-base font-bold font-display tracking-tight text-white line-clamp-1">
                {language === 'vi' ? lessonInfo.current.subjectVi : lessonInfo.current.subjectEn}
              </div>

              <div className="text-xs text-slate-200 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate">
                  <User className="w-3 h-3 text-white/50 shrink-0" />
                  <span className="truncate">{lessonInfo.current.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBD')}</span>
                </span>
                {lessonInfo.status === 'live' && lessonInfo.remainingMinutes > 0 && (
                  <span className="font-mono text-[#ee5421] font-bold text-xs shrink-0">
                    {language === 'vi' ? `còn ${lessonInfo.remainingMinutes}'` : `${lessonInfo.remainingMinutes}m left`}
                  </span>
                )}
                {lessonInfo.status === 'starting-soon' && lessonInfo.minutesUntilStart > 0 && (
                  <span className="font-mono text-amber-300 font-bold text-xs shrink-0">
                    {language === 'vi' ? `sau ${lessonInfo.minutesUntilStart}'` : `in ${lessonInfo.minutesUntilStart}m`}
                  </span>
                )}
              </div>

              {/* Progress bar for live lesson */}
              {lessonInfo.status === 'live' && (
                <div className="w-full bg-white/20 rounded-full h-1 mt-0.5 overflow-hidden">
                  <div
                    className="bg-[#ee5421] h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${lessonInfo.progressPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* List of Coming Up Lessons (Minimized: Hidden on Smaller Screens, Visible on sm+) */}
            {lessonInfo.upcoming.length > 0 && (
              <div className="hidden sm:flex flex-col gap-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[11px] font-mono font-semibold tracking-wider uppercase text-white/60 px-0.5">
                  <span>{language === 'vi' ? 'Tiết tiếp theo' : 'Coming Up Next'}</span>
                  <span>{lessonInfo.upcoming.length} {language === 'vi' ? 'tiết' : 'lessons'}</span>
                </div>

                <div className="flex flex-col gap-1">
                  {lessonInfo.upcoming.map((item, idx) => (
                    <div
                      key={`${item.period}-${idx}`}
                      className="liquid-glass-inner flex items-center justify-between px-3 py-1.5 rounded-xl transition-all text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/15 text-white shrink-0">
                          P{item.period}
                        </span>
                        <span className="font-semibold text-white/95 truncate">
                          {language === 'vi' ? item.subjectVi : item.subjectEn}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/70 shrink-0">
                        <span>{item.startTime}</span>
                        {item.teacher && (
                          <>
                            <span className="text-white/30">•</span>
                            <span className="text-white/80 max-w-[80px] truncate">{item.teacher}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
