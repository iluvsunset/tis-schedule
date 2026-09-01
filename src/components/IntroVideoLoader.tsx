import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroVideoLoaderProps {
  onComplete: () => void;
}

export const IntroVideoLoader: React.FC<IntroVideoLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishCalledRef = useRef(false);

  const handleFinish = () => {
    if (finishCalledRef.current) return;
    finishCalledRef.current = true;
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
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

    // Force load video buffer in iOS PWA sandbox
    video.load();

    const startPlayback = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn("PWA video playback retry:", err);
        });
      }
    };

    startPlayback();
    video.addEventListener('loadedmetadata', startPlayback);
    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);
    video.addEventListener('canplaythrough', startPlayback);

    // 5.5s safety watchdog timer
    const timeout = setTimeout(() => {
      handleFinish();
    }, 5500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] bg-white flex items-center justify-center overflow-hidden select-none"
        >
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              className="w-full h-full object-contain scale-[2.2] sm:scale-[1.6] md:scale-[1.2] lg:scale-100 transition-transform duration-500 transform-gpu"
            >
              <source src="/The_International_School_Logo.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
