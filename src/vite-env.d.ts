/// <reference types="vite/client" />

interface Window {
  startLoop?: () => void;
  stopLoop?: () => void;
  lockScreensaver?: () => void;
  unlockScreensaver?: () => void;
  screensaver?: {
    start: () => void;
    stop: () => void;
    lock: () => void;
    unlock: () => void;
    isLocked: () => boolean;
  };
}
