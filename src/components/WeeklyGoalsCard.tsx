import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { WeeklyGoal } from '../types';
import { playCompleteSound, playClickSound, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface WeeklyGoalsCardProps {
  goals: WeeklyGoal[];
  onToggleGoal: (id: string) => void;
  onAddGoal: (title: string) => void;
  onDeleteGoal: (id: string) => void;
}

export const WeeklyGoalsCard: React.FC<WeeklyGoalsCardProps> = ({
  goals,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    playClickSound();
    onAddGoal(newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  const handleToggle = (goal: WeeklyGoal) => {
    triggerHaptic();
    if (!goal.completed) {
      playCompleteSound();
      if (completedCount + 1 === totalCount) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } else {
      playClickSound();
    }
    onToggleGoal(goal.id);
  };

  return (
    <div className="mx-4 mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 text-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Weekly Focus & Big Rocks
            </h2>
            <p className="text-[11px] text-slate-400">
              {completedCount} of {totalCount} completed ({percent}%)
            </p>
          </div>
        </div>

        {!isAdding && totalCount < 4 && (
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsAdding(true);
            }}
            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900/60 border border-indigo-700/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Goal
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2.5 overflow-hidden">
        <div
          className="bg-indigo-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Goals List */}
      <div className="space-y-1.5">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-indigo-950/40 transition group"
          >
            <button
              type="button"
              onClick={() => handleToggle(goal)}
              className="flex items-center gap-2 flex-1 text-left min-w-0"
            >
              {goal.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500 hover:text-indigo-400 shrink-0 transition" />
              )}
              <span
                className={`text-xs truncate ${
                  goal.completed ? 'line-through text-slate-500' : 'text-slate-200'
                }`}
              >
                {goal.title}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onDeleteGoal(goal.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
              title="Delete goal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {goals.length === 0 && !isAdding && (
          <p className="text-xs text-slate-500 py-1 text-center italic">
            No focus goals set for this week yet.
          </p>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-1.5">
            <input
              type="text"
              placeholder="e.g. Finish client proposal..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-xs text-white border border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2 py-1.5 text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
