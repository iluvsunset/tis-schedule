import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, X, Sparkles, Download } from 'lucide-react';
import { Language } from '../types/schedule';
import { 
  isNotificationSupported, 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification 
} from '../utils/notificationService';

interface NotificationPermissionModalProps {
  language: Language;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({ language }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if permission is default and user hasn't dismissed before
    const dismissed = localStorage.getItem('tis_notif_prompt_dismissed');
    if (isNotificationSupported() && getNotificationPermission() === 'default' && !dismissed) {
      // Show prompt after 2 seconds for a natural feel
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      sendTestNotification(language);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('tis_notif_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <aside aria-label="Permission Prompt" className="fixed bottom-4 right-4 z-[9998] max-w-sm w-full pointer-events-none p-2">
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-rose-200/90 rounded-3xl shadow-2xl p-4 ring-1 ring-black/5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shrink-0 shadow-cute-pink">
                  <BellRing className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-md border border-rose-100">
                      TIS Schedule 11-TN
                    </span>
                    <Sparkles className="w-3 h-3 text-pink-400" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-slate-900 mt-0.5">
                    {language === 'vi' ? 'Nhận nhắc nhở mỗi tối?' : 'Enable Evening Reminders?'}
                  </h4>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-rose-50/50 p-2.5 rounded-2xl border border-rose-100/70">
              {language === 'vi' 
                ? 'Tự động gửi thông báo lịch học ngày mai vào 21:00 mỗi tối ngay cả khi bạn không mở web hoặc sau khi thêm vào màn hình chính.'
                : 'Automatically sends tomorrow\'s schedule every evening at 9:00 PM even without opening the app.'}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnableNotifications}
                className="flex-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-cute-pink hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Bật Thông Báo' : 'Enable Notifications'}</span>
              </motion.button>
              
              <button
                onClick={handleDismiss}
                className="py-2 px-3 rounded-2xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200 transition cursor-pointer"
              >
                {language === 'vi' ? 'Để sau' : 'Later'}
              </button>
            </div>

            {/* Optional PWA Add to Home Screen shortcut */}
            {deferredPrompt && !installed && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleInstallApp}
                  className="w-full py-1.5 px-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? '📲 Cài đặt App vào màn hình chính' : '📲 Install to Home Screen'}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
