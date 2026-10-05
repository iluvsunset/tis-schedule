import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from './icons';
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

  if (!showPrompt) return null;

  return (
    <aside 
      aria-label="Notification Pill" 
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9998] pointer-events-none no-print max-w-[92vw]"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 pl-3 pr-2 py-2 rounded-full bg-[var(--surface-solid)] text-[var(--fg)] backdrop-blur-2xl border-[1.5px] border-[var(--border)] shadow-puffy"
        >
          {/* Glowing Bell */}
          <div className="w-7 h-7 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center shrink-0 shadow-2xs">
            <Bell className="w-3.5 h-3.5 animate-pulse" />
          </div>

          {/* Label */}
          <span className="text-xs font-bold text-[var(--fg)] whitespace-nowrap font-display">
            {language === 'vi' ? 'Nhắc lịch học 21:00' : 'Evening Reminder 21:00'}
          </span>

          {/* Enable Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleEnableNotifications}
            className="px-3.5 py-1.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-fg)] font-bold text-xs transition cursor-pointer shadow-[0_2px_0_var(--edge)] active:translate-y-0.5 whitespace-nowrap"
          >
            {language === 'vi' ? 'Bật' : 'Enable'}
          </motion.button>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-active)] p-1.5 rounded-full transition cursor-pointer flex items-center justify-center"
            title={language === 'vi' ? "Bỏ qua" : "Dismiss"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
};
