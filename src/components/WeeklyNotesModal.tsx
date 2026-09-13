import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import { playClickSound, playCompleteSound } from '../utils/audio';
import { WeeklyGoal } from '../types';
import { formatDateKey } from '../utils/dateUtils';

interface WeeklyNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeekStart: Date;
  goals: WeeklyGoal[];
  onToggleGoal: (id: string) => void;
  onAddGoal: (title: string) => void;
  onDeleteGoal: (id: string) => void;
  isDarkMode?: boolean;
}

export const WeeklyNotesModal: React.FC<WeeklyNotesModalProps> = ({
  isOpen,
  onClose,
  currentWeekStart,
  goals,
  onToggleGoal,
  onAddGoal,
  onDeleteGoal,
  isDarkMode = false,
}) => {
  const weekKey = formatDateKey(currentWeekStart);
  const storageKey = `weekly_scratchpad_${weekKey}`;

  const [scratchpadText, setScratchpadText] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey) || '';
    }
    return '';
  });

  const [newGoalTitle, setNewGoalTitle] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      setScratchpadText(saved || '');
    }
  }, [storageKey]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setScratchpadText(val);
    localStorage.setItem(storageKey, val);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim()) {
      playClickSound();
      onAddGoal(newGoalTitle.trim());
      setNewGoalTitle('');
    }
  };

  if (!isOpen) return null;

  const currentGoals = goals.filter((g) => g.weekStart === weekKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-3xl p-5 shadow-2xl border transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] ${
          isDarkMode
            ? 'bg-[#291730] border-purple-900/50 text-white'
            : 'bg-white border-purple-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
          <div>
            <h3 className="text-sm font-extrabold tracking-tight">Weekly Focus & Scratchpad</h3>
            <p className="text-[11px] opacity-70">Priorities, ideas, and notes for the week</p>
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

        <div className="flex-1 overflow-y-auto pt-3 space-y-4 pr-1">
          {/* Section 1: Weekly Big Rocks / Goals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ad1ca8]">
                Key Objectives
              </span>
              <span className="text-[11px] opacity-60">
                {currentGoals.filter((g) => g.completed).length}/{currentGoals.length}
              </span>
            </div>

            <div className="space-y-1.5 mb-2">
              {currentGoals.length === 0 ? (
                <p className="text-xs italic opacity-60 py-1">No weekly objectives added yet.</p>
              ) : (
                currentGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs border transition ${
                      isDarkMode
                        ? 'bg-[#371f40] border-purple-900/40'
                        : 'bg-purple-50/60 border-purple-100'
                    }`}
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                      onClick={() => {
                        playCompleteSound();
                        onToggleGoal(goal.id);
                      }}
                    >
                      <button
                        type="button"
                        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                          goal.completed
                            ? 'bg-[#ad1ca8] border-[#ad1ca8] text-white'
                            : 'border-purple-400'
                        }`}
                      >
                        {goal.completed && <CheckSquare className="w-3 h-3" />}
                      </button>
                      <span
                        className={`truncate font-medium ${
                          goal.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {goal.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onDeleteGoal(goal.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Goal Input */}
            <form onSubmit={handleCreateGoal} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Add weekly target..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className={`flex-1 px-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#331c3b] border-purple-800 text-white placeholder:text-slate-500'
                    : 'bg-white border-purple-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-xl bg-[#ad1ca8] text-white text-xs font-bold hover:bg-[#921433] transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Section 2: Freeform Lined Scratchpad */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ad1ca8] flex items-center gap-1">
                <Edit2 className="w-3 h-3" /> Freeform Notes
              </span>
              <span className="text-[10px] opacity-60">Auto-saved</span>
            </div>
            <textarea
              rows={6}
              value={scratchpadText}
              onChange={handleTextChange}
              placeholder="Jot down quick thoughts, phone numbers, ideas, or reminders for this week..."
              className={`w-full p-3 rounded-2xl text-xs font-mono leading-relaxed border resize-none focus:outline-none transition ${
                isDarkMode
                  ? 'bg-[#221328] border-purple-900 text-purple-100 placeholder:text-slate-600'
                  : 'bg-[#faf4fb] border-purple-200 text-slate-800 placeholder:text-slate-400'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
