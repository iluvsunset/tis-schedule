import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share, PlusSquare, Monitor, Sparkles, Lock, ArrowDown } from 'lucide-react';
import { Language } from '../types/schedule';

interface IPhoneInstallGuideModalProps {
  language: Language;
}

export const IPhoneInstallGuideModal: React.FC<IPhoneInstallGuideModalProps> = ({ language }) => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Detect iPhone / iOS
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

  if (!isLocked) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="bg-white/90 backdrop-blur-2xl border border-rose-200/90 rounded-[32px] shadow-2xl max-w-md w-full p-6 text-slate-800 relative overflow-hidden"
      >
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-cute-pink mb-3">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 mb-1.5">
            {language === 'vi' ? 'Dành Cho Người Dùng iPhone' : 'iPhone Safari Access'}
          </span>

          <h2 className="font-display font-black text-xl text-slate-900 leading-snug">
            {language === 'vi' ? 'Thêm Vào Màn Hình Chính Để Mở Khóa' : 'Add To Home Screen To Unlock'}
          </h2>

          <p className="text-xs text-slate-500 mt-1.5 max-w-xs">
            {language === 'vi' 
              ? 'Để có trải nghiệm mượt mà và nhận thông báo nhắc lịch học mỗi tối, vui lòng làm theo 2 bước bên dưới:' 
              : 'Please follow the 2 steps below to install and unlock the full timetable app:'}
          </p>
        </div>

        {/* 2 Step Instructions */}
        <div className="mt-5 space-y-3.5">
          
          {/* Step 1: Request Desktop Website */}
          <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                1
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-purple-600" />
                  <span>{language === 'vi' ? 'Bật "Yêu cầu trang web cho máy tính"' : 'Turn on "Request Desktop Website"'}</span>
                </h4>
                <p className="text-[11px] text-purple-900/80 mt-1 leading-relaxed">
                  {language === 'vi' 
                    ? 'Nhấn vào biểu tượng ' 
                    : 'Tap the '}
                  <span className="font-serif font-black bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-900">aA</span>
                  {language === 'vi'
                    ? ' trên thanh địa chỉ Safari ➔ Chọn "Yêu cầu trang web cho máy tính".'
                    : ' on Safari address bar ➔ Select "Request Desktop Website".'}
                </p>

                {/* Step 1 Visual Mockup */}
                <div className="mt-2.5 p-2 rounded-xl bg-white/95 border border-purple-200 flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-black text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">aA</span>
                    <span>{language === 'vi' ? 'Yêu cầu trang web cho máy tính' : 'Request Desktop Website'}</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Add to Home Screen */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-100">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                2
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-rose-950 flex items-center gap-1.5">
                  <PlusSquare className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'vi' ? 'Thêm vào Màn hình chính' : 'Add to Home Screen'}</span>
                </h4>
                <p className="text-[11px] text-rose-900/80 mt-1 leading-relaxed">
                  {language === 'vi'
                    ? 'Nhấn nút Chia sẻ '
                    : 'Tap the Share button '}
                  <span className="inline-flex items-center justify-center bg-white px-1.5 py-0.5 rounded border border-rose-200 text-blue-600">
                    <Share className="w-3.5 h-3.5" />
                  </span>
                  {language === 'vi'
                    ? ' ở thanh dưới Safari ➔ Chọn "Thêm vào MH chính".'
                    : ' at bottom Safari bar ➔ Select "Add to Home Screen".'}
                </p>

                {/* Step 2 Visual Mockup */}
                <div className="mt-2.5 p-2 rounded-xl bg-white/95 border border-rose-200 flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      <PlusSquare className="w-3.5 h-3.5" />
                    </span>
                    <span>{language === 'vi' ? 'Thêm vào MH chính' : 'Add to Home Screen'}</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Pointing Cue */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 animate-bounce">
            <ArrowDown className="w-4 h-4" />
            <span>{language === 'vi' ? 'Nhấn nút Chia sẻ [ ↑ ] ở thanh dưới để bắt đầu' : 'Tap Share button [ ↑ ] below to begin'}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {language === 'vi' ? 'Sau khi thêm, mở ứng dụng từ icon trên màn hình chính để dùng ngay.' : 'Once added, open from Home Screen icon to use.'}
          </p>
        </div>

      </motion.div>
    </div>
  );
};
