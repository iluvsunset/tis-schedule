import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, MapPin, User, Calendar, Sparkles, Volume2, VolumeX } from './icons';
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
  const [isMuted, setIsMuted] = useState(true);

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

  const toggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = 1.0;
      video.play().then(() => {
        setIsMuted(false);
      }).catch((err) => {
        console.warn('Playback with audio prevented by browser:', err);
        video.muted = true;
        setIsMuted(true);
      });
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  // Keyboard shortcut (F for fullscreen, M for audio) and user activity dismissal listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleSound();
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
  }, [onDismiss, locked, isMuted]);

  // Responsive device tier detection & video source selection:
  // Mobile (<768px): Keep same original logo video as requested
  // Tablet (768px - 1023px) or low-spec devices: Hardware-optimized 720p (4.3MB, level 3.1) with AAC audio
  // Laptop / Desktop (>=1024px): Crisp 1080p promo video (11.3MB, level 4.1) with AAC audio
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTabletOrLowEnd = typeof window !== 'undefined' && (
    (window.innerWidth >= 768 && window.innerWidth < 1024) ||
    // @ts-ignore
    (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4)
  );

  const videoSource = isMobile
    ? '/The_International_School_Logo_mobile.mp4'
    : isTabletOrLowEnd
      ? '/tis-promo-remotion-720p.mp4'
      : '/tis-promo-remotion-final-30s.mp4';

  // Play video continuously in a loop with audio support
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    if (isMuted) {
      video.setAttribute('muted', '');
    } else {
      video.removeAttribute('muted');
    }
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Screensaver loop video playback notice:', err);
      });
    }

    return () => {
      video.pause();
    };
  }, [videoSource]);

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
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      onClick={locked ? undefined : onDismiss}
      className={`fixed inset-0 z-[999998] bg-[#f7f4eb] w-screen h-screen select-none overflow-hidden ${
        locked ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {/* Background: School Video Seamlessly Floating Fullscreen (Responsive layout & low-end device optimization) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 pointer-events-none bg-white">
        <video
          ref={videoRef}
          key={videoSource}
          src={videoSource}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster="/tis-intro-poster.webp"
          className={`w-full h-full ${
            isMobile
              ? 'object-contain scale-[1.55] sm:scale-100 sm:object-cover'
              : 'object-cover'
          } transition-transform duration-500 transform-gpu relative z-10`}
        />
      </div>

      {/* Top Bar: Controls & Class/Room Badges */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="absolute top-5 sm:top-7 left-5 sm:left-8 right-5 sm:right-8 z-20 flex items-center justify-between pointer-events-none"
      >
        {/* Action Controls (Fullscreen + Audio Toggle) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn-cozy bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl border-[1.5px] border-[#ded0bf] shadow-puffy flex items-center gap-2 text-xs font-mono font-bold text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-pointer"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[var(--accent)]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-[var(--accent)]" />
            )}
            <span className="hidden sm:inline font-mono text-xs font-bold tracking-wide">
              {isFullscreen 
                ? (language === 'vi' ? 'Thu Nhỏ (F)' : 'Exit Fullscreen') 
                : (language === 'vi' ? 'Toàn Màn Hình (F)' : 'Fullscreen')}
            </span>
          </button>

          {/* Audio Mute/Unmute Button (available for desktop/tablet promo video with soundtrack) */}
          {!isMobile && (
            <button
              type="button"
              onClick={toggleSound}
              className={`btn-cozy bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl border-[1.5px] shadow-puffy flex items-center gap-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                !isMuted 
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[#ffedd5]' 
                  : 'border-[#ded0bf] text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)]'
              }`}
              title={isMuted ? 'Unmute Audio (M)' : 'Mute Audio (M)'}
            >
              {!isMuted ? (
                <Volume2 className="w-4 h-4 text-[var(--accent)] animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#9a3412]" />
              )}
              <span className="hidden sm:inline font-mono text-xs font-bold tracking-wide">
                {!isMuted
                  ? (language === 'vi' ? 'Tắt Âm (M)' : 'Mute (M)')
                  : (language === 'vi' ? 'Bật Âm (M)' : 'Unmute (M)')}
              </span>
            </button>
          )}
        </div>

        {/* Class / Room Pill */}
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-[1.5px] border-[#ded0bf] shadow-puffy flex items-center gap-2 pointer-events-auto">
          <span className="px-2.5 py-0.5 rounded-xl bg-[#ffedd5] text-[#9a3412] font-black text-xs border border-[#fed7aa] shadow-xs">
            {gradeName}
          </span>
          {roomName && (
            <span className="px-2.5 py-0.5 rounded-xl bg-[#e0f2fe] text-[#0369a1] font-mono font-bold text-xs border border-[#bae6fd] shadow-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#0284c7]" />
              <span>{roomName}</span>
            </span>
          )}
        </div>
      </motion.div>

      {/* Ambient Digital Clock Card: Fluffy Creamy Bento Clock (Top on Mobile, Bottom-Left on Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
        className="absolute top-16 sm:top-auto sm:bottom-8 left-4 sm:left-8 right-4 sm:right-auto z-20 pointer-events-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl px-4 py-2.5 sm:px-6 sm:py-5 rounded-2xl sm:rounded-3xl border-[1.5px] border-[#ded0bf] shadow-puffy flex items-center justify-between sm:flex-col sm:items-start sm:gap-2 relative overflow-hidden text-left sm:min-w-[280px]">
          {/* Soft decorative background tint */}
          <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#fef3c7]/60 blur-xl pointer-events-none" />

          {/* Digital Time with Accented Seconds Pill */}
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="font-display font-black text-3xl sm:text-6xl text-[var(--fg)] tracking-tight tabular-nums select-none">
              {vnTime.timeStr}
            </span>
            <span className="px-1.5 py-0.5 sm:px-2 rounded-lg sm:rounded-xl bg-[#ffedd5] text-[var(--accent)] font-mono font-black text-sm sm:text-2xl border border-[#fed7aa] shadow-xs tabular-nums select-none">
              :{String(vnTime.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Full Date */}
          <div className="relative z-10 sm:pt-0.5">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[var(--fg-secondary)]">
              <Calendar className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span>{language === 'vi' ? vnTime.dayNameVi : vnTime.dayNameEn}</span>
              <span className="text-[#ded0bf]">•</span>
              <span className="font-mono text-[var(--fg)] font-bold">{vnTime.dateStr}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Standby Schedule Bento Card: Bottom for Mobile, Bottom-Right for Desktop */}
      {lessonInfo && lessonInfo.current && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35, ease: 'easeOut' }}
          className="absolute bottom-4 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 z-20 pointer-events-auto sm:w-[380px] md:w-[410px] flex flex-col items-stretch sm:items-end"
        >
          <div className="bg-white/95 backdrop-blur-xl w-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-[1.5px] border-[#ded0bf] shadow-puffy text-[var(--fg)] flex flex-col gap-2.5 sm:gap-3 relative overflow-hidden">
            {/* Header: Status Badge & Time Interval */}
            <div className="flex items-center justify-between gap-2 text-xs font-bold">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wider uppercase bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa] shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] animate-pulse" />
                {lessonInfo.badgeText}
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold tabular-nums bg-[#fef3c7] text-[#92400e] border border-[#fde68a] shadow-xs">
                {lessonInfo.current.time}
              </span>
            </div>

            {/* Featured Hero Lesson */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fffefc] border-[1.5px] border-[#ebdccb] shadow-xs flex items-center gap-3 sm:gap-3.5 relative overflow-hidden">
              {/* Period squircle badge */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ffedd5] text-[#9a3412] border border-[#fed7aa] flex items-center justify-center font-display font-black text-sm sm:text-base shrink-0 shadow-xs tabular-nums">
                T{lessonInfo.current.period}
              </div>

              {/* Subject Title & Teacher */}
              <div className="min-w-0 flex-1">
                <div className="font-display font-black text-sm sm:text-lg text-[var(--fg)] tracking-tight line-clamp-1">
                  {language === 'vi' ? lessonInfo.current.subjectVi : lessonInfo.current.subjectEn}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[var(--fg-muted)] mt-0.5 sm:mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-[var(--fg-secondary)] truncate">
                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--accent)] shrink-0" />
                    <span className="truncate max-w-[120px] sm:max-w-[140px]">{lessonInfo.current.teacher || (language === 'vi' ? 'Toàn Trường' : 'All School')}</span>
                  </span>

                  {lessonInfo.current.room && (
                    <span className="flex items-center gap-1 font-mono font-bold text-[var(--accent)] shrink-0">
                      <MapPin className="w-3 h-3 text-[var(--accent)] shrink-0" />
                      <span>P.{lessonInfo.current.room}</span>
                    </span>
                  )}

                  {lessonInfo.status === 'live' && lessonInfo.remainingMinutes > 0 && (
                    <span className="font-mono text-[var(--accent)] font-bold shrink-0">
                      • {language === 'vi' ? `còn ${lessonInfo.remainingMinutes}p` : `${lessonInfo.remainingMinutes}m left`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar for Active Lesson */}
            {lessonInfo.status === 'live' && (
              <div className="w-full bg-[#f4ece0] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[var(--accent)] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${lessonInfo.progressPercent}%` }}
                />
              </div>
            )}

            {/* Upcoming Lessons Preview */}
            {lessonInfo.upcoming.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-0.5 sm:pt-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider text-[var(--fg-muted)] px-1">
                  <span>{language === 'vi' ? 'Tiết tiếp theo' : 'Coming Up'}</span>
                  <span>{lessonInfo.upcoming.length} {language === 'vi' ? 'tiết' : 'lessons'}</span>
                </div>

                <div className="flex flex-col gap-1 sm:gap-1.5">
                  {lessonInfo.upcoming.map((item, idx) => (
                    <div
                      key={`next-${item.period}-${idx}`}
                      className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-[#fffefc] border border-[#ebdccb] flex items-center justify-between gap-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-black bg-[#fef3c7] text-[#92400e] border border-[#fde68a] shrink-0">
                          T{item.period}
                        </span>
                        <span className="font-bold text-[var(--fg)] text-[11px] sm:text-xs truncate">
                          {language === 'vi' ? item.subjectVi : item.subjectEn}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[var(--fg-muted)] shrink-0">
                        <span className="font-bold text-[var(--fg-secondary)]">{item.startTime}</span>
                        {item.teacher && (
                          <span className="text-[var(--fg-muted)] truncate max-w-[85px] sm:max-w-[100px]">
                            • {item.teacher}
                          </span>
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
