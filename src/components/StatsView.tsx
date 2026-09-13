import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Award,
  TrendingUp,
  CalendarCheck
} from 'lucide-react';
import { PlannerItem, Habit, WeeklyGoal } from '../types';
import { formatDateKey } from '../utils/dateUtils';

interface StatsViewProps {
  weekDays: Date[];
  items: PlannerItem[];
  habits: Habit[];
  goals: WeeklyGoal[];
}

export const StatsView: React.FC<StatsViewProps> = ({
  weekDays,
  items,
  habits,
  goals,
}) => {
  const currentWeekKeys = weekDays.map(formatDateKey);
  const weekItems = items.filter((i) => currentWeekKeys.includes(i.date));

  const totalTasks = weekItems.length;
  const completedTasks = weekItems.filter((i) => i.completed).length;
  const taskCompletionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Focus time calculation (sum of durations of completed items with start & end time)
  let totalMinutes = 0;
  weekItems.filter((i) => i.completed && i.startTime && i.endTime).forEach((i) => {
    const [h1, m1] = i.startTime!.split(':').map(Number);
    const [h2, m2] = i.endTime!.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (diff > 0) totalMinutes += diff;
  });
  const focusHours = (totalMinutes / 60).toFixed(1);

  // Daily task breakdown
  const dailyData = weekDays.map((date) => {
    const key = formatDateKey(date);
    const dayTasks = items.filter((i) => i.date === key);
    const done = dayTasks.filter((i) => i.completed).length;
    const total = dayTasks.length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return {
      dayShort: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      done,
      total,
      percent,
    };
  });

  // Category breakdown
  const categories = ['work', 'personal', 'fitness', 'study', 'errand', 'health'] as const;
  const categoryStats = categories.map((cat) => {
    const catItems = weekItems.filter((i) => i.category === cat);
    return {
      name: cat,
      count: catItems.length,
      completed: catItems.filter((i) => i.completed).length,
    };
  }).filter((c) => c.count > 0);

  // Habits rate
  const totalHabitDaysPossible = habits.length * 7;
  let totalHabitDaysDone = 0;
  habits.forEach((h) => {
    totalHabitDaysDone += h.completedDates.filter((k) => currentWeekKeys.includes(k)).length;
  });
  const habitRate =
    totalHabitDaysPossible === 0
      ? 0
      : Math.round((totalHabitDaysDone / totalHabitDaysPossible) * 100);

  // Goals
  const completedGoals = goals.filter((g) => g.completed).length;

  return (
    <div className="flex-1 px-4 py-3 pb-24 text-slate-200">
      <div className="mb-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
          Weekly Analytics & Review
          <BarChart3 className="w-4 h-4 text-indigo-400" />
        </h2>
        <p className="text-xs text-slate-400">Your weekly productivity velocity</p>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{taskCompletionRate}%</div>
            <div className="text-[11px] text-slate-400">
              {completedTasks} / {totalTasks} tasks done
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Focus Hours</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{focusHours}h</div>
            <div className="text-[11px] text-slate-400">completed focus blocks</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Habit Target</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{habitRate}%</div>
            <div className="text-[11px] text-slate-400">
              {totalHabitDaysDone} checks this week
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Big Rocks</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {completedGoals}/{goals.length}
            </div>
            <div className="text-[11px] text-slate-400">strategic goals hit</div>
          </div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Daily Task Completion
          </h3>
          <span className="text-[10px] text-slate-400">Mon - Sun</span>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2 pb-1">
          {dailyData.map((d, index) => {
            const heightPercent = d.total === 0 ? 8 : Math.max(12, (d.done / (d.total || 1)) * 100);
            return (
              <div key={index} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex justify-center text-[10px] font-bold text-slate-300">
                  {d.done}
                </div>
                <div className="w-full bg-slate-900 rounded-lg h-16 flex items-end p-0.5 overflow-hidden">
                  <div
                    className={`w-full rounded-md transition-all duration-500 ${
                      d.percent === 100
                        ? 'bg-emerald-500'
                        : d.percent > 0
                        ? 'bg-indigo-500'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{d.dayShort}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-4">
        <h3 className="text-xs font-bold text-white mb-2.5 flex items-center gap-1.5">
          <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
          Time & Focus by Category
        </h3>

        <div className="space-y-2">
          {categoryStats.map((c) => {
            const pct = Math.round((c.completed / (c.count || 1)) * 100);
            return (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize text-slate-200 font-medium">{c.name}</span>
                  <span className="text-[11px] text-slate-400">
                    {c.completed} of {c.count} done ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
