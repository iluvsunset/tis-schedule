// Service Worker for TIS 11-TN Schedule PWA & Background Push Notifications

const CACHE_NAME = 'tis-schedule-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 1. Web Push Notification Event (fires when server sends push or when background trigger fires)
self.addEventListener('push', (event) => {
  let data = {
    title: '🔔 Lịch học ngày mai • Lớp 11-TN',
    body: 'Nhắc nhở lịch học: Kiểm tra các môn học và phòng học ngày mai.',
    icon: '/tis-logo.png',
    badge: '/favicon.png'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/tis-logo.png',
    badge: '/favicon.png',
    tag: 'tis-schedule-reminder',
    renotify: true,
    requireInteraction: false,
    data: {
      url: '/'
    },
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 2. Periodic Background Sync (runs in background for installed PWAs)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'tis-evening-reminder') {
    event.waitUntil(triggerBackgroundReminder());
  }
});

// 3. Background message handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_TEST_NOTIF') {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: icon || '/tis-logo.png',
      badge: '/favicon.png',
      tag: 'tis-test-notif',
      renotify: true,
      vibrate: [150, 80, 150]
    });
  }
});

// 4. Notification Click Event (focuses or opens the PWA window)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

async function triggerBackgroundReminder() {
  const options = {
    body: '🌅 Sáng: Tiết học chuẩn bị lúc 08:00\n🌆 Chiều: 13:30 tại Phòng 504',
    icon: '/tis-logo.png',
    badge: '/favicon.png',
    tag: 'tis-daily-reminder',
    vibrate: [200, 100, 200]
  };
  return self.registration.showNotification('🔔 Lịch học ngày mai • Lớp 11-TN', options);
}
