import React from 'react';
import { Language } from '../types/schedule';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="mt-12 pt-8 border-t border-slate-200/60 text-center text-xs text-slate-500 no-print pb-8">
      <div className="flex items-center justify-center gap-2 mb-2 font-display font-bold text-slate-700">
        <span>{language === 'vi' ? 'Trường Quốc Tế TIS' : 'The International School (TIS)'}</span>
        <span>•</span>
        <span>{language === 'vi' ? 'Thời Khóa Biểu Khối Trung Học' : 'High School Schedule System'}</span>
      </div>
      <p className="text-slate-400">
        {language === 'vi' 
          ? 'Dữ liệu đồng bộ trực tiếp từ bảng phân công TIS • Chúc các bạn học sinh Lớp 11-TN một năm học rực rỡ và thành công! ✨'
          : 'Live synced from TIS Academic Schedule • Wishing Grade 11-TN students an extraordinary and successful school year! ✨'}
      </p>
    </footer>
  );
};
