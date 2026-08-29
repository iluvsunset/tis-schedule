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
    setTimeout(onComplete, 350);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback: immediately proceed if policy blocked
          setTimeout(handleFinish, 1200);
        });
      }
    }

    // Fast mobile failsafe (4.5s max duration)
    const failsafe = setTimeout(() => {
      handleFinish();
    }, 4500);

    return () => clearTimeout(failsafe);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={handleFinish}
        >
          <video
            ref={videoRef}
            poster="/tis-intro-poster.webp"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleFinish}
            onError={handleFinish}
            className="w-full h-full object-contain sm:object-cover"
          >
            <source src="/The_International_School_Logo_mobile.mp4" type="video/mp4" />
            <source src="/The_International_School_Logo.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
