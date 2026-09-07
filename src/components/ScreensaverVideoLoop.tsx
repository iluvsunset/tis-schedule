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
      {/* Background Looping School Video - Edge-to-Edge with Pure White Backing */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none bg-white">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/tis-intro-poster.webp"
          className="w-full h-full object-cover transition-transform duration-500 transform-gpu"
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
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900/90 active:scale-95 backdrop-blur-xl border border-white/15 shadow-md text-xs font-medium text-white/90 transition-all cursor-pointer pointer-events-auto"
          title="Toggle Fullscreen (F)"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-[#ee5421]" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-[#ee5421]" />
          )}
          <span className="hidden sm:inline font-mono text-[11px] font-semibold tracking-wide">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </span>
        </button>

        {/* Class / Room Pill */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-xl border border-white/15 shadow-md text-xs font-semibold text-white/90 pointer-events-auto">
          <span>{gradeName}</span>
          {roomName && (
            <>
              <span className="text-white/40">•</span>
              <span className="text-[#ee5421] font-mono font-bold">{roomName}</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Bottom-Left Ambient Digital Clock Card */}
      <motion.div
        initial={{ opacity: 0, x: -25, y: 15 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20 pointer-events-auto"
      >
        <div className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-3xl bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.22)] flex flex-col items-start text-left transition-all">
          {/* Digital Time with Accented Seconds */}
          <div className="flex items-baseline justify-start gap-1 text-white drop-shadow-md">
            <span className="text-4xl sm:text-5xl font-black font-display tracking-tight tabular-nums select-none">
              {vnTime.timeStr}
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-[#ee5421] tabular-nums select-none">
              :{String(vnTime.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Full Date & Day Name */}
          <div className="mt-1 text-xs font-semibold text-slate-300 tracking-wide flex items-center justify-start gap-2">
            <span>{language === 'vi' ? vnTime.dayNameVi : vnTime.dayNameEn}</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-white/90">{vnTime.dateStr}</span>
          </div>
        </div>
      </motion.div>

      {/* Right Column Floating Lesson Schedule Panel */}
      {lessonInfo && lessonInfo.current && (
        <motion.div
          initial={{ opacity: 0, x: 25, y: 15 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex flex-col items-end pointer-events-auto max-w-[320px] sm:max-w-[360px] md:max-w-[380px] w-full"
        >
          <div className="w-full rounded-3xl bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 sm:p-5 transition-all text-white flex flex-col gap-3">
            {/* Status & Time Header */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-white/90">
                {lessonInfo.badgeText}
              </span>
              <span className="text-[11px] font-mono text-white/50">
                {lessonInfo.current.time}
              </span>
            </div>

            {/* Starting / Active Lesson Hero Card */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/[0.06] border border-white/10 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#ee5421]/25 text-[#ee5421] font-mono text-[11px] font-bold">
                  {language === 'vi' ? `Tiết ${lessonInfo.current.period}` : `Period ${lessonInfo.current.period}`}
                </span>
                {lessonInfo.current.room && (
                  <span className="text-[11px] font-mono text-white/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#ee5421]" />
                    {language === 'vi' ? `Phòng ${lessonInfo.current.room}` : `Room ${lessonInfo.current.room}`}
                  </span>
                )}
              </div>

              <div className="text-base sm:text-lg font-black font-display tracking-tight text-white line-clamp-1">
                {language === 'vi' ? lessonInfo.current.subjectVi : lessonInfo.current.subjectEn}
              </div>

              <div className="text-xs text-white/70 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 truncate">
                  <User className="w-3 h-3 text-white/40 shrink-0" />
                  <span className="truncate">{lessonInfo.current.teacher || (language === 'vi' ? 'Chưa phân công' : 'TBD')}</span>
                </span>
                {lessonInfo.status === 'live' && lessonInfo.remainingMinutes > 0 && (
                  <span className="font-mono text-[#ee5421] font-bold text-[11px] shrink-0">
                    {language === 'vi' ? `còn ${lessonInfo.remainingMinutes}'` : `${lessonInfo.remainingMinutes}m left`}
                  </span>
                )}
                {lessonInfo.status === 'starting-soon' && lessonInfo.minutesUntilStart > 0 && (
                  <span className="font-mono text-amber-400 font-bold text-[11px] shrink-0">
                    {language === 'vi' ? `sau ${lessonInfo.minutesUntilStart}'` : `in ${lessonInfo.minutesUntilStart}m`}
                  </span>
                )}
              </div>

              {/* Progress bar for live lesson */}
              {lessonInfo.status === 'live' && (
                <div className="w-full bg-white/10 rounded-full h-1 mt-1 overflow-hidden">
                  <div
                    className="bg-[#ee5421] h-full rounded-full transition-all duration-1000"
                    style={{ width: `${lessonInfo.progressPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* List of Coming Up Lessons */}
            {lessonInfo.upcoming.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider uppercase text-white/45 px-0.5">
                  <span>{language === 'vi' ? 'Tiết tiếp theo' : 'Coming Up Next'}</span>
                  <span>{lessonInfo.upcoming.length} {language === 'vi' ? 'tiết' : 'lessons'}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {lessonInfo.upcoming.map((item, idx) => (
                    <div
                      key={`${item.period}-${idx}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-white/80 shrink-0">
                          P{item.period}
                        </span>
                        <span className="font-semibold text-white/90 truncate">
                          {language === 'vi' ? item.subjectVi : item.subjectEn}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/50 shrink-0">
                        <span>{item.startTime}</span>
                        {item.teacher && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-white/70 max-w-[75px] truncate">{item.teacher}</span>
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
