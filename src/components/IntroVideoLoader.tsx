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

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    const startPlayback = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch((err) => {
          console.warn("Video autoplay pending:", err);
        });
      }
    };

    if (video.readyState >= 2) {
      startPlayback();
    } else {
      video.addEventListener('loadedmetadata', startPlayback, { once: true });
      video.addEventListener('canplay', startPlayback, { once: true });
    }

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
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={handleFinish}
        >
          <video
            ref={videoRef}
            src="/The_International_School_Logo_mobile.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleFinish}
            onError={handleFinish}
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
