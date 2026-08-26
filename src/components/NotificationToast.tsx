import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, X, Calendar } from 'lucide-react';

interface ToastData {
  title: string;
  body: string;
  icon?: string;
  time: string;
}

export const NotificationToast: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<ToastData>;
      if (customEvent.detail) {
        setToast(customEvent.detail);

        // Auto dismiss after 8 seconds
        const timer = setTimeout(() => {
          setToast(null);
        }, 8000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('tis-in-app-notification', handleNotification);
    return () => window.removeEventListener('tis-in-app-notification', handleNotification);
  }, []);

  return (
    <aside aria-label="Notifications" className="fixed top-4 right-4 z-[9999] max-w-sm w-full pointer-events-none p-2">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-rose-200/80 rounded-2xl shadow-2xl p-3.5 ring-1 ring-black/5"
          >
            <div className="flex items-start gap-3">
              
              {/* Animated Bell Icon / Logo */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shrink-0 shadow-cute-pink">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>TIS Schedule Reminder</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{toast.time}</span>
                </div>

                <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-0.5 leading-tight">
                  {toast.title}
                </h4>

                <p className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed font-sans bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {toast.body}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Đóng thông báo"
              >
                <X className="w-3.5 h-3.5" />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
