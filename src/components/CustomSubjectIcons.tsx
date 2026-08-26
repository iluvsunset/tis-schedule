import React from 'react';
import { SubjectType } from '../types/schedule';

interface CustomIconProps {
  className?: string;
  size?: number;
}

/**
 * 1. Math Icon: Geometric Compass, Square Root & Quadratic Curve
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
      <linearGradient id="math-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="math-sub" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#93c5fd" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#math-grad)" fillOpacity="0.15" />
    {/* Geometric Compass / Triangle */}
    <path d="M7 23L16 6L25 23H7Z" stroke="url(#math-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Inner crossbar */}
    <path d="M11 17H21" stroke="url(#math-sub)" strokeWidth="2" strokeLinecap="round" />
    {/* Pi / Calculation symbol */}
    <path d="M14 20V23M18 20V23" stroke="url(#math-grad)" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="16" cy="6" r="2" fill="#3b82f6" />
  </svg>
);

/**
 * 2. English Icon: Dialogue Chat Bubbles & Letter "A"
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
      <linearGradient id="eng-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
      <linearGradient id="eng-bubble" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#fda4af" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#eng-grad)" fillOpacity="0.15" />
    {/* Speech Bubble 1 */}
    <path d="M5 14C5 9.58 8.58 6 13 6H19C23.42 6 27 9.58 27 14C27 18.42 23.42 22 19 22H14L8 26V21.5C6.15 19.8 5 17.1 5 14Z" fill="url(#eng-grad)" />
    {/* Letter 'A' inscribed inside */}
    <path d="M13 18L16 10L19 18M14 16H18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 3. Literature Icon: Classic Open Book with Feather Quill Pen
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
      <linearGradient id="lit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#9f1239" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#lit-grad)" fillOpacity="0.15" />
    {/* Open Book Wings */}
    <path d="M6 10C9.5 8.5 13.5 9 16 11C18.5 9 22.5 8.5 26 10V23C22.5 21.5 18.5 21.5 16 23.5C13.5 21.5 9.5 21.5 6 23V10Z" fill="url(#lit-grad)" />
    {/* Spine line */}
    <path d="M16 11V23.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    {/* Quill Pen Feather */}
    <path d="M22 6C20 8 19.5 11 20 13L17 16" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 4. Physics Icon: Atom Orbit, Nucleus & Energy Spark
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
      <linearGradient id="phy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#phy-grad)" fillOpacity="0.15" />
    {/* Oval Orbit 1 */}
    <ellipse cx="16" cy="16" rx="11" ry="4.5" transform="rotate(-30 16 16)" stroke="url(#phy-grad)" strokeWidth="1.8" />
    {/* Oval Orbit 2 */}
    <ellipse cx="16" cy="16" rx="11" ry="4.5" transform="rotate(30 16 16)" stroke="url(#phy-grad)" strokeWidth="1.8" />
    {/* Central Nucleus Core */}
    <circle cx="16" cy="16" r="3.2" fill="#0284c7" />
    <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
    {/* Orbiting electrons */}
    <circle cx="24" cy="11" r="1.5" fill="#38bdf8" />
    <circle cx="8" cy="21" r="1.5" fill="#38bdf8" />
  </svg>
);

/**
 * 5. Chemistry Icon: Erlenmeyer Flask with Bubbles
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
      <linearGradient id="chem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#chem-grad)" fillOpacity="0.15" />
    {/* Flask Neck and Body */}
    <path d="M14 6H18M15 6V11L8.5 22.5C7.8 23.8 8.7 25.5 10.3 25.5H21.7C23.3 25.5 24.2 23.8 23.5 22.5L17 11V6" stroke="url(#chem-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* Liquid inside flask */}
    <path d="M10.8 19C12 18 14 20 16 19C18 18 20 20 21.2 19L22.5 22C22.8 22.6 22.4 23.5 21.7 23.5H10.3C9.6 23.5 9.2 22.6 9.5 22L10.8 19Z" fill="#10b981" />
    {/* Bubbles */}
    <circle cx="16" cy="15" r="1.5" fill="#34d399" />
    <circle cx="13" cy="21" r="1.2" fill="#ffffff" />
    <circle cx="18" cy="20" r="1" fill="#ffffff" />
  </svg>
);

/**
 * 6. Biology Icon: DNA Helix & Sprouting Plant
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
      <linearGradient id="bio-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#bio-grad)" fillOpacity="0.15" />
    {/* Leaf 1 */}
    <path d="M16 26C16 18 23 15 23 9C17 9 14 16 16 26Z" fill="url(#bio-grad)" />
    {/* Leaf 2 */}
    <path d="M16 22C16 16 9 14 9 9C15 9 18 15 16 22Z" fill="#4ade80" />
    {/* Stem */}
    <path d="M16 9V26" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 7. Computer Science (Tin Học) Icon: Code Terminal & Chip Process
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
      <linearGradient id="cs-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0e7490" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#cs-grad)" fillOpacity="0.15" />
    {/* Laptop / Screen */}
    <rect x="6" y="8" width="20" height="13" rx="2.5" fill="#0891b2" stroke="url(#cs-grad)" strokeWidth="1.5" />
    {/* Code Brackets </> inside */}
    <path d="M11 14.5L9.5 16L11 17.5M17 14.5L18.5 16L17 17.5M14.5 13.5L13.5 18.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Keyboard Stand */}
    <path d="M4 23.5H28C28 24.5 27 25 25.5 25H6.5C5 25 4 24.5 4 23.5Z" fill="#0e7490" />
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
    <defs>
      <linearGradient id="sci-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6d28d9" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#sci-grad)" fillOpacity="0.15" />
    {/* Microscope Eyepiece & Tube */}
    <path d="M12 6L18 12M15 9L18 6L21 9L18 12" stroke="url(#sci-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 16C11 16 9 18 9 21C9 23 11 25 14 25H21" stroke="url(#sci-grad)" strokeWidth="2" strokeLinecap="round" />
    <rect x="13" y="19" width="6" height="2" rx="1" fill="#8b5cf6" />
    <rect x="8" y="24" width="16" height="2.5" rx="1.2" fill="#6d28d9" />
  </svg>
);

/**
 * 9. Physical Education (GDTC) Icon: Sport Trophy & Runner
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
      <linearGradient id="pe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#pe-grad)" fillOpacity="0.15" />
    {/* Trophy Cup */}
    <path d="M10 7H22V13C22 16.3 19.3 19 16 19C12.7 19 10 16.3 10 13V7Z" fill="url(#pe-grad)" />
    {/* Trophy Handles */}
    <path d="M10 9H7C6 9 5 10 5 11.5C5 13.5 6.5 15 8.5 15H10M22 9H25C26 9 27 10 27 11.5C27 13.5 25.5 15 23.5 15H22" stroke="url(#pe-grad)" strokeWidth="2" strokeLinecap="round" />
    {/* Trophy Base */}
    <path d="M16 19V23M11 25H21" stroke="url(#pe-grad)" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="16" cy="13" r="2" fill="#ffffff" />
  </svg>
);

/**
 * 10. Homeroom (Sinh Hoạt Lớp) Icon: Class Heart & Podium
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
      <linearGradient id="hr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#hr-grad)" fillOpacity="0.15" />
    {/* Warm Heart Shield */}
    <path d="M16 25C16 25 7 19.5 7 13.5C7 10.5 9.5 8 12.5 8C14.2 8 15.5 9 16 10C16.5 9 17.8 8 19.5 8C22.5 8 25 10.5 25 13.5C25 19.5 16 25 16 25Z" fill="url(#hr-grad)" />
    {/* Sparkling star inside heart */}
    <path d="M16 11L17 13.5L19.5 14L17.5 15.5L18 18L16 16.5L14 18L14.5 15.5L12.5 14L15 13.5L16 11Z" fill="#ffffff" />
  </svg>
);

/**
 * 11. Recess & Break Icon: Steaming Cute Ceramic Cup
 */
export const RecessIcon: React.FC<CustomIconProps> = ({ className = "w-5 h-5", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 8H18V15C18 17.2 16.2 19 14 19H8C5.8 19 4 17.2 4 15V8Z" fill="#f59e0b" />
    <path d="M18 10H20C21.1 10 22 10.9 22 12C22 13.1 21.1 14 20 14H18" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
    {/* Steam curls */}
    <path d="M8 3C8 4.5 9 5 9 6M12 2C12 3.5 13 4.5 13 6M15 3C15 4.5 16 5 16 6" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 21H19" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 12. Lunch Break Icon: Bento & Sunbeam
 */
export const LunchIcon: React.FC<CustomIconProps> = ({ className = "w-5 h-5", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="3" y="6" width="18" height="14" rx="4" fill="#ea580c" />
    <line x1="3" y1="13" x2="21" y2="13" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
    <line x1="12" y1="6" x2="12" y2="13" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />
    {/* Onigiri / Food shape */}
    <circle cx="7.5" cy="9.5" r="2" fill="#fed7aa" />
    <circle cx="16.5" cy="9.5" r="2" fill="#ffedd5" />
    <path d="M7 16.5H17" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * 13. Event / Assembly / School Activity Icon
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
      <linearGradient id="evt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="26" height="26" rx="8" fill="url(#evt-grad)" fillOpacity="0.15" />
    <path d="M16 6L18.5 12L25 12.5L20 17L21.5 23.5L16 20L10.5 23.5L12 17L7 12.5L13.5 12L16 6Z" fill="url(#evt-grad)" />
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
