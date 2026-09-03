import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroVideoLoaderProps {
  onComplete: () => void;
}

export const IntroVideoLoader: React.FC<IntroVideoLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishCalledRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (finishCalledRef.current) return;
    finishCalledRef.current = true;
    setIsVisible(false);
    setTimeout(onComplete, 250);
  }, [onComplete]);

  useEffect(() => {
    // If browser is explicitly offline, skip immediately to show schedule
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleFinish();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Strict Apple iOS PWA / WebKit standalone attributes
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');

    const startPlayback = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn('Video playback catch on slow network:', err);
        });
      }
    };

    // Fast Startup Watchdog:
    // If after 1.8s the video hasn't buffered enough data to play (readyState < 2),
    // the user is on bad WiFi or slow network. Skip immediately to the schedule!
    const bufferCheckTimer = setTimeout(() => {
      if (video.readyState < 2) {
        console.warn('Network too slow for intro video, skipping to schedule...');
        handleFinish();
      }
    }, 1800);

    // Max runtime safety watchdog (video is ~2.5s; abort at 3.5s max)
    const maxWatchdogTimer = setTimeout(() => {
      handleFinish();
    }, 3500);

    // Stall / Buffering handler: If playback stalls for > 800ms, skip to schedule
    let stallTimer: ReturnType<typeof setTimeout> | null = null;
    const handleStall = () => {
      if (!stallTimer) {
        stallTimer = setTimeout(() => {
          console.warn('Video stalled due to network latency, skipping to schedule...');
          handleFinish();
        }, 800);
      }
    };
    const handlePlaying = () => {
      if (stallTimer) {
        clearTimeout(stallTimer);
        stallTimer = null;
      }
    };

    video.addEventListener('loadedmetadata', startPlayback);
    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);
    video.addEventListener('canplaythrough', startPlayback);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('waiting', handleStall);
    video.addEventListener('stalled', handleStall);
    video.addEventListener('error', handleFinish);

    startPlayback();

    return () => {
      clearTimeout(bufferCheckTimer);
      clearTimeout(maxWatchdogTimer);
      if (stallTimer) clearTimeout(stallTimer);
      video.removeEventListener('loadedmetadata', startPlayback);
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
      video.removeEventListener('canplaythrough', startPlayback);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleStall);
      video.removeEventListener('stalled', handleStall);
      video.removeEventListener('error', handleFinish);
    };
  }, [handleFinish]);

  // Use mobile-optimized video (300KB) on small screens to halve bandwidth on bad WiFi
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const videoSource = isMobile
    ? '/The_International_School_Logo_mobile.mp4'
    : '/The_International_School_Logo.mp4';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={handleFinish}
          className="fixed inset-0 z-[999999] bg-white flex items-center justify-center overflow-hidden select-none cursor-pointer"
          title="Tap anywhere to skip"
        >
          {/* Subtle Tap-to-Skip Badge in top right */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.25 }}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 active:scale-95 backdrop-blur-md text-[11px] font-medium text-slate-700 transition-all cursor-pointer"
          >
            Skip &times;
          </motion.button>

          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/tis-intro-poster.webp"
              onEnded={handleFinish}
              onError={handleFinish}
              className="w-full h-full object-contain scale-[2.2] sm:scale-[1.6] md:scale-[1.2] lg:scale-100 transition-transform duration-500 transform-gpu"
            >
              <source src={videoSource} type="video/mp4" onError={handleFinish} />
            </video>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
