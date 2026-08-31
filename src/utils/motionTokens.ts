import { Transition, Variants, useReducedMotion } from 'framer-motion';

// ============================================================================
// PO MOTION DESIGN SYSTEM - SPRING TOKENS & EASING CONFIGURATIONS
// ============================================================================

/**
 * Snappy, direct spring for micro-interactions, button presses, toggles, badges, and icon feedback.
 */
export const springTactile: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

/**
 * Smooth, balanced spring for cards, timeline items, interactive tiles, and gesture feedback.
 */
export const springCard: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
  mass: 0.9,
};

/**
 * Fluid, luxurious spring for modal sheets, dialogs, drawers, and full-screen overlays.
 */
export const springSheet: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 30,
  mass: 1.0,
};

/**
 * High-precision, critically-damped spring for sliding active tab pills (no wobble/overshoot).
 */
export const springTabPill: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 36,
  mass: 0.85,
};

/**
 * Spring interpolation for progress bars.
 */
export const springProgress: Transition = {
  type: 'spring',
  stiffness: 60,
  damping: 15,
};

/**
 * Smooth ambient cubic-bezier easing for backdrop fades, atmospheric glows, and opacity transitions.
 */
export const easeAmbient: Transition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1],
};

/**
 * Subtle looping ambient ease for glowing lines and radar pulse breathing.
 */
export const easeAmbientLoop: Transition = {
  duration: 2.2,
  repeat: Infinity,
  ease: 'easeInOut',
};

export const springTokens = {
  tactile: springTactile,
  card: springCard,
  sheet: springSheet,
  tabPill: springTabPill,
  progress: springProgress,
  snappy: springTactile,
};

// ============================================================================
// MOTION GESTURE TOKENS (No hover animations, tap/click feedback preserved)
// ============================================================================

export const gestureTokens = {
  button: {
    whileTap: { scale: 0.96, transition: springTactile },
  },
  card: {
    whileTap: { scale: 0.98, transition: springTactile },
  },
  subtle: {
    whileTap: { scale: 0.99, transition: springTactile },
  },
  iconButton: {
    whileTap: { scale: 0.92, transition: springTactile },
  },
};

// ============================================================================
// MOTION VARIANTS
// ============================================================================

/**
 * Staggered list container variants (standard & fast cadence).
 */
export const staggerListContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

export const staggerListFastContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.01,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.015,
      staggerDirection: -1,
    },
  },
};

// Convenient alias
export const listContainerVariants = staggerListContainer;

/**
 * Staggered list item variants for cards, classes, teachers.
 */
export const staggerListItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 12, 
    scale: 0.98 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springCard,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

export const staggerListItemSubtle: Variants = {
  hidden: { 
    opacity: 0, 
    y: 6 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// Convenient alias
export const listItemVariants = staggerListItem;

/**
 * Directional day transitions for navigating between days of the week.
 */
export const directionalDayVariants: Variants = {
  enter: (direction: number = 1) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
    scale: 0.99,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: springCard,
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  },
  exit: (direction: number = 1) => ({
    x: direction > 0 ? -24 : 24,
    opacity: 0,
    scale: 0.99,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0],
    },
  }),
};

export const dayHeaderVariants: Variants = {
  initial: { opacity: 0, y: -8 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -6, 
    transition: { duration: 0.15 } 
  },
};

/**
 * Modal sheet and overlay entrances.
 */
export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.22, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.18, ease: 'easeIn' } 
  },
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.22, ease: 'easeOut' } 
  },
};

export const modalSheetVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.92, 
    y: 18 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: springSheet 
  },
  exit: { 
    opacity: 0, 
    scale: 0.94, 
    y: 12, 
    transition: { duration: 0.18, ease: [0.32, 0, 0.67, 0] } 
  },
  hidden: { 
    opacity: 0, 
    scale: 0.92, 
    y: 18 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: springSheet 
  },
};

// Convenient alias for modal content
export const modalContentVariants = modalSheetVariants;

export const dropdownMenuVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.88, 
    y: -8 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: springTactile 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: -6, 
    transition: { duration: 0.15, ease: 'easeIn' } 
  },
  hidden: { 
    opacity: 0, 
    scale: 0.88, 
    y: -8 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: springTactile 
  },
};

// Convenient alias for dropdown
export const dropdownVariants = dropdownMenuVariants;

/**
 * Active radar beacons & live indicators.
 */
export const radarBeaconVariants: Variants = {
  initial: { scale: 1, opacity: 0.7 },
  animate: {
    scale: [1, 1.9, 1],
    opacity: [0.7, 0, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const radarPingVariants: Variants = {
  initial: { scale: 0.8, opacity: 0.9 },
  animate: {
    scale: [0.8, 2.2],
    opacity: [0.9, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

export const activeTopAccentVariants: Variants = {
  initial: { opacity: 0.75 },
  animate: {
    opacity: [0.75, 1, 0.75],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// REDUCED MOTION / ACCESSIBILITY SAFE FALLBACKS
// ============================================================================

/**
 * Opacity-only fallback variants for reduced motion preference.
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.15 } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1 } 
  },
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { duration: 0.15 } 
  },
};

/**
 * Helper to get motion-safe variants based on user's prefers-reduced-motion setting.
 */
export function getAccessibleVariant(
  standardVariant: Variants,
  prefersReduced: boolean | null,
  fallbackVariant: Variants = reducedMotionVariants
): Variants {
  return prefersReduced ? fallbackVariant : standardVariant;
}

/**
 * Custom React hook for accessible motion variants with automatic fallback.
 */
export function useAccessibleMotion() {
  const shouldReduceMotion = useReducedMotion();
  
  return {
    shouldReduceMotion: Boolean(shouldReduceMotion),
    getVariant: (standard: Variants, fallback?: Variants) => 
      getAccessibleVariant(standard, shouldReduceMotion, fallback),
    springTactile: shouldReduceMotion ? { duration: 0.1 } : springTactile,
    springCard: shouldReduceMotion ? { duration: 0.15 } : springCard,
    springSheet: shouldReduceMotion ? { duration: 0.2 } : springSheet,
    springTabPill: shouldReduceMotion ? { duration: 0.1 } : springTabPill,
    easeAmbient: shouldReduceMotion ? { duration: 0.1 } : easeAmbient,
  };
}
