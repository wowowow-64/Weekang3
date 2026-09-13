import React, { useState, useMemo } from 'react';
import { X, Search, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { PlannerItem } from '../types';
import { playClickSound, playCompleteSound } from '../utils/audio';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PlannerItem[];
  onToggleItem: (id: string) => void;
  onSelectDate: (date: Date) => void;
  isDarkMode?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onSelectDate,
  isDarkMode = false,
}) => {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
    );
  }, [items, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm rounded-3xl p-4 shadow-2xl border transition-all animate-in zoom-in-95 duration-200 ${
          isDarkMode
            ? 'bg-[#291730] border-purple-900/50 text-white'
            : 'bg-white border-purple-100 text-slate-900'
        }`}
      >
        {/* Search Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-purple-500/20">
          <Search className="w-4 h-4 text-[#ad1ca8]" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks, notes, meetings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs p-1 opacity-60 hover:opacity-100"
            >
              Clear
            </button>
          )}
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

        {/* Search Results List */}
        <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-xs opacity-60">
              Type to search any task or note in your weekly planner
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-6 text-center text-xs opacity-60">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item) => {
              const [y, m, d] = item.date.split('-').map(Number);
              const itemDate = new Date(y, m - 1, d);
              const dateStr = itemDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#371f40] border-purple-900/40 hover:border-purple-500/50'
                      : 'bg-purple-50/50 border-purple-100 hover:border-purple-300'
                  }`}
                  onClick={() => {
                    playClickSound();
                    onSelectDate(itemDate);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playCompleteSound();
                        onToggleItem(item.id);
                      }}
                      className="text-[#ad1ca8] shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 fill-[#ad1ca8] text-white" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          item.completed ? 'line-through opacity-60 italic' : ''
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-[10px] opacity-65 flex items-center gap-1">
                        <Calendar className="w-3 h-3 inline" />
                        {dateStr}
                        {item.startTime ? ` • ${item.startTime}` : ''}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#ad1ca8] font-bold shrink-0">
                    Jump →
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
