import React from 'react';
import { Plus, CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';
import { PlannerItem } from '../types';
import { formatDateKey, formatTime12h, isSameDay } from '../utils/dateUtils';
import { playCompleteSound, playClickSound, triggerHaptic } from '../utils/audio';

interface WeeklyMatrixViewProps {
  weekDays: Date[];
  items: PlannerItem[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onToggleItem: (id: string) => void;
  onOpenNewModal: (presetDate: string) => void;
}

export const WeeklyMatrixView: React.FC<WeeklyMatrixViewProps> = ({
  weekDays,
  items,
  selectedDate,
  onSelectDate,
  onToggleItem,
  onOpenNewModal,
}) => {
  return (
    <div className="flex-1 px-4 py-3 pb-24 text-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Weekly Matrix</h2>
          <p className="text-xs text-slate-400">7-Day Bird’s-Eye Overview</p>
        </div>
      </div>

      <div className="space-y-3">
        {weekDays.map((date) => {
          const dateKey = formatDateKey(date);
          const dayItems = items.filter((i) => i.date === dateKey);
          const isToday = isSameDay(date, new Date());
          const isSelected = isSameDay(date, selectedDate);
          const completedCount = dayItems.filter((i) => i.completed).length;

          return (
            <div
              key={dateKey}
              className={`rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-slate-850 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              {/* Day Card Header */}
              <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700/40">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onSelectDate(date);
                  }}
                  className="flex items-center gap-2 text-left group"
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : isSelected
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/50'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </h3>
                      {isToday && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-semibold">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {completedCount}/{dayItems.length} tasks completed
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </button>

                {/* Quick add button for this day */}
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onOpenNewModal(dateKey);
                  }}
                  className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                  title={`Add to ${date.toLocaleDateString('en-US', { weekday: 'short' })}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Tasks List */}
              <div className="p-2 space-y-1.5">
                {dayItems.length === 0 ? (
                  <p className="text-[11px] text-slate-500 py-1.5 px-2 italic">
                    No scheduled items
                  </p>
                ) : (
                  dayItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-700/40 transition"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          if (!item.completed) {
                            playCompleteSound();
                          } else {
                            playClickSound();
                          }
                          onToggleItem(item.id);
                        }}
                        className="flex items-center gap-2 text-left flex-1 min-w-0"
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 hover:text-indigo-400 shrink-0 transition" />
                        )}
                        <span
                          className={`text-xs truncate ${
                            item.completed ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {item.title}
                        </span>
                      </button>

                      {item.startTime && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 bg-slate-900/50 px-1.5 py-0.5 rounded">
                          <Clock className="w-2.5 h-2.5 text-indigo-400" />
                          {formatTime12h(item.startTime)}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
