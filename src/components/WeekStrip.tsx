import React from 'react';
import { DayInfo } from '../types';
import { playClickSound } from '../utils/audio';

interface WeekStripProps {
  days: DayInfo[];
  selectedDateString: string;
  onSelectDate: (date: Date) => void;
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  days,
  selectedDateString,
  onSelectDate,
}) => {
  return (
    <section className="bg-slate-900 px-3 py-2 border-b border-slate-800/80">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const isSelected = day.dateString === selectedDateString;
          const hasItems = day.itemCount > 0;
          const allCompleted = hasItems && day.completedCount === day.itemCount;

          return (
            <button
              key={day.dateString}
              type="button"
              onClick={() => {
                playClickSound();
                onSelectDate(day.date);
              }}
              className={`relative flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-[1.03] ring-2 ring-indigo-400/40'
                  : day.isToday
                  ? 'bg-slate-800 text-indigo-300 hover:bg-slate-750 border border-indigo-500/30'
                  : 'bg-slate-850/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {/* Day abbreviation */}
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${
                  isSelected ? 'text-indigo-100' : 'text-slate-400'
                }`}
              >
                {day.dayShort}
              </span>

              {/* Day Number */}
              <span
                className={`text-base font-bold leading-none ${
                  isSelected ? 'text-white' : day.isToday ? 'text-indigo-400' : 'text-slate-200'
                }`}
              >
                {day.dayNumber}
              </span>

              {/* Status Indicator */}
              <div className="mt-2 flex items-center justify-center h-3 w-full">
                {hasItems ? (
                  <span
                    className={`inline-flex items-center justify-center text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      allCompleted
                        ? isSelected
                          ? 'bg-emerald-300 text-emerald-950'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {day.completedCount}/{day.itemCount}
                  </span>
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                )}
              </div>

              {/* Today dot indicator if not selected */}
              {day.isToday && !isSelected && (
                <span className="absolute -top-0.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
