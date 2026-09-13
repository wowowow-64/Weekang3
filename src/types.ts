export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Category = 'work' | 'personal' | 'fitness' | 'study' | 'errand' | 'health';

export interface PlannerItem {
  id: string;
  title: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (e.g. "09:00")
  endTime?: string; // HH:mm (e.g. "10:30")
  isAllDay: boolean;
  completed: boolean;
  priority: Priority;
  category: Category;
  reminder?: boolean;
  createdAt: number;
}

export interface WeeklyGoal {
  id: string;
  weekStart: string; // YYYY-MM-DD of the week start
  title: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  iconName: string;
  color: string;
  targetDays: number; // e.g. 5 or 7 days a week
  completedDates: string[]; // List of YYYY-MM-DD dates
}

export type ActiveTab = 'day' | 'week' | 'habits' | 'stats';

export interface DayInfo {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayName: string; // Mon, Tue...
  dayShort: string; // M, T, W...
  dayNumber: number; // 1-31
  isToday: boolean;
  isSelected: boolean;
  itemCount: number;
  completedCount: number;
}
