import React from 'react';
import { Search, Moon, Sun, LayoutGrid, FileText, MoreVertical, Calendar } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface AndroidTopBarProps {
  currentWeekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  todayDate: Date;
  onOpenDatePicker: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  viewMode: 'grid' | 'daily';
  onToggleViewMode: () => void;
  onOpenNotes: () => void;
  onOpenMenu: () => void;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  currentWeekStart,
  onPrevWeek,
  onNextWeek,
  onToday,
  todayDate,
  onOpenDatePicker,
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode,
  viewMode,
  onToggleViewMode,
  onOpenNotes,
  onOpenMenu,
}) => {
  const currentYear = currentWeekStart.getFullYear();
  const todayMonth = todayDate.toLocaleDateString('en-US', { month: 'short' });
  const todayDay = todayDate.getDate();

  return (
    <header
      className={`w-full px-2.5 pt-1.5 pb-2 flex items-center justify-between text-white select-none z-30 transition-colors shadow-sm ${
        isDarkMode ? 'bg-[#500c4e]' : 'bg-[#ad1ca8]'
      }`}
    >
      {/* Left section: The Burgundy "< Sep 13" Pill & Year Calendar */}
      <div className="flex items-center gap-2">
        {/* Maroon Pill: "< Sep 13" */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onPrevWeek();
            }}
            className="h-9 px-2.5 rounded-full bg-[#7a0f28] hover:bg-[#921433] active:scale-95 transition-all text-white flex items-center gap-1 shadow-inner border border-black/10"
            title="Previous Week (Click Sep 13 to jump to Today)"
          >
            {/* White back chevron */}
            <svg className="w-3.5 h-3.5 stroke-[3] stroke-white fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>

            {/* Stacked "Sep" over "13" */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                onToday();
              }}
              className="flex flex-col items-center justify-center leading-none px-0.5"
              title="Jump to Today"
            >
              <span className="text-[9px] font-medium tracking-wide uppercase opacity-90">{todayMonth}</span>
              <span className="text-[12px] font-extrabold tracking-tight">{todayDay}</span>
            </div>
          </button>

          {/* Quick next week chevron */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onNextWeek();
            }}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/90 transition"
            title="Next Week"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5] stroke-white fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stacked Calendar Icon with Year ("2026") */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenDatePicker();
          }}
          className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-white/10 active:scale-95 transition text-white"
          title="Pick Month / Jump to Year"
        >
          <Calendar className="w-4 h-4 stroke-[2]" />
          <span className="text-[10px] font-extrabold leading-none mt-0.5 tracking-tight">
            {currentYear}
          </span>
        </button>
      </div>

      {/* Middle & Right section: Search, Moon, Grid, Note, Title, Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Search Icon */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenSearch();
          }}
          className="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition text-white"
          title="Search Planner"
          aria-label="Search"
        >
          <Search className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Moon / Night mode icon */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onToggleDarkMode();
          }}
          className="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition text-white"
          title={isDarkMode ? 'Switch to Lilac Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 stroke-[2.2]" /> : <Moon className="w-4 h-4 stroke-[2.2]" />}
        </button>

        {/* 4-Squares Grid icon */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onToggleViewMode();
          }}
          className={`p-1 rounded-lg hover:bg-white/10 active:scale-95 transition text-white ${
            viewMode === 'grid' ? 'text-white' : 'text-white/75'
          }`}
          title={viewMode === 'grid' ? 'Switch to Daily View' : 'Switch to 2-Column Lined Grid'}
          aria-label="Toggle layout"
        >
          <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Folded Document / Note icon */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenNotes();
          }}
          className="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition text-white"
          title="Weekly Scratchpad & Goals"
          aria-label="Weekly Notes"
        >
          <FileText className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Two-line Title: "Weekly" / "Planner" */}
        <div className="flex flex-col text-left leading-none pl-0.5 select-none">
          <span className="text-[11px] font-bold tracking-tight text-white/95">Weekly</span>
          <span className="text-[11px] font-bold tracking-tight text-white">Planner</span>
        </div>

        {/* Overflow Menu (3 vertical dots) */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenMenu();
          }}
          className="p-1 rounded-lg hover:bg-white/10 active:scale-95 transition text-white"
          title="Planner Settings & Options"
          aria-label="Menu"
        >
          <MoreVertical className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </header>
  );
};
