import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Bell, Tag, AlertCircle } from 'lucide-react';
import { PlannerItem, Priority, Category } from '../types';
import { playClickSound } from '../utils/audio';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<PlannerItem>) => void;
  initialItem?: PlannerItem | null;
  presetDate?: string;
  presetTime?: string;
}

const CATEGORIES: Category[] = ['work', 'personal', 'fitness', 'study', 'errand', 'health'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  presetDate,
  presetTime,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<Category>('work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title);
      setNotes(initialItem.notes || '');
      setDate(initialItem.date);
      setIsAllDay(initialItem.isAllDay);
      setStartTime(initialItem.startTime || '09:00');
      setEndTime(initialItem.endTime || '10:00');
      setCategory(initialItem.category);
      setPriority(initialItem.priority);
      setReminder(!!initialItem.reminder);
    } else {
      setTitle('');
      setNotes('');
      setDate(presetDate || new Date().toISOString().split('T')[0]);
      setIsAllDay(!presetTime);
      setStartTime(presetTime || '09:00');
      // Set end time 1 hour later
      if (presetTime) {
        const [h, m] = presetTime.split(':').map(Number);
        const endH = Math.min(23, h + 1);
        setEndTime(`${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      } else {
        setEndTime('10:00');
      }
      setCategory('work');
      setPriority('medium');
      setReminder(false);
    }
  }, [initialItem, presetDate, presetTime, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playClickSound();
    onSave({
      ...(initialItem || {}),
      title: title.trim(),
      notes: notes.trim(),
      date,
      isAllDay,
      startTime: isAllDay ? undefined : startTime,
      endTime: isAllDay ? undefined : endTime,
      category,
      priority,
      reminder,
      completed: initialItem ? initialItem.completed : false,
      createdAt: initialItem ? initialItem.createdAt : Date.now(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Android Sheet Drag Handle */}
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

        {/* Modal Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <h2 className="text-sm font-bold text-white tracking-wide">
            {initialItem ? 'Edit Planner Item' : 'New Planner Item'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title or Activity *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Design review, 5k Run, Chemistry reading"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 rounded-xl bg-slate-800 text-sm text-white border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          {/* Date Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* All Day Toggle */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer py-2 text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
                />
                All-Day Task
              </label>
            </div>
          </div>

          {/* Time Picker (if not all day) */}
          {!isAllDay && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-xs text-white border border-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 text-xs text-white border border-slate-700"
                />
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-400" />
              Priority
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {PRIORITIES.map((prio) => (
                <button
                  key={prio}
                  type="button"
                  onClick={() => setPriority(prio)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition text-center ${
                    priority === prio
                      ? prio === 'urgent'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : prio === 'high'
                        ? 'bg-orange-600 text-white border-orange-500'
                        : prio === 'medium'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-700 text-white border-slate-600'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes & Checklist
            </label>
            <textarea
              rows={2}
              placeholder="Add details, links, or prep steps..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 text-xs text-white border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>

          {/* Reminder */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-slate-300">Push notification alert</span>
            </div>
            <input
              type="checkbox"
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              Save to Planner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
