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
    setTimeout(onComplete, 400);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay prevented:", err);
          // If autoplay is completely blocked by browser policy, finish after 1.5s
          setTimeout(handleFinish, 1500);
        });
      }
    }

    // Failsafe timer (6s) so screen never hangs indefinitely
    const failsafe = setTimeout(() => {
      handleFinish();
    }, 6000);

    return () => clearTimeout(failsafe);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={handleFinish}
        >
          <video
            ref={videoRef}
            src="/The_International_School_Logo.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleFinish}
            onError={handleFinish}
            className="w-full h-full object-contain sm:object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
