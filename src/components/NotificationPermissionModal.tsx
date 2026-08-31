import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
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

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({ language }) => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('tis_notif_prompt_dismissed');
    if (isNotificationSupported() && getNotificationPermission() === 'default' && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
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

  return (
    <aside 
      aria-label="Notification Pill" 
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9998] pointer-events-none no-print max-w-[92vw]"
    >
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="pointer-events-auto flex items-center gap-2 sm:gap-3 pl-3 pr-2 py-1.5 rounded-full bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-2xl border border-white/15 shadow-2xl ring-1 ring-black/20"
          >
            {/* Glowing Bell */}
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Bell className="w-3.5 h-3.5 animate-pulse" />
            </div>

            {/* Label */}
            <span className="text-xs font-bold text-slate-200 whitespace-nowrap">
              {language === 'vi' ? 'Nhắc lịch học 21:00' : 'Evening Reminder 21:00'}
            </span>

            {/* Enable Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleEnableNotifications}
              className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs whitespace-nowrap"
            >
              {language === 'vi' ? 'Bật' : 'Enable'}
            </motion.button>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-full transition cursor-pointer"
              title={language === 'vi' ? "Bỏ qua" : "Dismiss"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
