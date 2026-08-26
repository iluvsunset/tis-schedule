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
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="bg-white/95 backdrop-blur-2xl border border-rose-200/90 rounded-[32px] shadow-2xl max-w-md w-full p-6 text-slate-800 relative overflow-hidden"
      >
        {/* Top Header Bar with Language Switcher */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-sm border border-slate-200/80 flex items-center justify-center overflow-hidden">
              <img src="/tis-logo.png" alt="TIS Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-md border border-rose-100">
                TIS Schedule 11-TN
              </span>
              <h3 className="font-display font-bold text-xs text-slate-700">Phòng 504</h3>
            </div>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 relative">
            <button
              onClick={() => handleToggleLang('vi')}
              className={`relative z-10 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                lang === 'vi' ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              {lang === 'vi' && (
                <motion.div
                  layoutId="lock-lang-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-2xs z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              VIE
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`relative z-10 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                lang === 'en' ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              {lang === 'en' && (
                <motion.div
                  layoutId="lock-lang-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-2xs z-[-1]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              ENG
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-5 text-center">
          <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 leading-snug">
            {lang === 'vi' 
              ? 'Để có trải nghiệm tốt nhất, vui lòng thêm vào màn hình chính' 
              : 'For the best experience, please add to Home Screen'}
          </h2>
        </div>

        {/* Single Clear Instruction Card */}
        <div className="mt-5">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/90 to-pink-50/70 border border-rose-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-cute-pink">
                <PlusSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-rose-950 flex items-center gap-1.5">
                  <span>{lang === 'vi' ? 'Thêm vào Màn hình chính' : 'Add to Home Screen'}</span>
                </h4>
                <p className="text-[11px] text-rose-900/80 mt-1 leading-relaxed">
                  {lang === 'vi'
                    ? 'Nhấn nút Chia sẻ '
                    : 'Tap the Share button '}
                  <span className="inline-flex items-center justify-center bg-white px-1.5 py-0.5 rounded border border-rose-200 text-blue-600">
                    <Share className="w-3 h-3" />
                  </span>
                  {lang === 'vi'
                    ? ' ở thanh dưới Safari ➔ Chọn "Thêm vào MH chính".'
                    : ' at the bottom of Safari ➔ Select "Add to Home Screen".'}
                </p>

                {/* Step Visual Mockup */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-white/95 border border-rose-200/90 flex items-center justify-between text-[11px] font-semibold text-slate-700 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-rose-100 text-rose-700 border border-rose-200">
                      <PlusSquare className="w-4 h-4" />
                    </span>
                    <span>{lang === 'vi' ? 'Thêm vào MH chính' : 'Add to Home Screen'}</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-rose-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Pointing Cue */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 animate-bounce">
            <ArrowDown className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Nhấn nút Chia sẻ [ ↑ ] ở thanh dưới để bắt đầu' : 'Tap the Share button [ ↑ ] below to begin'}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {lang === 'vi' 
              ? 'Sau khi thêm, mở ứng dụng từ màn hình chính để sử dụng.' 
              : 'Once added, open the app from your Home Screen to use.'}
          </p>
        </div>

      </motion.div>
    </div>
  );
};
