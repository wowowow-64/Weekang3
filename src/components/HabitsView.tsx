import React, { useState } from 'react';
import { 
  Plus, 
  Flame, 
  Check, 
  Trash2, 
  Dumbbell, 
  Droplets, 
  BookOpen, 
  Moon, 
  Sparkles, 
  Heart,
  Smile,
  Zap
} from 'lucide-react';
import { Habit } from '../types';
import { formatDateKey, isSameDay } from '../utils/dateUtils';
import { playCompleteSound, playClickSound, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface HabitsViewProps {
  habits: Habit[];
  weekDays: Date[];
  onToggleHabitDay: (habitId: string, dateKey: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  onDeleteHabit: (habitId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Droplets: <Droplets className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Moon: <Moon className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Smile: <Smile className="w-4 h-4" />,
};

const COLOR_OPTIONS = [
  { name: 'Indigo', class: 'bg-indigo-600' },
  { name: 'Emerald', class: 'bg-emerald-600' },
  { name: 'Cyan', class: 'bg-cyan-600' },
  { name: 'Purple', class: 'bg-purple-600' },
  { name: 'Amber', class: 'bg-amber-600' },
  { name: 'Rose', class: 'bg-rose-600' },
];

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  weekDays,
  onToggleHabitDay,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sparkles');
  const [selectedColor, setSelectedColor] = useState('bg-indigo-600');
  const [targetDays, setTargetDays] = useState(5);

  const todayKey = formatDateKey(new Date());

  const handleToggle = (habit: Habit, dateKey: string) => {
    triggerHaptic();
    const isCompleted = habit.completedDates.includes(dateKey);
    if (!isCompleted) {
      playCompleteSound();
      // Check if this hit the target
      const currentWeekKeys = weekDays.map(formatDateKey);
      const weekCompletedCount = habit.completedDates.filter((k) => currentWeekKeys.includes(k)).length + 1;
      if (weekCompletedCount === habit.targetDays) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } else {
      playClickSound();
    }
    onToggleHabitDay(habit.id, dateKey);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playClickSound();
    onAddHabit({
      name: name.trim(),
      iconName: selectedIcon,
      color: selectedColor,
      targetDays: Number(targetDays),
    });
    setName('');
    setIsAdding(false);
  };

  return (
    <div className="flex-1 px-4 py-3 pb-24 text-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            Weekly Habits & Routines
            <Flame className="w-4 h-4 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-400">Consistency tracker for this week</p>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          New Habit
        </button>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateSubmit}
          className="mb-4 p-3.5 rounded-2xl bg-slate-800/95 border border-indigo-500/40 shadow-lg space-y-3"
        >
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Create New Habit</h3>

          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">Habit Name</label>
            <input
              type="text"
              placeholder="e.g. Read 20 pages, Hydrate, Yoga"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 text-xs text-white border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-4">
            {/* Icon picker */}
            <div className="flex-1">
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(ICON_MAP).map((iconKey) => (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setSelectedIcon(iconKey)}
                    className={`p-1.5 rounded-lg border transition ${
                      selectedIcon === iconKey
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {ICON_MAP[iconKey]}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Days */}
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">
                Goal (days/wk)
              </label>
              <select
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 text-xs text-white border border-slate-700"
              >
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <option key={num} value={num}>
                    {num} days
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-[11px] text-slate-400 font-medium mb-1">Accent Color</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.class}
                  type="button"
                  onClick={() => setSelectedColor(c.class)}
                  className={`w-6 h-6 rounded-full ${c.class} transition ${
                    selectedColor === c.class ? 'ring-2 ring-white scale-110' : 'opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Add Habit
            </button>
          </div>
        </form>
      )}

      {/* Habits Matrix List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const currentWeekKeys = weekDays.map(formatDateKey);
          const weekCompletedCount = habit.completedDates.filter((k) =>
            currentWeekKeys.includes(k)
          ).length;
          const targetMet = weekCompletedCount >= habit.targetDays;

          return (
            <div
              key={habit.id}
              className="p-3.5 rounded-2xl bg-slate-800/85 border border-slate-700/60 shadow-sm"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl ${habit.color} text-white shadow-sm`}>
                    {ICON_MAP[habit.iconName] || <Sparkles className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{habit.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      {weekCompletedCount} of {habit.targetDays} days
                      {targetMet && (
                        <span className="ml-1.5 text-emerald-400 font-semibold">★ Goal Met</span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onDeleteHabit(habit.id);
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                  title="Delete habit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 7-Day Matrix Checkboard */}
              <div className="grid grid-cols-7 gap-1.5 pt-1">
                {weekDays.map((date) => {
                  const dateKey = formatDateKey(date);
                  const isToday = isSameDay(date, new Date());
                  const isDone = habit.completedDates.includes(dateKey);
                  const dayLetter = date.toLocaleDateString('en-US', { weekday: 'narrow' });

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => handleToggle(habit, dateKey)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition border ${
                        isDone
                          ? `${habit.color} text-white border-transparent shadow-sm scale-[1.02]`
                          : isToday
                          ? 'bg-slate-900 border-indigo-500/50 text-slate-300 hover:border-indigo-400'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-semibold mb-0.5 opacity-80">
                        {dayLetter}
                      </span>
                      <div className="w-4 h-4 flex items-center justify-center">
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <span className="text-[10px] font-medium">{date.getDate()}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
