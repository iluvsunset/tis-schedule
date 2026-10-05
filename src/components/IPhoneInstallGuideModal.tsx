import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share, PlusSquare, Sparkles, ArrowDown } from './icons';
import { Language } from '../types/schedule';

interface IPhoneInstallGuideModalProps {
  language: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const IPhoneInstallGuideModal: React.FC<IPhoneInstallGuideModalProps> = ({ 
  language: initialLanguage,
  onLanguageChange 
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [lang, setLang] = useState<Language>(initialLanguage);

  useEffect(() => {
    setLang(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    // Detect iPhone / iOS device
    const isIPhoneDevice = /iPhone|iPod/i.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Detect if opened from Home Screen (Standalone mode)
    const isStandalone = (window.navigator as any).standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches;

    // Lock user outside if on iPhone browser (must add to Home Screen to unlock)
    if (isIPhoneDevice && !isStandalone) {
      setIsLocked(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsLocked(false);
      document.body.style.overflow = '';
    }
  }, []);

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#4a3b2f]/45 backdrop-blur-md flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top,16px))] pb-[max(1.5rem,env(safe-area-inset-bottom,24px))] overflow-y-auto">
      {/* Subtle Hardware-Accelerated Glow */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-[var(--butter)]/15 rounded-full blur-3xl pointer-events-none transform-gpu" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-[var(--surface-solid)] border-[1.5px] border-[var(--border)] rounded-[28px] shadow-puffy max-w-md w-full p-5 sm:p-6 text-[var(--fg)] relative overflow-hidden transform-gpu"
      >
        {/* Top Header Bar with Language Switcher */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--surface)] p-1 shadow-xs border border-[var(--border)] flex items-center justify-center overflow-hidden">
              <img src="/tis-logo.png" alt="TIS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider chip-peach px-2.5 py-0.5 rounded-full border border-[var(--accent)]/20">
                TIS SCHEDULE 11–TN
              </span>
              <h3 className="font-display font-bold text-xs text-[var(--fg-muted)] mt-0.5">Phòng 504</h3>
            </div>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] relative">
            <button
              onClick={() => handleToggleLang('vi')}
              className={`relative z-10 px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                lang === 'vi' ? 'text-[var(--bg)] font-bold' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              }`}
            >
              {lang === 'vi' && (
                <motion.div
                  layoutId="lock-lang-pill"
                  className="absolute inset-0 bg-[var(--fg)] rounded-full shadow-xs z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              VIE
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`relative z-10 px-3 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                lang === 'en' ? 'text-[var(--bg)] font-bold' : 'text-[var(--fg-muted)] hover:text-[var(--fg)]'
              }`}
            >
              {lang === 'en' && (
                <motion.div
                  layoutId="lock-lang-pill"
                  className="absolute inset-0 bg-[var(--fg)] rounded-full shadow-xs z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              ENG
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-5 text-center">
          <h2 className="font-display font-bold text-lg sm:text-xl text-[var(--fg)] leading-snug">
            {lang === 'vi' 
              ? 'Để có trải nghiệm tốt nhất, vui lòng thêm vào màn hình chính' 
              : 'For the best experience, please add to Home Screen'}
          </h2>
        </div>

        {/* Single Clear Instruction Card in Cozy Palette */}
        <div className="mt-5">
          <div className="p-4 rounded-2xl bg-[var(--surface)] border-[1.5px] border-[var(--border)] shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl chip-peach border border-[var(--accent)]/30 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                <PlusSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-[var(--fg)] flex items-center gap-1.5">
                  <span>{lang === 'vi' ? 'Thêm vào Màn hình chính' : 'Add to Home Screen'}</span>
                </h4>
                <p className="text-[11px] text-[var(--fg-secondary)] mt-1 leading-relaxed">
                  {lang === 'vi'
                    ? 'Nhấn nút Chia sẻ '
                    : 'Tap the Share button '}
                  <span className="inline-flex items-center justify-center bg-[var(--surface-solid)] px-1.5 py-0.5 rounded-lg border border-[var(--border)] text-[var(--accent)] mx-0.5 shadow-2xs">
                    <Share className="w-3 h-3" />
                  </span>
                  {lang === 'vi'
                    ? ' ở thanh dưới Safari ➔ Chọn "Thêm vào MH chính".'
                    : ' at the bottom of Safari ➔ Select "Add to Home Screen".'}
                </p>

                {/* Step Visual Mockup */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-[var(--surface-solid)] border border-[var(--border)] flex items-center justify-between text-[11px] font-bold text-[var(--fg)] shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg chip-peach border border-[var(--accent)]/25">
                      <PlusSquare className="w-4 h-4" />
                    </span>
                    <span>{lang === 'vi' ? 'Thêm vào MH chính' : 'Add to Home Screen'}</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pointing Cue */}
        <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] animate-bounce">
            <ArrowDown className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Nhấn nút Chia sẻ [ ↑ ] ở thanh dưới để bắt đầu' : 'Tap the Share button [ ↑ ] below to begin'}</span>
          </div>
          <p className="text-[10px] text-[var(--fg-muted)] mt-1.5">
            {lang === 'vi' 
              ? 'Sau khi thêm, mở ứng dụng từ màn hình chính để sử dụng.' 
              : 'Once added, open the app from your Home Screen to use.'}
          </p>

          {/* Dismiss / Continue to Web Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setIsLocked(false);
              document.body.style.overflow = '';
            }}
            className="btn-cozy mt-3.5 px-4 py-2 rounded-2xl text-[var(--fg)] font-bold text-xs border border-[var(--border)] transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>{lang === 'vi' ? 'Tiếp tục xem trên trình duyệt web ➔' : 'Continue viewing in web browser ➔'}</span>
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};
