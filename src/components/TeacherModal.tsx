import React from 'react';
import { X, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Language } from '../types/schedule';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { DynamicIcon } from '../utils/iconHelper';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const { teachers, homeroomTeacher } = SCHEDULE_DATA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="glass-card border border-white rounded-3xl p-5 sm:p-6 shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                {language === 'vi' ? 'Đội Ngũ Giáo Viên Lớp 11-TN' : 'Grade 11-TN Faculty Directory'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'vi' ? `GVQN: ${homeroomTeacher.name} • Phòng học 504` : `Homeroom: ${homeroomTeacher.name} • Room 504`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Teacher Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {teachers.map((t, idx) => {
            const subject = language === 'vi' ? t.subjectVi : t.subjectEn;

            return (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:shadow-soft hover:border-purple-200 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                    <DynamicIcon name={t.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm truncate">{t.name}</h4>
                    <div className="text-[11px] font-semibold text-purple-600 truncate">{t.role}</div>
                    <div className="text-xs text-slate-600 mt-0.5 leading-snug">{subject}</div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {t.room}
                  </span>
                  <span className="font-medium text-slate-600 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {t.days}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
