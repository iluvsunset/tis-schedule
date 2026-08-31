import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroVideoLoaderProps {
  onComplete: () => void;
}

export const IntroVideoLoader: React.FC<IntroVideoLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict WebKit & Android autoplay requirements
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('x5-playsinline', '');

    const tryPlay = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Mobile autoplay restriction:", err);
            // If browser strictly forbids autoplay (e.g. Low Power Mode), finish smoothly
            setTimeout(handleFinish, 1200);
          });
        }
      }
    };

    // Attempt playback immediately and on metadata load
    tryPlay();
    video.addEventListener('loadeddata', tryPlay, { once: true });
    video.addEventListener('canplay', tryPlay, { once: true });

    // Touch fallback in case browser delays autoplay until first user gesture
    const handleUserGesture = () => {
      tryPlay();
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('pointerdown', handleUserGesture);
    };
    window.addEventListener('touchstart', handleUserGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', handleUserGesture, { once: true, passive: true });

    // Failsafe timeout to prevent any infinite hang
    const failsafe = setTimeout(() => {
      handleFinish();
    }, 5600);

    return () => {
      clearTimeout(failsafe);
      window.removeEventListener('touchstart', handleUserGesture);
      window.removeEventListener('pointerdown', handleUserGesture);
    };
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen h-[100dvh] z-[9999] bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden select-none"
        >
          <div className="w-full h-full w-screen h-screen min-w-full min-h-full flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950">
            <video
              ref={videoRef}
              src="/The_International_School_Logo.mp4"
              poster="/landscape-logo.png"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              onError={handleFinish}
              className="w-full h-full w-screen h-screen min-w-full min-h-full object-cover"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
