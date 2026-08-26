import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, Monitor, Sparkles, X, ChevronRight, Check } from 'lucide-react';
import { Language } from '../types/schedule';

interface IPhoneInstallGuideModalProps {
  language: Language;
}

export const IPhoneInstallGuideModal: React.FC<IPhoneInstallGuideModalProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Detect iPhone / iOS
    const isIPhoneDevice = /iPhone|iPod/i.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Detect if already installed as standalone PWA
    const isStandalone = (window.navigator as any).standalone === true || 
      window.matchMedia('(display-mode: standalone)').matches;

    // Check if user previously dismissed today
    const dismissed = sessionStorage.getItem('tis_iphone_guide_dismissed');

    if (isIPhoneDevice && !isStandalone && !dismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('tis_iphone_guide_dismissed', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.92, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 40 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="bg-white/95 backdrop-blur-2xl border border-rose-200/90 rounded-3xl sm:rounded-[32px] shadow-2xl max-w-md w-full p-5 text-slate-800 relative overflow-hidden"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shrink-0 shadow-cute-pink">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-md border border-rose-100">
                      iPhone / Safari Guide
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-base text-slate-900 mt-0.5">
                    {language === 'vi' ? 'Hướng Dẫn Trải Nghiệm Tốt Nhất' : 'Best iPhone Experience Guide'}
                  </h3>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Step Cards */}
            <div className="mt-4 space-y-3">
              
              {/* Step 1: Request Desktop Website */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/80 to-pink-50/60 border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-purple-950 flex items-center gap-1">
                      <Monitor className="w-3.5 h-3.5 text-purple-600" />
                      <span>{language === 'vi' ? 'Bật "Yêu cầu trang web cho máy tính"' : 'Turn on "Request Desktop Website"'}</span>
                    </h4>
                    <p className="text-[11px] text-purple-800/80 mt-1 leading-relaxed">
                      {language === 'vi' 
                        ? 'Nhấn vào biểu tượng ' 
                        : 'Tap the '}
                      <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-900">aA</span>
                      {language === 'vi'
                        ? ' trên thanh địa chỉ Safari ➔ Chọn "Yêu cầu trang web cho máy tính" để xem đầy đủ bảng.'
                        : ' on Safari address bar ➔ Select "Request Desktop Website" for widescreen view.'}
                    </p>

                    {/* Step 1 Visual Mockup */}
                    <div className="mt-2 p-2 rounded-xl bg-white/90 border border-purple-200/70 flex items-center justify-between text-[11px] font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-black text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">aA</span>
                        <span>{language === 'vi' ? 'Yêu cầu trang web cho máy tính' : 'Request Desktop Website'}</span>
                      </div>
                      <Check className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Add to Home Screen */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/60 border border-rose-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-rose-950 flex items-center gap-1">
                      <PlusSquare className="w-3.5 h-3.5 text-rose-600" />
                      <span>{language === 'vi' ? 'Thêm vào Màn hình chính (PWA)' : 'Add to Home Screen (PWA App)'}</span>
                    </h4>
                    <p className="text-[11px] text-rose-800/80 mt-1 leading-relaxed">
                      {language === 'vi'
                        ? 'Nhấn nút Chia sẻ '
                        : 'Tap the Share button '}
                      <span className="inline-flex items-center justify-center font-bold bg-white px-1.5 py-0.5 rounded border border-rose-200 text-rose-900">
                        <Share className="w-3 h-3 text-blue-600" />
                      </span>
                      {language === 'vi'
                        ? ' ở thanh dưới Safari ➔ Chọn "Thêm vào MH chính" để nhận thông báo lịch học mỗi tối!'
                        : ' at bottom Safari bar ➔ Select "Add to Home Screen" to receive evening reminders!'}
                    </p>

                    {/* Step 2 Visual Mockup */}
                    <div className="mt-2 p-2 rounded-xl bg-white/90 border border-rose-200/70 flex items-center justify-between text-[11px] font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          <PlusSquare className="w-3.5 h-3.5" />
                        </span>
                        <span>{language === 'vi' ? 'Thêm vào MH chính' : 'Add to Home Screen'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-400" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDismiss}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-cute-pink hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{language === 'vi' ? '✨ Đã hiểu • Xem thời khóa biểu ngay' : '✨ Got it • View Schedule Now'}</span>
              </motion.button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
