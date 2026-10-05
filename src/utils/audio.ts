/**
 * Authentic Creamy Keyboard ASMR Audio Engine
 * Sourced directly from YouTube: https://www.youtube.com/watch?v=oBblNofDXrY
 * (Akko SPR 67 + Akko POM Brown creamy lubed mechanical switches)
 */

import { CREAMY_KEYBOARD_SAMPLES } from './creamyAudioData';

let audioCtx: AudioContext | null = null;
const decodedBufferCache: Record<string, AudioBuffer> = {};
let isPreloading = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  } catch (err) {
    console.warn('AudioContext initialization prevented:', err);
  }
  return audioCtx;
}

// Convert base64 data URI to ArrayBuffer for Web Audio decoding
function dataUriToArrayBuffer(dataUri: string): ArrayBuffer {
  const base64 = dataUri.split(',')[1];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Preload and decode all keycap samples into Web Audio buffers
async function preloadSamples() {
  if (isPreloading || typeof window === 'undefined') return;
  isPreloading = true;
  const ctx = getAudioContext();
  if (!ctx) return;

  const entries = Object.entries(CREAMY_KEYBOARD_SAMPLES) as [string, string][];
  for (const [key, dataUri] of entries) {
    if (decodedBufferCache[key]) continue;
    try {
      const arrayBuffer = dataUriToArrayBuffer(dataUri);
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      decodedBufferCache[key] = audioBuffer;
    } catch (e) {
      console.warn(`Failed to decode sample ${key}:`, e);
    }
  }
}

let sfxEnabled = true;
try {
  const saved = localStorage.getItem('tis_creamy_sfx');
  if (saved !== null) {
    sfxEnabled = saved === 'true';
  }
} catch {
  sfxEnabled = true;
}

export function isCreamySfxEnabled(): boolean {
  return sfxEnabled;
}

export function setCreamySfxEnabled(enabled: boolean): void {
  sfxEnabled = enabled;
  try {
    localStorage.setItem('tis_creamy_sfx', String(enabled));
  } catch {}
}

export function toggleCreamySfx(): boolean {
  const next = !sfxEnabled;
  setCreamySfxEnabled(next);
  if (next) {
    playCreamyKeycapSound('pop');
  }
  return next;
}

export type SwitchSoundVariant = 'standard' | 'spacebar' | 'soft' | 'pop';

const NORMAL_KEYS = ['key1', 'key2', 'key3', 'key4', 'key5'] as const;

/**
 * Plays the authentic creamy mechanical keyboard switch sound from the video
 */
export function playCreamyKeycapSound(variant: SwitchSoundVariant = 'standard') {
  if (!sfxEnabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Trigger preload if not yet decoded
  if (Object.keys(decodedBufferCache).length === 0) {
    preloadSamples().catch(() => {});
  }

  // Pick sample according to variant
  let sampleKey: string;
  if (variant === 'spacebar') {
    sampleKey = 'spacebar';
  } else {
    // Randomly pick one of the 5 authentic switch samples for realistic typing feel
    const randomIdx = Math.floor(Math.random() * NORMAL_KEYS.length);
    sampleKey = NORMAL_KEYS[randomIdx];
  }

  const buffer = decodedBufferCache[sampleKey];

  if (buffer) {
    try {
      const now = ctx.currentTime;
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      // Subtle pitch variation (+/- 3%) mimicking different keycap positions and strike angles
      const pitchJitter = 0.97 + Math.random() * 0.06;
      source.playbackRate.setValueAtTime(pitchJitter, now);

      const gain = ctx.createGain();
      let masterGain = 0.38;
      if (variant === 'spacebar') {
        masterGain = 0.44;
      } else if (variant === 'soft') {
        masterGain = 0.25;
      }
      gain.gain.setValueAtTime(masterGain, now);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      return;
    } catch (e) {
      // Fallback below
    }
  }

  // Fallback synthetic creamy thock while samples decode
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
}

/**
 * Legacy chime sound export for backwards compatibility
 */
export function playChimeSound() {
  playCreamyKeycapSound('pop');
}

/**
 * Initializes global click and typing listeners for the creamy keyboard sound
 */
export function initCreamyKeyboardListener(): () => void {
  if (typeof window === 'undefined') return () => {};

  let lastClickTime = 0;

  // Preload authentic samples on first user interaction
  const triggerPreload = () => {
    preloadSamples();
    window.removeEventListener('pointerdown', triggerPreload);
    window.removeEventListener('keydown', triggerPreload);
  };
  window.addEventListener('pointerdown', triggerPreload, { passive: true, once: true });
  window.addEventListener('keydown', triggerPreload, { passive: true, once: true });

  // Click / Tap listener on buttons, keycaps, tabs, and interactive cards
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if clicked element or its parent is an interactive control
    const interactive = target.closest(
      'button, a, [role="button"], [role="tab"], .card-cozy-interactive, input[type="radio"], input[type="checkbox"], select'
    );

    if (interactive) {
      const now = performance.now();
      // Debounce slightly to prevent accidental double-fires
      if (now - lastClickTime > 40) {
        lastClickTime = now;
        playCreamyKeycapSound('standard');
      }
    }
  };

  // Keyboard typing listener: plays creamy thock when user types into any input or on page
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore modifier keys alone
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;
    if (e.repeat) return; // don't spam on key hold

    if (e.key === ' ' || e.code === 'Space') {
      playCreamyKeycapSound('spacebar');
    } else if (e.key === 'Enter') {
      playCreamyKeycapSound('pop');
    } else {
      playCreamyKeycapSound('standard');
    }
  };

  window.addEventListener('click', handleClick, { passive: true, capture: true });
  window.addEventListener('keydown', handleKeyDown, { passive: true });

  return () => {
    window.removeEventListener('click', handleClick, { capture: true });
    window.removeEventListener('keydown', handleKeyDown);
  };
}
