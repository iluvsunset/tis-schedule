import React from 'react';
import { SubjectType } from '../types/schedule';

interface CustomIconProps {
  className?: string;
  size?: number;
}

/**
 * 1. Math Icon: Minimalist luxury geometric compass & delta in 1-stroke line art
 */
export const MathIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="mathLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    <path d="M16 4L26 26H6L16 4Z" stroke="url(#mathLineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 19H21.5" stroke="url(#mathLineGrad)" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="16" cy="4" r="2.2" stroke="url(#mathLineGrad)" strokeWidth="1.6" />
    <path d="M12.5 26C12.5 22.5 19.5 22.5 19.5 26" stroke="url(#mathLineGrad)" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="1.5 2" />
  </svg>
);

/**
 * 2. English (Level 10) Icon: Minimalist luxury speech & stylized 'A' in 1-stroke line art
 */
export const EnglishIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="engLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="1" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <path d="M6 14C6 8.5 10.5 4 16 4C21.5 4 26 8.5 26 14C26 19.5 21.5 24 16 24C14 24 12.2 23.4 10.6 22.4L6 24.5V19.2C6 17.5 6 15.7 6 14Z" stroke="url(#engLineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 18L16 10L19 18M14 15.5H18" stroke="url(#engLineGrad)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="21.5" cy="8.5" r="1.2" fill="url(#engLineGrad)" />
  </svg>
);

/**
 * 3. Literature (Ngữ Văn) Icon: Minimalist luxury open book & quill in 1-stroke line art
 */
export const LiteratureIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="litLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb7185" />
        <stop offset="1" stopColor="#e11d48" />
      </linearGradient>
    </defs>
    <path d="M5 9C10 7.5 14 8 16 10C18 8 22 7.5 27 9V23C22 21.5 18 22 16 24C14 22 10 21.5 5 23V9Z" stroke="url(#litLineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 10V24" stroke="url(#litLineGrad)" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 13.5C11 13 13 13.2 14.5 14" stroke="url(#litLineGrad)" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M17.5 14C19 13.2 21 13 23 13.5" stroke="url(#litLineGrad)" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * 4. Physics (Vật Lý) Icon: Minimalist luxury quantum atom in 1-stroke line art
 */
export const PhysicsIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="phyLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(-30 16 16)" stroke="url(#phyLineGrad)" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="16" cy="16" rx="13" ry="5.5" transform="rotate(30 16 16)" stroke="url(#phyLineGrad)" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="16" cy="16" r="2.5" stroke="url(#phyLineGrad)" strokeWidth="1.6" />
    <circle cx="24.5" cy="11" r="1.4" stroke="url(#phyLineGrad)" strokeWidth="1.2" />
    <circle cx="7.5" cy="21" r="1.4" stroke="url(#phyLineGrad)" strokeWidth="1.2" />
  </svg>
);

/**
 * 5. Chemistry (Hóa Học) Icon: Minimalist luxury laboratory flask in 1-stroke line art
 */
export const ChemistryIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="chemLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34d399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M13 5H19M14.5 5V10.5L8.5 22C7.5 23.8 8.8 26 10.8 26H21.2C23.2 26 24.5 23.8 23.5 22L17.5 10.5V5" stroke="url(#chemLineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 18C13 17 15 18.5 17 17.5C19 16.5 21 18 21.5 18" stroke="url(#chemLineGrad)" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14" cy="22" r="1.2" stroke="url(#chemLineGrad)" strokeWidth="1.2" />
    <circle cx="18" cy="21" r="1" stroke="url(#chemLineGrad)" strokeWidth="1" />
  </svg>
);

/**
 * 6. Biology (Sinh Học) Icon: Minimalist luxury botanical leaf in 1-stroke line art
 */
export const BiologyIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="bioLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4ade80" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
    </defs>
    <path d="M16 27C16 17 25 14 25 6C17 6 14 15 16 27Z" stroke="url(#bioLineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 27C16 19 8 16 8 8C14 8 16 15 16 22" stroke="url(#bioLineGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 6V27" stroke="url(#bioLineGrad)" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * 7. Computer Science (Tin Học) Icon: Minimalist luxury laptop & code brackets in 1-stroke line art
 */
export const CSIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="csLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <rect x="5" y="6" width="22" height="15" rx="2.5" stroke="url(#csLineGrad)" strokeWidth="1.8" />
    <path d="M10.5 11.5L8.5 13.5L10.5 15.5M17.5 11.5L19.5 13.5L17.5 15.5M15 10.5L13 16.5" stroke="url(#csLineGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 24.5H29" stroke="url(#csLineGrad)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 8. Science Icon: Minimalist luxury microscope in 1-stroke line art
 */
export const ScienceIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="sciLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22d3ee" />
        <stop offset="1" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <path d="M12 7L18 13M15 9.5L17.5 7L21 10.5L18.5 13" stroke="url(#sciLineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 17C10.5 17 8 19.5 8 23C8 25 10.5 26 14 26H22" stroke="url(#sciLineGrad)" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13 21H19" stroke="url(#sciLineGrad)" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 26.5H25" stroke="url(#sciLineGrad)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 9. Physical Education (GDTC) Icon: Minimalist luxury victory trophy in 1-stroke line art
 */
export const PEIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="peLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb923c" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <path d="M9 7H23V13C23 16.9 19.9 20 16 20C12.1 20 9 16.9 9 13V7Z" stroke="url(#peLineGrad)" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9 9H5C4.5 9 4 10 4 11C4 13.5 6 14.5 8 14.5H9M23 9H27C27.5 9 28 10 28 11C28 13.5 26 14.5 24 14.5H23" stroke="url(#peLineGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 20V25M10 27H22" stroke="url(#peLineGrad)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 10. Homeroom (Sinh Hoạt Lớp) Icon: Minimalist luxury heart shield in 1-stroke line art
 */
export const HomeroomIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="homeLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c084fc" />
        <stop offset="1" stopColor="#9333ea" />
      </linearGradient>
    </defs>
    <path d="M16 26C16 26 6.5 20.5 6.5 13.5C6.5 10 9 7.5 12 7.5C13.8 7.5 15.2 8.3 16 9.2C16.8 8.3 18.2 7.5 20 7.5C23 7.5 25.5 10 25.5 13.5C25.5 20.5 16 26 16 26Z" stroke="url(#homeLineGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="16" cy="14" r="2.2" stroke="url(#homeLineGrad)" strokeWidth="1.5" />
  </svg>
);

/**
 * 11. Event Icon: Minimalist luxury 1-stroke celestial star & companion sparkle
 */
export const EventIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="eventLineGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="0.5" stopColor="#d946ef" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <path 
      d="M16 3C16 10.2 10.2 16 3 16C10.2 16 16 21.8 16 29C16 21.8 21.8 16 29 16C21.8 16 16 10.2 16 3Z" 
      stroke="url(#eventLineGrad)" 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="16" cy="16" r="1.8" stroke="url(#eventLineGrad)" strokeWidth="1.5" />
    <path 
      d="M25 4C25 6 23.5 7.5 21.5 7.5C23.5 7.5 25 9 25 11C25 9 26.5 7.5 28.5 7.5C26.5 7.5 25 6 25 4Z" 
      stroke="url(#eventLineGrad)" 
      strokeWidth="1.3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

/**
 * 12. Recess & Break Icon: Minimalist luxury hot coffee mug in 1-stroke line art
 */
export const RecessIcon: React.FC<CustomIconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="recessLineGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <path d="M4 8H17V14C17 16.5 15 18.5 12.5 18.5H8.5C6 18.5 4 16.5 4 14V8Z" stroke="url(#recessLineGrad)" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M17 10H19.5C20.5 10 21.5 11 21.5 12C21.5 13 20.5 14 19.5 14H17" stroke="url(#recessLineGrad)" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 3.5V6M12 2.5V6M15.5 3.5V6" stroke="url(#recessLineGrad)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 13. Lunch Break Icon: Minimalist luxury bento & rest in 1-stroke line art
 */
export const LunchIcon: React.FC<CustomIconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="lunchLineGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fb923c" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <rect x="3" y="6" width="18" height="13" rx="3.5" stroke="url(#lunchLineGrad)" strokeWidth="1.8" />
    <line x1="3" y1="12.5" x2="21" y2="12.5" stroke="url(#lunchLineGrad)" strokeWidth="1.5" strokeDasharray="2 2" />
    <line x1="12" y1="6" x2="12" y2="12.5" stroke="url(#lunchLineGrad)" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="7.5" cy="9.2" r="1.5" stroke="url(#lunchLineGrad)" strokeWidth="1.3" />
    <circle cx="16.5" cy="9.2" r="1.5" stroke="url(#lunchLineGrad)" strokeWidth="1.3" />
  </svg>
);

/**
 * 14. Luxury Vietnam Holiday Star Emblem (Pure 1-stroke, no solid squircle)
 */
export const VietnamHolidayEmblem: React.FC<CustomIconProps> = ({ className = "w-16 h-16", size }) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="goldStarGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fde047" />
        <stop offset="0.5" stopColor="#eab308" />
        <stop offset="1" stopColor="#ca8a04" />
      </linearGradient>
      <linearGradient id="flagRingGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f43f5e" />
        <stop offset="1" stopColor="#be123c" />
      </linearGradient>
    </defs>
    {/* Outer luxury circular sunburst ring */}
    <circle cx="24" cy="24" r="21" stroke="url(#flagRingGrad)" strokeWidth="1.8" strokeDasharray="4 2" />
    <circle cx="24" cy="24" r="17.5" stroke="url(#goldStarGrad)" strokeWidth="1.4" opacity="0.6" />
    {/* Golden 5-pointed Star */}
    <path 
      d="M24 10L27.5 19.5H37.5L29.5 25.5L32.5 35L24 29.5L15.5 35L18.5 25.5L10.5 19.5H20.5L24 10Z" 
      stroke="url(#goldStarGrad)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="24" cy="24" r="2.5" stroke="url(#goldStarGrad)" strokeWidth="1.2" />
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
