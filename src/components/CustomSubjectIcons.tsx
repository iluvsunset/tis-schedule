import React from 'react';
import { SubjectType } from '../types/schedule';

interface CustomIconProps {
  className?: string;
  size?: number;
}

/**
 * 1. Math Icon: Minimalist Geometry & Calculation Compass
 */
export const MathIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    {/* Geometric Compass / Triangle */}
    <path d="M7.5 23.5L16 6.5L24.5 23.5H7.5Z" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 17H21" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="16" cy="6.5" r="1.8" fill="#0f172a" />
  </svg>
);

/**
 * 2. English (Level 10) Icon: Minimalist Monogram & Speech Emblem
 */
export const EnglishIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    {/* Speech Bubble */}
    <path d="M6 14C6 9.8 9.4 6.5 13.5 6.5H18.5C22.6 6.5 26 9.8 26 14C26 18.2 22.6 21.5 18.5 21.5H13.5L8 25.5V21C6.8 19.3 6 16.8 6 14Z" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Letter 'A' inscribed inside */}
    <path d="M13.5 17.5L16 11L18.5 17.5M14.3 15.5H17.7" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 3. Literature Icon: Classic Open Book
 */
export const LiteratureIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    {/* Open Book Wings */}
    <path d="M6.5 10C9.8 8.8 13.5 9.2 16 11C18.5 9.2 22.2 8.8 25.5 10V22.5C22.2 21.3 18.5 21.3 16 23C13.5 21.3 9.8 21.3 6.5 22.5V10Z" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M16 11V23" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 4. Physics Icon: Atomic Orbital Rings
 */
export const PhysicsIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <ellipse cx="16" cy="16" rx="10.5" ry="4.5" transform="rotate(-30 16 16)" stroke="#475569" strokeWidth="1.6" />
    <ellipse cx="16" cy="16" rx="10.5" ry="4.5" transform="rotate(30 16 16)" stroke="#475569" strokeWidth="1.6" />
    <circle cx="16" cy="16" r="2.8" fill="#0f172a" />
    <circle cx="23.5" cy="11.5" r="1.5" fill="#64748b" />
  </svg>
);

/**
 * 5. Chemistry Icon: Precision Laboratory Flask
 */
export const ChemistryIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M14 7H18M15 7V11.5L9 22.5C8.3 23.8 9.2 25 10.7 25H21.3C22.8 25 23.7 23.8 23 22.5L17 11.5V7" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 19C12.5 18 14.5 19.5 16 18.5C17.5 17.5 19.5 19 21 18.5L22 22.5C22.2 23 21.8 23.5 21.3 23.5H10.7C10.2 23.5 9.8 23 10 22.5L11 19Z" fill="#e2e8f0" />
    <circle cx="16" cy="15" r="1.2" fill="#64748b" />
  </svg>
);

/**
 * 6. Biology Icon: Botanical Leaf
 */
export const BiologyIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M16 25C16 17 22.5 14.5 22.5 9C17 9 14.5 15.5 16 25Z" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M16 21C16 15.5 10 13.5 10 9C15 9 17.5 14.5 16 21Z" stroke="#64748b" strokeWidth="1.6" />
    <path d="M16 9V25" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 7. Computer Science (Tin Học) Icon: Code Terminal
 */
export const CSIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <rect x="6.5" y="8" width="19" height="13" rx="2" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" />
    <path d="M11 13.5L9.5 14.5L11 15.5M16.5 13.5L18 14.5L16.5 15.5M14.5 12.5L13 16.5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 23.5H27" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 8. Science Icon: Laboratory Microscope
 */
export const ScienceIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M12 7L18 13M15 9.5L17.5 7L20.5 10L18 12.5" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 16.5C11 16.5 9 18.5 9 21.5C9 23.5 11 24.5 14 24.5H21" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="13" y="19.5" width="6" height="2" rx="1" fill="#64748b" />
    <rect x="8" y="24" width="16" height="2" rx="1" fill="#0f172a" />
  </svg>
);

/**
 * 9. Physical Education (GDTC) Icon: Clean Trophy
 */
export const PEIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M10 7.5H22V13C22 16.3 19.3 19 16 19C12.7 19 10 16.3 10 13V7.5Z" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" />
    <path d="M10 9.5H7C6 9.5 5 10.5 5 11.5C5 13.5 6.5 14.5 8.5 14.5H10M22 9.5H25C26 9.5 27 10.5 27 11.5C27 13.5 25.5 14.5 23.5 14.5H22" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16 19V23M11 25H21" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 10. Homeroom (Sinh Hoạt Lớp) Icon: Class Heart
 */
export const HomeroomIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M16 24C16 24 7.5 19 7.5 13.5C7.5 10.8 9.8 8.5 12.5 8.5C14.2 8.5 15.3 9.3 16 10.2C16.7 9.3 17.8 8.5 19.5 8.5C22.2 8.5 24.5 10.8 24.5 13.5C24.5 19 16 24 16 24Z" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="16" cy="14" r="1.5" fill="#0f172a" />
  </svg>
);

/**
 * 11. Recess & Break Icon: Minimal Cup
 */
export const RecessIcon: React.FC<CustomIconProps> = ({ className = "w-4 h-4", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 8H17V14C17 16.5 15 18.5 12.5 18.5H8.5C6 18.5 4 16.5 4 14V8Z" stroke="#475569" strokeWidth="1.6" />
    <path d="M17 10H19C20 10 21 11 21 12C21 13 20 14 19 14H17" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 4V6M12 3V6M15 4V6" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
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
    <rect x="3" y="6" width="18" height="13" rx="3.5" stroke="#475569" strokeWidth="1.6" />
    <line x1="3" y1="12.5" x2="21" y2="12.5" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
    <line x1="12" y1="6" x2="12" y2="12.5" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" />
    <circle cx="7.5" cy="9.2" r="1.5" fill="#64748b" />
    <circle cx="16.5" cy="9.2" r="1.5" fill="#64748b" />
  </svg>
);

/**
 * 13. Event Icon
 */
export const EventIcon: React.FC<CustomIconProps> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="2.5" y="2.5" width="27" height="27" rx="8.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M16 6.5L18.5 12L24.5 12.5L20 16.5L21.5 22.5L16 19.5L10.5 22.5L12 16.5L7.5 12.5L13.5 12L16 6.5Z" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" strokeLinejoin="round" />
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
