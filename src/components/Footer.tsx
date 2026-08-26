import React from 'react';
import { Language } from '../types/schedule';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 no-print pb-6">
      <div className="flex items-center justify-center gap-2 mb-1.5 font-display font-bold text-slate-800 dark:text-slate-200">
        <span>{language === 'vi' ? 'Trường Quốc Tế TIS' : 'The International School (TIS)'}</span>
        <span>•</span>
        <span>{language === 'vi' ? 'Thời Khóa Biểu Lớp 11-TN' : 'Grade 11-TN Schedule System'}</span>
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-[11px]">
        {language === 'vi' 
          ? 'TIS Academic Schedule • Thiết kế tối giản, sang trọng'
          : 'TIS Academic Schedule • Luxury Minimalist Edition'}
      </p>
    </footer>
  );
};
