import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { getStartOfWeek } from '../utils/dateUtils';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onJumpToSampleWeek: () => void;
  isDarkMode?: boolean;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  onSelectDate,
  onJumpToSampleWeek,
  isDarkMode = false,
}) => {
  const [viewYear, setViewYear] = useState<number>(() => currentDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => currentDate.getMonth());

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    playClickSound();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    playClickSound();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate calendar days for viewMonth and viewYear
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startingDay = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xs rounded-3xl p-5 shadow-2xl border transition-all animate-in zoom-in-95 duration-200 ${
          isDarkMode
            ? 'bg-[#291730] border-purple-900/50 text-white'
            : 'bg-white border-purple-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ad1ca8] text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Select Week</h3>
              <p className="text-[11px] opacity-70">Jump to any date</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-black/10 transition opacity-75 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month & Year Controller */}
        <div className="flex items-center justify-between py-3">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-full hover:bg-purple-500/10 active:scale-95 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-extrabold tracking-tight">
            {monthNames[viewMonth]} {viewYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-full hover:bg-purple-500/10 active:scale-95 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day Name Labels (M T W T F S S) */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold opacity-60 mb-1">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {Array.from({ length: startingDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-7" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisDate = new Date(viewYear, viewMonth, dayNum);
            const isSelected =
              currentDate.getFullYear() === viewYear &&
              currentDate.getMonth() === viewMonth &&
              currentDate.getDate() === dayNum;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => {
                  playClickSound();
                  onSelectDate(thisDate);
                  onClose();
                }}
                className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isSelected
                    ? 'bg-[#ad1ca8] text-white shadow-xs scale-105'
                    : isDarkMode
                    ? 'hover:bg-purple-900/40 text-purple-100'
                    : 'hover:bg-purple-100 text-slate-800'
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onJumpToSampleWeek();
              onClose();
            }}
            className="w-full py-1.5 px-3 rounded-xl bg-[#ad1ca8] hover:bg-[#921433] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Show Sample Week (Oct 26, 2026)
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSelectDate(new Date());
              onClose();
            }}
            className="w-full py-1.5 px-3 rounded-xl hover:bg-purple-500/10 text-xs font-semibold text-center transition opacity-85 hover:opacity-100"
          >
            Go to Today
          </button>
        </div>
      </div>
    </div>
  );
};
