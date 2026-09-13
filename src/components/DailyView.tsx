import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  MoreVertical, 
  ArrowRight, 
  Trash2, 
  Edit3, 
  CalendarDays,
  ListTodo,
  Bell,
  Sparkles
} from 'lucide-react';
import { PlannerItem } from '../types';
import { formatDayHeader, formatTime12h, formatDateKey } from '../utils/dateUtils';
import { playCompleteSound, playClickSound, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DailyViewProps {
  selectedDate: Date;
  items: PlannerItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: PlannerItem) => void;
  onMoveToNextDay: (id: string) => void;
  onOpenNewModal: (presetDate?: string, presetTime?: string) => void;
  onQuickAdd: (title: string, date: string) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  work: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  personal: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  fitness: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  study: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  errand: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  health: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
};

const PRIORITY_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  urgent: { label: 'Urgent', bg: 'bg-rose-500/20', text: 'text-rose-400' },
  high: { label: 'High', bg: 'bg-orange-500/20', text: 'text-orange-400' },
  medium: { label: 'Med', bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  low: { label: 'Low', bg: 'bg-slate-800', text: 'text-slate-400' },
};

export const DailyView: React.FC<DailyViewProps> = ({
  selectedDate,
  items,
  onToggleItem,
  onDeleteItem,
  onEditItem,
  onMoveToNextDay,
  onOpenNewModal,
  onQuickAdd,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [quickTitle, setQuickTitle] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { dayName, fullDate } = formatDayHeader(selectedDate);
  const selectedDateKey = formatDateKey(selectedDate);

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleToggle = (item: PlannerItem) => {
    triggerHaptic();
    if (!item.completed) {
      playCompleteSound();
      if (completedCount + 1 === totalCount) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      playClickSound();
    }
    onToggleItem(item.id);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    playClickSound();
    onQuickAdd(quickTitle.trim(), selectedDateKey);
    setQuickTitle('');
  };

  // Split into timed and all-day/anytime
  const timedItems = items
    .filter((i) => !i.isAllDay && i.startTime)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  const allDayItems = items.filter((i) => i.isAllDay || !i.startTime);

  // Hours for timeline: 7 AM to 10 PM
  const hours = Array.from({ length: 15 }, (_, i) => i + 7);

  return (
    <div className="flex-1 pb-24 text-slate-200">
      {/* Daily Header */}
      <div className="px-4 pt-3 pb-2 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">{dayName}</h2>
          <p className="text-xs text-slate-400 font-medium">{fullDate}</p>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-800/90 border border-slate-700/50">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setViewMode('timeline');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'timeline'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Timeline
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setViewMode('list');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            Tasks ({totalCount})
          </button>
        </div>
      </div>

      {/* Progress pill if items exist */}
      {totalCount > 0 && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300">
              {completedCount} of {totalCount} completed
            </span>
            {completedCount === totalCount && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3 h-3" /> All done!
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-indigo-400">{progressPercent}%</span>
        </div>
      )}

      {/* Quick Add Inline */}
      <form onSubmit={handleQuickAddSubmit} className="mx-4 mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Quick add task for this day..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-800/80 text-xs text-white placeholder:text-slate-500 border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {quickTitle && (
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenNewModal(selectedDateKey);
          }}
          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          Event
        </button>
      </form>

      {/* Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="px-4 space-y-3">
          {/* All-Day / Anytime section */}
          {allDayItems.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 mb-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                All-Day & Anytime Tasks ({allDayItems.length})
              </div>
              <div className="space-y-2">
                {allDayItems.map((item) => (
                  <TaskCard
                    key={item.id}
                    item={item}
                    onToggle={() => handleToggle(item)}
                    onEdit={() => onEditItem(item)}
                    onDelete={() => onDeleteItem(item.id)}
                    onMove={() => onMoveToNextDay(item.id)}
                    isMenuOpen={activeMenuId === item.id}
                    onToggleMenu={() =>
                      setActiveMenuId(activeMenuId === item.id ? null : item.id)
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Hourly Timeline */}
          <div className="relative border-l-2 border-slate-800 ml-8 pl-4 space-y-4">
            {hours.map((hour) => {
              const hourString = `${String(hour).padStart(2, '0')}:00`;
              const displayHour = formatTime12h(hourString);
              const itemsInThisHour = timedItems.filter((i) => {
                if (!i.startTime) return false;
                const itemHour = parseInt(i.startTime.split(':')[0], 10);
                return itemHour === hour;
              });

              return (
                <div key={hour} className="relative min-h-[44px] group">
                  {/* Time label on the left */}
                  <span className="absolute -left-[54px] top-0 text-[10px] font-semibold text-slate-400">
                    {displayHour}
                  </span>

                  {/* Hour node indicator */}
                  <div
                    onClick={() => {
                      playClickSound();
                      onOpenNewModal(selectedDateKey, hourString);
                    }}
                    className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition cursor-pointer"
                    title={`Add event at ${displayHour}`}
                  />

                  {/* Hour content */}
                  {itemsInThisHour.length > 0 ? (
                    <div className="space-y-2 pt-0.5">
                      {itemsInThisHour.map((item) => (
                        <TaskCard
                          key={item.id}
                          item={item}
                          onToggle={() => handleToggle(item)}
                          onEdit={() => onEditItem(item)}
                          onDelete={() => onDeleteItem(item.id)}
                          onMove={() => onMoveToNextDay(item.id)}
                          isMenuOpen={activeMenuId === item.id}
                          onToggleMenu={() =>
                            setActiveMenuId(activeMenuId === item.id ? null : item.id)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        playClickSound();
                        onOpenNewModal(selectedDateKey, hourString);
                      }}
                      className="h-7 border border-dashed border-slate-800/80 rounded-xl hover:border-slate-700 hover:bg-slate-800/20 transition flex items-center px-3 cursor-pointer group"
                    >
                      <span className="text-[11px] text-slate-400 group-hover:text-indigo-300 transition">
                        + Schedule at {displayHour}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List / Category View */
        <div className="px-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <CalendarDays className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-400">No tasks for this day</p>
              <p className="text-xs text-slate-600 mt-1">Tap + to add events or focus items</p>
            </div>
          ) : (
            items.map((item) => (
              <TaskCard
                key={item.id}
                item={item}
                onToggle={() => handleToggle(item)}
                onEdit={() => onEditItem(item)}
                onDelete={() => onDeleteItem(item.id)}
                onMove={() => onMoveToNextDay(item.id)}
                isMenuOpen={activeMenuId === item.id}
                onToggleMenu={() =>
                  setActiveMenuId(activeMenuId === item.id ? null : item.id)
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  item: PlannerItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  item,
  onToggle,
  onEdit,
  onDelete,
  onMove,
  isMenuOpen,
  onToggleMenu,
}) => {
  const catStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.personal;
  const prioStyle = PRIORITY_BADGES[item.priority] || PRIORITY_BADGES.medium;

  return (
    <div
      className={`relative p-3 rounded-2xl transition border ${
        item.completed
          ? 'bg-slate-900/60 border-slate-800/80 opacity-70'
          : 'bg-slate-800/90 border-slate-700/60 hover:border-slate-600 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5">
        {/* Checkbox button */}
        <button
          type="button"
          onClick={onToggle}
          className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition"
        >
          {item.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 hover:text-indigo-400 transition" />
          )}
        </button>

        {/* Content Details */}
        <div className="flex-1 min-w-0" onClick={onEdit}>
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {/* Category tag */}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {item.category}
            </span>

            {/* Priority tag */}
            {item.priority !== 'low' && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${prioStyle.bg} ${prioStyle.text}`}
              >
                {prioStyle.label}
              </span>
            )}

            {/* Time badge */}
            {item.startTime && (
              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 bg-slate-900/60 px-1.5 py-0.5 rounded-md">
                <Clock className="w-3 h-3 text-indigo-400" />
                {formatTime12h(item.startTime)}
                {item.endTime ? ` – ${formatTime12h(item.endTime)}` : ''}
              </span>
            )}

            {item.reminder && (
              <span className="text-indigo-400" title="Reminder set">
                <Bell className="w-3 h-3" />
              </span>
            )}
          </div>

          <h3
            className={`text-sm font-semibold leading-snug break-words ${
              item.completed ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {item.title}
          </h3>

          {item.notes && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {item.notes}
            </p>
          )}
        </div>

        {/* Menu button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              onToggleMenu();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-7 z-20 w-36 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 text-xs text-slate-200">
              <button
                type="button"
                onClick={() => {
                  onToggleMenu();
                  onEdit();
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleMenu();
                  onMove();
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left"
              >
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                Move to Next Day
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleMenu();
                  onDelete();
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-rose-400 text-left"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
