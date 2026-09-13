import { PlannerItem, Habit, WeeklyGoal } from '../types';
import { formatDateKey, getStartOfWeek } from './dateUtils';

export function getInitialPlannerItems(referenceDate: Date = new Date()): PlannerItem[] {
  const weekStart = getStartOfWeek(referenceDate, true);
  
  const getOffsetDate = (daysFromMonday: number): string => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + daysFromMonday);
    return formatDateKey(d);
  };

  return [
    // Monday
    {
      id: 'item-mon-1',
      title: 'Weekly Strategy & Sprint Planning',
      notes: 'Review goals for Q3 milestone and align deliverables with team',
      date: getOffsetDate(0),
      startTime: '09:00',
      endTime: '10:15',
      isAllDay: false,
      completed: true,
      priority: 'high',
      category: 'work',
      reminder: true,
      createdAt: Date.now() - 600000,
    },
    {
      id: 'item-mon-2',
      title: '45-min Cardio & Mobility',
      notes: 'Warm-up, 5k moderate pace, hip opening stretches',
      date: getOffsetDate(0),
      startTime: '07:00',
      endTime: '08:00',
      isAllDay: false,
      completed: true,
      priority: 'medium',
      category: 'fitness',
      createdAt: Date.now() - 500000,
    },
    {
      id: 'item-mon-3',
      title: 'Submit quarterly budget proposal',
      notes: 'Check travel expenses and software renewals',
      date: getOffsetDate(0),
      startTime: '14:30',
      endTime: '16:00',
      isAllDay: false,
      completed: true,
      priority: 'urgent',
      category: 'work',
      createdAt: Date.now() - 400000,
    },
    // Tuesday
    {
      id: 'item-tue-1',
      title: 'Deep Work: Client Architecture Spec',
      notes: 'Finalize API contracts and database schema updates',
      date: getOffsetDate(1),
      startTime: '10:00',
      endTime: '12:30',
      isAllDay: false,
      completed: true,
      priority: 'high',
      category: 'work',
      reminder: true,
      createdAt: Date.now() - 300000,
    },
    {
      id: 'item-tue-2',
      title: 'Grocery Store Restock',
      notes: 'Organic oats, almond milk, greens, salmon, fruit',
      date: getOffsetDate(1),
      startTime: '17:30',
      endTime: '18:30',
      isAllDay: false,
      completed: true,
      priority: 'low',
      category: 'errand',
      createdAt: Date.now() - 250000,
    },
    // Wednesday
    {
      id: 'item-wed-1',
      title: 'Mid-week Product Sync',
      notes: 'Review UI mockups and user feedback tickets',
      date: getOffsetDate(2),
      startTime: '11:00',
      endTime: '12:00',
      isAllDay: false,
      completed: true,
      priority: 'medium',
      category: 'work',
      createdAt: Date.now() - 200000,
    },
    {
      id: 'item-wed-2',
      title: 'Read chapter 4: System Design Interview',
      notes: 'Take notes on distributed caching patterns',
      date: getOffsetDate(2),
      startTime: '19:30',
      endTime: '20:45',
      isAllDay: false,
      completed: true,
      priority: 'medium',
      category: 'study',
      createdAt: Date.now() - 150000,
    },
    // Thursday
    {
      id: 'item-thu-1',
      title: '1-on-1 Mentorship Sessions',
      notes: 'Review career growth and project milestones',
      date: getOffsetDate(3),
      startTime: '13:00',
      endTime: '14:30',
      isAllDay: false,
      completed: true,
      priority: 'high',
      category: 'work',
      createdAt: Date.now() - 100000,
    },
    {
      id: 'item-thu-2',
      title: 'Full Body Strength Session',
      notes: 'Deadlifts, overhead press, core stability circuit',
      date: getOffsetDate(3),
      startTime: '17:45',
      endTime: '19:00',
      isAllDay: false,
      completed: true,
      priority: 'medium',
      category: 'fitness',
      createdAt: Date.now() - 80000,
    },
    // Friday
    {
      id: 'item-fri-1',
      title: 'Code Freeze & Release Deploy',
      notes: 'Check CI test pass rate, verify production smoke tests',
      date: getOffsetDate(4),
      startTime: '10:00',
      endTime: '11:30',
      isAllDay: false,
      completed: true,
      priority: 'urgent',
      category: 'work',
      reminder: true,
      createdAt: Date.now() - 60000,
    },
    {
      id: 'item-fri-2',
      title: 'Weekly Retrospective & Wins Celebration',
      notes: 'Share demo video and recognize team contributions',
      date: getOffsetDate(4),
      startTime: '15:30',
      endTime: '16:30',
      isAllDay: false,
      completed: true,
      priority: 'medium',
      category: 'work',
      createdAt: Date.now() - 40000,
    },
    // Saturday
    {
      id: 'item-sat-1',
      title: 'Outdoor Trail Hike',
      notes: 'Pine Valley scenic loop with friends, pack hydration pack',
      date: getOffsetDate(5),
      startTime: '08:30',
      endTime: '11:30',
      isAllDay: false,
      completed: true,
      priority: 'medium',
      category: 'fitness',
      createdAt: Date.now() - 20000,
    },
    {
      id: 'item-sat-2',
      title: 'Dinner Reservation at Bistro 9',
      notes: 'Table for 2 booked under Clark at 7:30 PM',
      date: getOffsetDate(5),
      startTime: '19:30',
      endTime: '21:30',
      isAllDay: false,
      completed: true,
      priority: 'low',
      category: 'personal',
      createdAt: Date.now() - 10000,
    },
    // Sunday (Today!)
    {
      id: 'item-sun-1',
      title: 'Weekly Review & Next Week Plan',
      notes: 'Review accomplishments, clear inbox, set top 3 priorities',
      date: getOffsetDate(6),
      startTime: '10:00',
      endTime: '11:00',
      isAllDay: false,
      completed: false,
      priority: 'high',
      category: 'personal',
      reminder: true,
      createdAt: Date.now(),
    },
    {
      id: 'item-sun-2',
      title: 'Meal Prep for the Week',
      notes: 'Grill chicken, roast sweet potatoes, wash fresh greens',
      date: getOffsetDate(6),
      startTime: '14:00',
      endTime: '15:30',
      isAllDay: false,
      completed: false,
      priority: 'medium',
      category: 'health',
      createdAt: Date.now(),
    },
    {
      id: 'item-sun-3',
      title: 'Evening Wind-Down & Book Reading',
      notes: 'Read 30 pages, disconnect screens by 10 PM',
      date: getOffsetDate(6),
      startTime: '21:00',
      endTime: '22:00',
      isAllDay: false,
      completed: false,
      priority: 'low',
      category: 'personal',
      createdAt: Date.now(),
    },
  ];
}

export function getInitialWeeklyGoals(referenceDate: Date = new Date()): WeeklyGoal[] {
  const weekStart = formatDateKey(getStartOfWeek(referenceDate, true));
  return [
    {
      id: 'goal-1',
      weekStart,
      title: 'Complete production deploy without critical rollbacks',
      completed: true,
    },
    {
      id: 'goal-2',
      weekStart,
      title: 'Hit 4 gym workouts and maintain clean nutrition',
      completed: true,
    },
    {
      id: 'goal-3',
      weekStart,
      title: 'Plan next quarter strategic roadmap & budget',
      completed: false,
    },
  ];
}

export function getInitialHabits(referenceDate: Date = new Date()): Habit[] {
  const weekStart = getStartOfWeek(referenceDate, true);
  const getOffset = (days: number) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + days);
    return formatDateKey(d);
  };

  return [
    {
      id: 'habit-1',
      name: 'Morning Workout & Stretch',
      iconName: 'Dumbbell',
      color: 'bg-emerald-500',
      targetDays: 5,
      completedDates: [getOffset(0), getOffset(1), getOffset(3), getOffset(5)],
    },
    {
      id: 'habit-2',
      name: 'Drink 2.5L Water Daily',
      iconName: 'Droplets',
      color: 'bg-cyan-500',
      targetDays: 7,
      completedDates: [getOffset(0), getOffset(1), getOffset(2), getOffset(3), getOffset(4), getOffset(5)],
    },
    {
      id: 'habit-3',
      name: 'Read 20 Mins',
      iconName: 'BookOpen',
      color: 'bg-indigo-500',
      targetDays: 6,
      completedDates: [getOffset(0), getOffset(2), getOffset(3), getOffset(4), getOffset(5)],
    },
    {
      id: 'habit-4',
      name: 'Sleep by 11:00 PM',
      iconName: 'Moon',
      color: 'bg-purple-500',
      targetDays: 5,
      completedDates: [getOffset(0), getOffset(1), getOffset(2), getOffset(4)],
    },
    {
      id: 'habit-5',
      name: 'Mindful Meditation',
      iconName: 'Sparkles',
      color: 'bg-amber-500',
      targetDays: 5,
      completedDates: [getOffset(0), getOffset(1), getOffset(3), getOffset(4)],
    },
  ];
}
