import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroVideoLoaderProps {
  onComplete: () => void;
}

export const IntroVideoLoader: React.FC<IntroVideoLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict Apple WebKit property enforcement
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
          console.warn("Autoplay pending/retry:", err);
        });
      }
    };

    startPlayback();
    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);
    video.addEventListener('playing', () => {
      // Video is playing actively
    }, { once: true });

    // Safety timeout (5.5s) to guarantee app entry if video stalls
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
              src="/The_International_School_Logo.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              onError={handleFinish}
              className="w-full h-full object-contain scale-[2.2] sm:scale-[1.6] md:scale-[1.2] lg:scale-100 transition-transform duration-500 transform-gpu"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
