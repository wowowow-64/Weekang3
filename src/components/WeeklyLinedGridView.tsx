import React, { useState } from 'react';
import { PlannerItem } from '../types';
import { formatDateKey } from '../utils/dateUtils';
import { playCompleteSound, playClickSound, triggerHaptic } from '../utils/audio';
import { Check, Trash2, Plus } from 'lucide-react';

interface WeeklyLinedGridViewProps {
  weekDays: Date[];
  items: PlannerItem[];
  isDarkMode?: boolean;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onSaveQuickLine: (dateKey: string, text: string, timeStr?: string) => void;
  onEditItem: (item: PlannerItem) => void;
  onOpenDayDetail: (date: Date) => void;
}

export const WeeklyLinedGridView: React.FC<WeeklyLinedGridViewProps> = ({
  weekDays,
  items,
  isDarkMode = false,
  onToggleItem,
  onDeleteItem,
  onSaveQuickLine,
  onEditItem,
  onOpenDayDetail,
}) => {
  // Editing state for an inline line
  const [activeEditingDay, setActiveEditingDay] = useState<string | null>(null);
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);
  const [lineText, setLineText] = useState<string>('');

  // Find the days of the week:
  // weekDays[0] = Monday, [1] = Tuesday, [2] = Wednesday, [3] = Thursday, [4] = Friday, [5] = Saturday, [6] = Sunday
  const monday = weekDays[0] || new Date();
  const tuesday = weekDays[1] || new Date();
  const wednesday = weekDays[2] || new Date();
  const thursday = weekDays[3] || new Date();
  const friday = weekDays[4] || new Date();
  const saturday = weekDays[5] || new Date();
  const sunday = weekDays[6] || new Date();

  // Commit line input
  const handleCommitLine = (dateKey: string) => {
    const trimmed = lineText.trim();
    if (trimmed) {
      playClickSound();
      triggerHaptic();
      onSaveQuickLine(dateKey, trimmed);
    }
    setActiveEditingDay(null);
    setEditingLineIndex(null);
    setLineText('');
  };

  const handleStartEditing = (dateKey: string, index: number, initialText = '') => {
    playClickSound();
    setActiveEditingDay(dateKey);
    setEditingLineIndex(index);
    setLineText(initialText);
  };

  // Helper to render an individual notebook day card
  const renderDayCard = (date: Date, isWeekend = false) => {
    const dateKey = formatDateKey(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
    const dayNumber = date.getDate();
    const dateLabel = `${monthShort} ${dayNumber}`;

    const dayItems = items.filter((i) => i.date === dateKey);

    // Number of ruled lines: full day gets ~7-8 lines, weekend gets ~4 lines
    const lineCount = isWeekend ? 4 : 8;

    return (
      <div
        key={dateKey}
        className={`w-full rounded-2xl overflow-hidden shadow-xs flex flex-col border transition-all ${
          isWeekend ? 'flex-1 min-h-[90px]' : 'flex-1 min-h-[150px]'
        } ${
          isDarkMode
            ? 'bg-[#251a2d] border-[#44274c]'
            : 'bg-white border-black/5'
        }`}
      >
        {/* Card Header Banner (soft purple banner matching sample) */}
        <div
          onClick={() => onOpenDayDetail(date)}
          className={`px-3 py-1.5 flex items-center justify-between shrink-0 cursor-pointer select-none transition-colors ${
            isDarkMode
              ? 'bg-[#5e275e] hover:bg-[#6e306e] text-white'
              : 'bg-[#d58fd5] hover:bg-[#cf83cf]'
          }`}
          title={`Click to view full schedule for ${dayName}`}
        >
          {/* Day Name on Left */}
          <span
            className={`font-extrabold text-[15px] sm:text-base tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {dayName}
          </span>

          {/* Date on Right (e.g. "Oct 26") */}
          <span
            className={`font-bold text-[15px] sm:text-base tracking-tight ${
              isDarkMode ? 'text-[#e9a9ea]' : 'text-[#6d1b6d]'
            }`}
          >
            {dateLabel}
          </span>
        </div>

        {/* Card Interior: Ruled Lined Notebook Paper */}
        <div className="flex-1 flex flex-col justify-between py-0.5 min-h-0">
          {Array.from({ length: lineCount }).map((_, idx) => {
            const item = dayItems[idx];
            const isEditing = activeEditingDay === dateKey && editingLineIndex === idx;

            return (
              <div
                key={idx}
                className={`relative flex items-center px-2.5 flex-1 min-h-[25px] border-b transition-colors group cursor-text ${
                  isDarkMode
                    ? 'border-[#3a2542] hover:bg-white/5'
                    : 'border-[#ebd7ed] hover:bg-purple-50/40'
                }`}
                onClick={() => {
                  if (!isEditing && !item) {
                    handleStartEditing(dateKey, idx);
                  }
                }}
              >
                {isEditing ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCommitLine(dateKey);
                    }}
                    className="w-full flex items-center gap-1.5"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Write note or task..."
                      value={lineText}
                      onChange={(e) => setLineText(e.target.value)}
                      onBlur={() => handleCommitLine(dateKey)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setActiveEditingDay(null);
                          setEditingLineIndex(null);
                        }
                      }}
                      className={`w-full bg-transparent text-xs sm:text-[13px] font-medium focus:outline-none border-b ${
                        isDarkMode
                          ? 'text-white border-purple-400 placeholder:text-slate-500'
                          : 'text-slate-900 border-[#ad1ca8] placeholder:text-slate-400'
                      }`}
                    />
                  </form>
                ) : item ? (
                  <div className="w-full flex items-center justify-between gap-1 select-none">
                    {/* Left: Checkbox circle + Text */}
                    <div
                      className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer"
                      onClick={() => {
                        playCompleteSound();
                        triggerHaptic();
                        onToggleItem(item.id);
                      }}
                    >
                      {/* Checkbox button */}
                      <button
                        type="button"
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          item.completed
                            ? 'bg-[#ad1ca8] border-[#ad1ca8] text-white'
                            : isDarkMode
                            ? 'border-purple-400/60 hover:border-purple-300'
                            : 'border-purple-400/80 hover:border-[#ad1ca8]'
                        }`}
                        title={item.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {item.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </button>

                      {/* Text on the ruled line */}
                      <span
                        className={`text-xs sm:text-[13px] truncate font-medium ${
                          item.completed
                            ? 'line-through text-slate-400/70 italic'
                            : isDarkMode
                            ? 'text-slate-100'
                            : 'text-slate-800'
                        }`}
                        title={item.title}
                      >
                        {item.startTime ? (
                          <span className="font-semibold text-[#ad1ca8] mr-1 text-[11px]">
                            {item.startTime}
                          </span>
                        ) : null}
                        {item.title}
                      </span>
                    </div>

                    {/* Action buttons on hover: Edit / Delete */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem(item);
                        }}
                        className="p-0.5 text-slate-400 hover:text-purple-600 rounded transition"
                        title="Edit details"
                      >
                        <span className="text-[11px]">✎</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          onDeleteItem(item.id);
                        }}
                        className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition"
                        title="Delete line"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty ruled line with subtle hint on hover */
                  <div className="w-full h-full flex items-center text-transparent hover:text-purple-400/60 transition-colors">
                    <span className="text-[11px] font-normal flex items-center gap-1">
                      <Plus className="w-2.5 h-2.5" /> tap to write
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex-1 p-1.5 sm:p-2.5 overflow-y-auto flex flex-col min-h-0">
      {/* 2-Column Grid stretching across the full screen */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 flex-1 min-h-0 w-full items-stretch">
        {/* Column 1: Monday, Wednesday, Friday */}
        <div className="flex flex-col gap-1.5 sm:gap-2.5 h-full min-h-0 flex-1">
          {renderDayCard(monday, false)}
          {renderDayCard(wednesday, false)}
          {renderDayCard(friday, false)}
        </div>

        {/* Column 2: Tuesday, Thursday, Saturday & Sunday */}
        <div className="flex flex-col gap-1.5 sm:gap-2.5 h-full min-h-0 flex-1">
          {renderDayCard(tuesday, false)}
          {renderDayCard(thursday, false)}

          {/* Saturday & Sunday split into two half cards */}
          {renderDayCard(saturday, true)}
          {renderDayCard(sunday, true)}
        </div>
      </div>
    </div>
  );
};
