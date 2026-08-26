import { DayKey, Language } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { getVietnamTime } from './vietnamTime';

const NOTIF_STORAGE_KEY = 'tis_notifications_enabled';
const NOTIF_LAST_SENT_KEY = 'tis_last_notif_date';

/**
 * Plays a cute, gentle 2-tone melodic notification chime using Web Audio API
 */
export function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    // Tone 1 (C5 - 523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2 (G5 - 783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.12);
    gain2.gain.setValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn('Audio chime playback omitted:', e);
  }
}

/**
 * Checks if browser supports Web Notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission status ('default' | 'granted' | 'denied')
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Checks if notifications are enabled by user preference
 */
export function isNotificationEnabled(): boolean {
  if (!isNotificationSupported()) return false;
  return localStorage.getItem(NOTIF_STORAGE_KEY) === 'true' && Notification.permission === 'granted';
}

/**
 * Requests browser permission and enables notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
      return true;
    } else {
      localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Disables notifications in localStorage
 */
export function disableNotifications(): void {
  localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
}

/**
 * Generates tomorrow's schedule summary text
 */
export function getTomorrowScheduleSummary(language: Language = 'vi'): { title: string; body: string; dayName: string; morning: string; afternoon: string } {
  const vnTime = getVietnamTime();
  const currentDayOfWeek = vnTime.dayOfWeek;

  let nextDayKey: DayKey = 'mon';

  if (currentDayOfWeek === 1) nextDayKey = 'tue';
  else if (currentDayOfWeek === 2) nextDayKey = 'wed';
  else if (currentDayOfWeek === 3) nextDayKey = 'thu';
  else if (currentDayOfWeek === 4) nextDayKey = 'fri';
  else {
    nextDayKey = 'mon';
  }

  const nextDayData = SCHEDULE_DATA.weekSchedule.find(d => d.dayKey === nextDayKey) || SCHEDULE_DATA.weekSchedule[0];
  const dayName = language === 'vi' ? nextDayData.dayNameVi : nextDayData.dayNameEn;

  const morningSubjects = nextDayData.morning
    .filter(i => i.type !== 'break')
    .map(i => language === 'vi' ? i.subjectVi : i.subjectEn)
    .join(', ');

  const afternoonSubjects = nextDayData.afternoon
    .filter(i => i.type !== 'break')
    .map(i => language === 'vi' ? i.subjectVi : i.subjectEn)
    .join(', ');

  const title = language === 'vi'
    ? `🔔 Lịch học ngày mai • Lớp 11-TN`
    : `🔔 Tomorrow's Schedule • 11-TN`;

  const body = language === 'vi'
    ? `Sáng (08:00): ${morningSubjects || 'Nghỉ'}\nChiều (13:30): ${afternoonSubjects || 'Nghỉ'}\nPhòng: 504`
    : `Morning (08:00): ${morningSubjects || 'Off'}\nAfternoon (13:30): ${afternoonSubjects || 'Off'}\nRoom: 504`;

  return { title, body, dayName, morning: morningSubjects, afternoon: afternoonSubjects };
}

/**
 * Sends an immediate native browser notification using Service Worker & direct Notification API
 */
export async function sendBrowserNotification(title: string, body: string, icon = '/tis-logo.png'): Promise<boolean> {
  // 1. Play soft audio chime
  playNotificationChime();

  if (!isNotificationSupported()) return false;

  // 2. Request permission if not already determined
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  // 4. Try Service Worker ShowNotification first
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon,
          badge: '/favicon.png',
          tag: 'tis-schedule-reminder',
          requireInteraction: false
        });
        return true;
      }
    }
  } catch (e) {
    console.warn('ServiceWorker notification fallback to standard Notification:', e);
  }

  // 5. Fallback to direct window Notification
  try {
    new Notification(title, {
      body,
      icon,
      badge: '/favicon.png',
      tag: 'tis-schedule-reminder'
    });
    return true;
  } catch (error) {
    console.error('Failed to dispatch native notification:', error);
    return false;
  }
}

/**
 * Sends a test notification with pure text
 */
export async function sendTestNotification(language: Language = 'vi'): Promise<boolean> {
  const summary = getTomorrowScheduleSummary(language);
  return await sendBrowserNotification(summary.title, summary.body);
}

/**
 * Automated Evening Scheduler
 */
export function checkAndTriggerEveningReminder(language: Language = 'vi'): void {
  if (!isNotificationEnabled()) return;

  const vnTime = getVietnamTime();
  const currentHour = vnTime.hours;
  const todayDateStr = vnTime.dateStr;
  const lastSentDate = localStorage.getItem(NOTIF_LAST_SENT_KEY);

  // Trigger evening reminder between 21:00 (9 PM) and 23:59
  if (currentHour >= 21 && lastSentDate !== todayDateStr) {
    const summary = getTomorrowScheduleSummary(language);
    sendBrowserNotification(summary.title, summary.body).then((success) => {
      if (success) {
        localStorage.setItem(NOTIF_LAST_SENT_KEY, todayDateStr);
      }
    });
  }
}
