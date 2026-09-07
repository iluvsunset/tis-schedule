/// <reference types="vite/client" />

interface Window {
  startLoop?: () => void;
  stopLoop?: () => void;
  startloop?: () => void;
  stoploop?: () => void;
  lockScreensaver?: () => void;
  unlockScreensaver?: () => void;
  lockscreensaver?: () => void;
  unlockscreensaver?: () => void;
  screensaver?: {
    start: () => void;
    stop: () => void;
    lock: () => void;
    unlock: () => void;
    startloop?: () => void;
    stoploop?: () => void;
    isLocked: () => boolean;
  };
}
