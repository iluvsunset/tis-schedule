import React from 'react';
import { SubjectType } from '../types/schedule';

interface CustomIconProps {
  className?: string;
  size?: number;
}

/**
 * 1. Math Icon: Vibrant Sky Blue Gradient with Calculator / Geometry
 */
export const MathIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="mathGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60a5fa" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="mathInner" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.3" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#mathGrad)" />
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#mathInner)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    {/* Geometric Compass / Delta & Calculator Symbols */}
    <path d="M18 8L27 26H9L18 8Z" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 19H23.5" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="8" r="2.2" fill="#ffffff" />
    <circle cx="18" cy="14" r="1.5" fill="#dbeafe" />
  </svg>
);

/**
 * 2. English (Level 10) Icon: Vibrant Hot Pink Gradient with Speech & Globe
 */
export const EnglishIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="engGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="1" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#engGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    {/* Cute Speech Bubble */}
    <path d="M7 16C7 11 11.5 7 18 7C24.5 7 29 11 29 16C29 21 24.5 25 18 25C16 25 14 24.5 12.5 23.8L8 27V21.5C7.3 19.8 7 18 7 16Z" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
    {/* Stylized English 'A' */}
    <path d="M14.5 20.5L18 11.5L21.5 20.5M15.5 18H20.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24.5" cy="11.5" r="1.5" fill="#fbcfe8" />
  </svg>
);

/**
 * 3. Literature (Ngữ Văn) Icon: Vibrant Rose Red Book
 */
export const LiteratureIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="litGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb7185" />
        <stop offset="1" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#litGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    {/* Open Book Wings */}
    <path d="M7 11.5C11 10 15 10.5 18 12.5C21 10.5 25 10 29 11.5V24.5C25 23 21 23 18 25C15 23 11 23 7 24.5V11.5Z" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
    <path d="M18 12.5V25" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M11 15C13 14.5 15 14.8 16.5 15.5" stroke="#ffe4e6" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19.5 15.5C21 14.8 23 14.5 25 15" stroke="#ffe4e6" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 4. Physics (Vật Lý) Icon: Electric Indigo & Violet Atom
 */
export const PhysicsIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="phyGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#phyGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <ellipse cx="18" cy="18" rx="12" ry="5" transform="rotate(-30 18 18)" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.85" />
    <ellipse cx="18" cy="18" rx="12" ry="5" transform="rotate(30 18 18)" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.85" />
    <circle cx="18" cy="18" r="3.2" fill="#ffffff" />
    <circle cx="26" cy="13" r="1.8" fill="#c7d2fe" />
    <circle cx="10" cy="23" r="1.8" fill="#c7d2fe" />
  </svg>
);

/**
 * 5. Chemistry (Hóa Học) Icon: Vibrant Emerald Green Flask
 */
export const ChemistryIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="chemGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34d399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#chemGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <path d="M15 8H21M16.5 8V13L10 24.5C9.2 26 10.2 27.5 12 27.5H24C25.8 27.5 26.8 26 26 24.5L19.5 13V8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Liquid Fill with Bubbles */}
    <path d="M12 21C14 20 16 21.5 18 20.5C20 19.5 22 21 24 20.5L25 25C25.3 26 24.5 26.5 23.5 26.5H12.5C11.5 26.5 10.7 26 11 25L12 21Z" fill="#ffffff" fillOpacity="0.35" />
    <circle cx="15.5" cy="23.5" r="1.3" fill="#ffffff" />
    <circle cx="19.5" cy="22" r="1" fill="#ffffff" />
    <circle cx="17" cy="17" r="1.2" fill="#d1fae5" />
  </svg>
);

/**
 * 6. Biology (Sinh Học) Icon: Fresh Leaf Green Botanical
 */
export const BiologyIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="bioGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ade80" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#bioGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <path d="M18 28C18 19 25.5 16 25.5 9.5C19 9.5 16 17 18 28Z" fill="#ffffff" fillOpacity="0.3" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
    <path d="M18 23C18 17 11 14.5 11 9.5C17 9.5 19.5 16 18 23Z" fill="#ffffff" fillOpacity="0.15" stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M18 9.5V28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 7. Computer Science (Tin Học) Icon: Vibrant Golden Amber Laptop & Code
 */
export const CSIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="csGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#csGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <rect x="7" y="9" width="22" height="15" rx="2.5" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="2" />
    <path d="M12 14.5L10 16.5L12 18.5M19 14.5L21 16.5L19 18.5M16.5 13.5L14.5 19.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 26.5H31" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * 8. Science Icon: Vibrant Cyan & Teal Microscope
 */
export const ScienceIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="sciGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22d3ee" />
        <stop offset="1" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#sciGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <path d="M14 8L20 14M17 10.5L19.5 8L23 11.5L20.5 14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 18C12.5 18 10 20.5 10 24C10 26 12.5 27 16 27H24" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <rect x="15" y="21.5" width="7" height="2.5" rx="1" fill="#ffffff" fillOpacity="0.4" />
    <rect x="9" y="27" width="18" height="2.5" rx="1.2" fill="#ffffff" />
  </svg>
);

/**
 * 9. Physical Education (GDTC) Icon: Sporty Orange Trophy
 */
export const PEIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="peGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb923c" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#peGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <path d="M11 9H25V15C25 18.8 21.8 22 18 22C14.2 22 11 18.8 11 15V9Z" fill="#ffffff" fillOpacity="0.25" stroke="#ffffff" strokeWidth="2" />
    <path d="M11 11H7C6 11 5 12 5 13C5 15.5 7 16.5 9 16.5H11M25 11H29C30 11 31 12 31 13C31 15.5 29 16.5 27 16.5H25" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 22V26M12 28H24" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/**
 * 10. Homeroom (Sinh Hoạt Lớp) Icon: Warm Violet Heart
 */
export const HomeroomIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="homeGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="32" height="32" rx="10" fill="url(#homeGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <path d="M18 27C18 27 8.5 21.5 8.5 15C8.5 12 11 9.5 14 9.5C15.8 9.5 17.2 10.3 18 11.2C18.8 10.3 20.2 9.5 22 9.5C25 9.5 27.5 12 27.5 15C27.5 21.5 18 27 18 27Z" fill="#ffffff" fillOpacity="0.3" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="18" cy="15.5" r="2" fill="#ffffff" />
  </svg>
);

/**
 * 11. Recess & Break Icon
 */
export const RecessIcon: React.FC<CustomIconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 8H17V14C17 16.5 15 18.5 12.5 18.5H8.5C6 18.5 4 16.5 4 14V8Z" stroke="#f59e0b" strokeWidth="2" />
    <path d="M17 10H19C20 10 21 11 21 12C21 13 20 14 19 14H17" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 4V6M12 3V6M15 4V6" stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * 12. Lunch Break Icon
 */
export const LunchIcon: React.FC<CustomIconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="6" width="18" height="13" rx="3.5" stroke="#f97316" strokeWidth="2" />
    <line x1="3" y1="12.5" x2="21" y2="12.5" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="2 2" />
    <line x1="12" y1="6" x2="12" y2="12.5" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="7.5" cy="9.2" r="1.5" fill="#f97316" />
    <circle cx="16.5" cy="9.2" r="1.5" fill="#f97316" />
  </svg>
);

/**
 * 13. Event Icon: Minimalist, luxury, elegant 1-stroke celestial star (no solid background)
 */
export const EventIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 36 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="luxuryEventStroke" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="0.5" stopColor="#d946ef" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    {/* Elegant 4-point luxury star emblem in 1 clean stroke */}
    <path 
      d="M18 3.5C18 11.5 11.5 18 3.5 18C11.5 18 18 24.5 18 32.5C18 24.5 24.5 18 32.5 18C24.5 18 18 11.5 18 3.5Z" 
      stroke="url(#luxuryEventStroke)" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Subtle companion sparkle */}
    <path 
      d="M28 5.5C28 7.8 26.2 9.5 24 9.5C26.2 9.5 28 11.2 28 13.5C28 11.2 29.8 9.5 32 9.5C29.8 9.5 28 7.8 28 5.5Z" 
      stroke="url(#luxuryEventStroke)" 
      strokeWidth="1.4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Center luxury gemstone diamond dot */}
    <circle cx="18" cy="18" r="1.75" stroke="url(#luxuryEventStroke)" strokeWidth="1.4" />
  </svg>
);

/**
 * Dynamic Custom Subject Icon Selector
 */
export const CustomSubjectIcon: React.FC<{ type: SubjectType; className?: string; size?: number }> = ({ 
  type, 
  className, 
  size 
}) => {
  switch (type) {
    case 'math':
      return <MathIcon className={className} size={size} />;
    case 'english':
      return <EnglishIcon className={className} size={size} />;
    case 'literature':
      return <LiteratureIcon className={className} size={size} />;
    case 'physics':
      return <PhysicsIcon className={className} size={size} />;
    case 'chemistry':
      return <ChemistryIcon className={className} size={size} />;
    case 'biology':
      return <BiologyIcon className={className} size={size} />;
    case 'cs':
      return <CSIcon className={className} size={size} />;
    case 'science':
      return <ScienceIcon className={className} size={size} />;
    case 'pe':
      return <PEIcon className={className} size={size} />;
    case 'homeroom':
      return <HomeroomIcon className={className} size={size} />;
    case 'break':
      return <RecessIcon className={className} size={size} />;
    case 'event':
    default:
      return <EventIcon className={className} size={size} />;
  }
};
