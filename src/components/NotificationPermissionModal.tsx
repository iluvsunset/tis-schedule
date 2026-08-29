import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, X, Download } from 'lucide-react';
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
    const dismissed = localStorage.getItem('tis_notif_prompt_dismissed');
    if (isNotificationSupported() && getNotificationPermission() === 'default' && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

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
    <aside aria-label="Permission Prompt" className="fixed bottom-4 right-4 z-[9998] max-w-sm w-full pointer-events-none p-2 no-print">
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-4.5 ring-1 ring-black/5 dark:ring-white/5 space-y-3"
          >
            {/* Header Area */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm border border-slate-800 dark:border-slate-700">
                  <BellRing className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    TIS • Thông Báo Lịch Học
                  </div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {language === 'vi' ? 'Nhận nhắc nhở mỗi tối?' : 'Enable Evening Reminders?'}
                  </h4>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title={language === 'vi' ? "Đóng" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description Card */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-800/50 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 font-medium">
              {language === 'vi' 
                ? 'Tự động gửi thông báo lịch học ngày mai vào 21:00 mỗi tối ngay cả khi bạn không mở web hoặc sau khi thêm vào màn hình chính.'
                : 'Automatically sends tomorrow\'s schedule every evening at 9:00 PM even without opening the app.'}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-0.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnableNotifications}
                className="flex-1 py-2.5 px-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Bật Thông Báo' : 'Enable Notifications'}</span>
              </motion.button>
              
              <button
                onClick={handleDismiss}
                className="py-2.5 px-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
              >
                {language === 'vi' ? 'Để sau' : 'Later'}
              </button>
            </div>

            {/* Optional PWA Add to Home Screen shortcut */}
            {deferredPrompt && !installed && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleInstallApp}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Cài đặt App vào màn hình chính' : 'Install to Home Screen'}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
