import React from 'react';
import { Language } from '../types/schedule';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--fg-muted)] no-print pb-6">
      <div className="flex items-center justify-center gap-2 mb-1.5 font-display font-bold text-[var(--fg)]">
        <span>{language === 'vi' ? 'Trường Quốc Tế TIS' : 'The International School (TIS)'}</span>
        <span>•</span>
        <span>{language === 'vi' ? 'Thời Khóa Biểu Lớp 11-TN' : 'Grade 11-TN Schedule System'}</span>
      </div>
      <p className="text-[var(--fg-faint)] text-[11px]">
        {language === 'vi' 
          ? 'TIS Academic Schedule • Thiết kế Cozy Cream ấm áp & nhẹ nhàng'
          : 'TIS Academic Schedule • Cozy Cream Edition'}
      </p>
    </footer>
  );
};
