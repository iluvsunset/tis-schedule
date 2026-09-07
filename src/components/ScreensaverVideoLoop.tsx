import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { VietnamTimeInfo } from '../utils/vietnamTime';
import { Language, ScheduleData } from '../types/schedule';

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

      {/* Bottom Right: Ambient Digital Clock Card (Leaves Center Logo 100% Unobstructed) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 pointer-events-auto"
      >
        <div className="px-6 py-4 sm:px-8 sm:py-5 rounded-2xl sm:rounded-3xl bg-slate-900/80 hover:bg-slate-900/90 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.22)] flex flex-col items-end text-right transition-all transform-gpu">
          {/* Digital Time with Accented Seconds */}
          <div className="flex items-baseline justify-end gap-1 text-white drop-shadow-md">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight tabular-nums select-none">
              {vnTime.timeStr}
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-[#ee5421] tabular-nums select-none">
              :{String(vnTime.seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Full Date & Day Name */}
          <div className="mt-1 text-xs sm:text-sm font-semibold text-slate-300 tracking-wide flex items-center justify-end gap-2">
            <span>{language === 'vi' ? vnTime.dayNameVi : vnTime.dayNameEn}</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-white/90">{vnTime.dateStr}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
