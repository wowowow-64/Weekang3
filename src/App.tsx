/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { PlannerItem, Habit, WeeklyGoal } from './types';
import { 
  getStartOfWeek, 
  getWeekDays, 
  formatDateKey, 
} from './utils/dateUtils';
import { 
  getInitialPlannerItems, 
  getInitialWeeklyGoals, 
  getInitialHabits 
} from './utils/sampleData';
import { AndroidTopBar } from './components/AndroidTopBar';
import { WeeklyLinedGridView } from './components/WeeklyLinedGridView';
import { DailyView } from './components/DailyView';
import { DatePickerModal } from './components/DatePickerModal';
import { SearchModal } from './components/SearchModal';
import { WeeklyNotesModal } from './components/WeeklyNotesModal';
import { OverflowMenuModal } from './components/OverflowMenuModal';
import { TaskModal } from './components/TaskModal';

const STORAGE_KEYS = {
  ITEMS: 'android_planner_items_v2',
  GOALS: 'android_planner_goals_v2',
  HABITS: 'android_planner_habits_v2',
  DARK_MODE: 'android_planner_dark_mode_v2',
};

// Target sample date from user's screenshot: Monday, Oct 26, 2026
const SAMPLE_WEEK_DATE = new Date(2026, 9, 26);
// Today's date from environment metadata: Sep 13, 2026
const TODAY_DATE = new Date(2026, 8, 13);

export default function App() {
  // Navigation & Date State
  // Default to the week shown in the sample image: Oct 26, 2026
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getStartOfWeek(SAMPLE_WEEK_DATE, true)
  );
  const [selectedDayDate, setSelectedDayDate] = useState<Date>(() => SAMPLE_WEEK_DATE);

  // View Mode: 'grid' (2-column lined notebook matching sample) or 'daily' (timeline focus)
  const [viewMode, setViewMode] = useState<'grid' | 'daily'>('grid');

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return saved === 'true';
    }
    return false;
  });

  // Modals state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlannerItem | null>(null);
  const [modalPresetDate, setModalPresetDate] = useState<string | undefined>(undefined);

  // Planner items persistence
  const [items, setItems] = useState<PlannerItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // Fallback
        }
      }
    }
    // Seed sample week (Oct 26) as well as today's week
    const sampleItems = getInitialPlannerItems(SAMPLE_WEEK_DATE);
    const todayItems = getInitialPlannerItems(TODAY_DATE);
    return [...sampleItems, ...todayItems];
  });

  const [goals, setGoals] = useState<WeeklyGoal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback
        }
      }
    }
    return [...getInitialWeeklyGoals(SAMPLE_WEEK_DATE), ...getInitialWeeklyGoals(TODAY_DATE)];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback
        }
      }
    }
    return getInitialHabits(SAMPLE_WEEK_DATE);
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDarkMode));
  }, [isDarkMode]);

  // Compute 7 days of the active week
  const weekDays = useMemo(() => {
    return getWeekDays(currentWeekStart, true);
  }, [currentWeekStart]);

  // Navigation Handlers
  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(prev);
    setSelectedDayDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(next);
    setSelectedDayDate(next);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentWeekStart(getStartOfWeek(today, true));
    setSelectedDayDate(today);
  };

  const handleJumpToSampleWeek = () => {
    setCurrentWeekStart(getStartOfWeek(SAMPLE_WEEK_DATE, true));
    setSelectedDayDate(SAMPLE_WEEK_DATE);
    setViewMode('grid');
  };

  const handleSelectDate = (date: Date) => {
    setCurrentWeekStart(getStartOfWeek(date, true));
    setSelectedDayDate(date);
  };

  // Task & Line Operations
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveQuickLine = (dateKey: string, text: string) => {
    const newItem: PlannerItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: text,
      date: dateKey,
      isAllDay: true,
      category: 'work',
      priority: 'medium',
      completed: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleEditItem = (item: PlannerItem) => {
    setEditingItem(item);
    setModalPresetDate(item.date);
    setIsTaskModalOpen(true);
  };

  const handleSaveModalItem = (itemData: Partial<PlannerItem>) => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? ({ ...i, ...itemData } as PlannerItem) : i))
      );
    } else {
      const newItem: PlannerItem = {
        id: `item-${Date.now()}`,
        title: itemData.title || 'Untitled Task',
        notes: itemData.notes || '',
        date: itemData.date || formatDateKey(selectedDayDate),
        isAllDay: itemData.isAllDay ?? true,
        startTime: itemData.startTime,
        endTime: itemData.endTime,
        category: itemData.category || 'work',
        priority: itemData.priority || 'medium',
        completed: false,
        createdAt: Date.now(),
      };
      setItems((prev) => [...prev, newItem]);
    }
    setIsTaskModalOpen(false);
    setEditingItem(null);
  };

  const handleClearWeek = () => {
    const weekDateKeys = weekDays.map((d) => formatDateKey(d));
    setItems((prev) => prev.filter((i) => !weekDateKeys.includes(i.date)));
  };

  const handleResetSampleData = () => {
    const freshSample = getInitialPlannerItems(SAMPLE_WEEK_DATE);
    const freshToday = getInitialPlannerItems(TODAY_DATE);
    setItems([...freshSample, ...freshToday]);
    setGoals([...getInitialWeeklyGoals(SAMPLE_WEEK_DATE), ...getInitialWeeklyGoals(TODAY_DATE)]);
    setHabits(getInitialHabits(SAMPLE_WEEK_DATE));
    setCurrentWeekStart(getStartOfWeek(SAMPLE_WEEK_DATE, true));
    setSelectedDayDate(SAMPLE_WEEK_DATE);
  };

  // Goals operations
  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleAddGoal = (title: string) => {
    const newGoal: WeeklyGoal = {
      id: `goal-${Date.now()}`,
      weekStart: formatDateKey(currentWeekStart),
      title,
      completed: false,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div
      className={`w-full h-screen h-[100dvh] flex flex-col overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#1e1324]' : 'bg-[#ebd3f0]'
      }`}
    >
      {/* Top App Bar with "< Sep 13" pill, 2026 calendar, search, moon, grid, note, title, menu */}
      <AndroidTopBar
        currentWeekStart={currentWeekStart}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        todayDate={TODAY_DATE}
        onOpenDatePicker={() => setIsDatePickerOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'grid' ? 'daily' : 'grid')}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        {viewMode === 'grid' ? (
          /* The 2-Column Lined Paper Notebook Grid matching sample image */
          <WeeklyLinedGridView
            weekDays={weekDays}
            items={items}
            isDarkMode={isDarkMode}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
            onSaveQuickLine={handleSaveQuickLine}
            onEditItem={handleEditItem}
            onOpenDayDetail={(d) => {
              setSelectedDayDate(d);
              setViewMode('daily');
            }}
          />
        ) : (
          /* Detailed Single-Day Schedule & Timeline */
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-300/40">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className="text-xs font-bold text-[#ad1ca8] hover:underline flex items-center gap-1"
              >
                ← Back to Weekly Grid
              </button>
              <span className="text-xs font-bold opacity-75">
                {selectedDayDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <DailyView
              selectedDate={selectedDayDate}
              items={items.filter((i) => i.date === formatDateKey(selectedDayDate))}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItem}
              onMoveToNextDay={(id) => {
                setItems((prev) =>
                  prev.map((item) => {
                    if (item.id !== id) return item;
                    const [y, m, d] = item.date.split('-').map(Number);
                    const nextDate = new Date(y, m - 1, d + 1);
                    return { ...item, date: formatDateKey(nextDate) };
                  })
                );
              }}
              onOpenNewModal={(presetDate, presetTime) => {
                setEditingItem(null);
                setModalPresetDate(presetDate || formatDateKey(selectedDayDate));
                setIsTaskModalOpen(true);
              }}
              onQuickAdd={(title, date) => {
                handleSaveQuickLine(date, title);
              }}
            />
          </div>
        )}
      </main>

      {/* Date & Week Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        currentDate={currentWeekStart}
        onSelectDate={handleSelectDate}
        onJumpToSampleWeek={handleJumpToSampleWeek}
        isDarkMode={isDarkMode}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={items}
        onToggleItem={handleToggleItem}
        onSelectDate={handleSelectDate}
        isDarkMode={isDarkMode}
      />

      {/* Weekly Scratchpad & Goals Modal */}
      <WeeklyNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        currentWeekStart={currentWeekStart}
        goals={goals}
        onToggleGoal={handleToggleGoal}
        onAddGoal={handleAddGoal}
        onDeleteGoal={handleDeleteGoal}
        isDarkMode={isDarkMode}
      />

      {/* Overflow Options Menu */}
      <OverflowMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onJumpToSampleWeek={handleJumpToSampleWeek}
        onJumpToToday={handleToday}
        onClearWeek={handleClearWeek}
        onResetSampleData={handleResetSampleData}
        isDarkMode={isDarkMode}
      />

      {/* Full Task / Event Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveModalItem}
        initialItem={editingItem}
        presetDate={modalPresetDate}
      />
    </div>
  );
}
