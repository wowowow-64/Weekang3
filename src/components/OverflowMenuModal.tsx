import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Trash2, 
  RefreshCw, 
  Printer, 
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface OverflowMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSampleWeek: () => void;
  onJumpToToday: () => void;
  onClearWeek: () => void;
  onResetSampleData: () => void;
  isDarkMode?: boolean;
}

export const OverflowMenuModal: React.FC<OverflowMenuModalProps> = ({
  isOpen,
  onClose,
  onJumpToSampleWeek,
  onJumpToToday,
  onClearWeek,
  onResetSampleData,
  isDarkMode = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-14 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className={`w-64 rounded-2xl p-2 shadow-2xl border transition-all animate-in zoom-in-95 duration-150 select-none ${
          isDarkMode
            ? 'bg-[#2b1733] border-purple-900/50 text-white'
            : 'bg-white border-purple-100 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-xs font-semibold space-y-0.5">
          {/* Jump to Sample Week (Oct 26 - Nov 1, 2026) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onJumpToSampleWeek();
              onClose();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-left transition font-bold ${
              isDarkMode ? 'hover:bg-purple-900/50 text-[#e9a9ea]' : 'hover:bg-purple-50 text-[#ad1ca8]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ad1ca8]" />
            <div>
              <span>Sample Week (Oct 26, 2026)</span>
              <p className="text-[10px] font-normal opacity-70">Matches sample screenshot</p>
            </div>
          </button>

          {/* Jump to Today */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onJumpToToday();
              onClose();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-left transition ${
              isDarkMode ? 'hover:bg-purple-900/40 text-purple-100' : 'hover:bg-purple-50 text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>Go to Today</span>
          </button>

          <div className="h-px bg-purple-500/15 my-1" />

          {/* Print / Export */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              window.print();
              onClose();
            }}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 text-left transition ${
              isDarkMode ? 'hover:bg-purple-900/40 text-purple-100' : 'hover:bg-purple-50 text-slate-700'
            }`}
          >
            <Printer className="w-4 h-4 text-purple-500" />
            <span>Print Weekly Planner</span>
          </button>

          <div className="h-px bg-purple-500/15 my-1" />

          {/* Clear This Week */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all tasks and notes for this week?')) {
                playClickSound();
                onClearWeek();
                onClose();
              }
            }}
            className="w-full px-3 py-2 rounded-xl flex items-center gap-2.5 text-left text-rose-500 hover:bg-rose-50 transition"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Clear This Week</span>
          </button>

          {/* Reset All Sample Data */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset planner back to fresh sample data?')) {
                playClickSound();
                onResetSampleData();
                onClose();
              }
            }}
            className={`w-full px-3 py-2 rounded-xl flex items-center gap-2.5 text-left transition ${
              isDarkMode ? 'hover:bg-purple-900/40 text-purple-200' : 'hover:bg-purple-50 text-slate-600'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-purple-400" />
            <span>Restore Default Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
