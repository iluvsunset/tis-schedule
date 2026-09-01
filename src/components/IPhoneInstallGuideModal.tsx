import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share, PlusSquare, Sparkles, ArrowDown } from 'lucide-react';
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
    <div className="fixed inset-0 z-[99999] bg-slate-950/85 flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top,16px))] pb-[max(1.5rem,env(safe-area-inset-bottom,24px))] overflow-y-auto">
      {/* Subtle Hardware-Accelerated Glow */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none transform-gpu" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transform-gpu" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl max-w-md w-full p-5 sm:p-6 text-slate-800 dark:text-slate-100 relative overflow-hidden transform-gpu"
      >
        {/* Top Header Bar with Language Switcher */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
              <img src="/tis-logo.png" alt="TIS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                TIS SCHEDULE 11–TN
              </span>
              <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 mt-0.5">Phòng 504</h3>
            </div>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
            <button
              onClick={() => handleToggleLang('vi')}
              className={`relative z-10 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                lang === 'vi' ? 'text-white dark:text-slate-900' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {lang === 'vi' && (
                <motion.div
                  layoutId="lock-lang-pill"
                  className="absolute inset-0 bg-slate-900 dark:bg-white rounded-lg shadow-2xs z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              VIE
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`relative z-10 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                lang === 'en' ? 'text-white dark:text-slate-900' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {lang === 'en' && (
                <motion.div
                  layoutId="lock-lang-pill"
                  className="absolute inset-0 bg-slate-900 dark:bg-white rounded-lg shadow-2xs z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              ENG
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-5 text-center">
          <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
            {lang === 'vi' 
              ? 'Để có trải nghiệm tốt nhất, vui lòng thêm vào màn hình chính' 
              : 'For the best experience, please add to Home Screen'}
          </h2>
        </div>

        {/* Single Clear Instruction Card in TIS Navy & Amber Palette */}
        <div className="mt-5">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-black text-xs shadow-2xs">
                <PlusSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{lang === 'vi' ? 'Thêm vào Màn hình chính' : 'Add to Home Screen'}</span>
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {lang === 'vi'
                    ? 'Nhấn nút Chia sẻ '
                    : 'Tap the Share button '}
                  <span className="inline-flex items-center justify-center bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 mx-0.5">
                    <Share className="w-3 h-3" />
                  </span>
                  {lang === 'vi'
                    ? ' ở thanh dưới Safari ➔ Chọn "Thêm vào MH chính".'
                    : ' at the bottom of Safari ➔ Select "Add to Home Screen".'}
                </p>

                {/* Step Visual Mockup */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                      <PlusSquare className="w-4 h-4" />
                    </span>
                    <span>{lang === 'vi' ? 'Thêm vào MH chính' : 'Add to Home Screen'}</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pointing Cue */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 animate-bounce">
            <ArrowDown className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Nhấn nút Chia sẻ [ ↑ ] ở thanh dưới để bắt đầu' : 'Tap the Share button [ ↑ ] below to begin'}</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
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
            className="mt-3.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>{lang === 'vi' ? 'Tiếp tục xem trên trình duyệt web ➔' : 'Continue viewing in web browser ➔'}</span>
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
};
