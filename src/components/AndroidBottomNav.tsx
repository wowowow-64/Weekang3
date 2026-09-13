import React from 'react';
import { Calendar, Grid, Flame, BarChart3, Plus } from 'lucide-react';
import { ActiveTab } from '../types';
import { playClickSound } from '../utils/audio';

interface AndroidBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenNewModal: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewModal,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'day',
      label: 'Day Plan',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'week',
      label: 'Week Matrix',
      icon: <Grid className="w-5 h-5" />,
    },
    {
      id: 'habits',
      label: 'Habits',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: 'stats',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Material 3 Floating Action Button (FAB) */}
      <div className="fixed bottom-20 right-6 sm:right-auto sm:left-[calc(50%+140px)] z-40">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenNewModal();
          }}
          className="w-14 h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 transition-all group"
          title="Add New Event or Task"
          aria-label="Add New Event or Task"
        >
          <Plus className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Android Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/90 text-slate-400 max-w-md mx-auto">
        <div className="flex items-center justify-around pt-2 pb-1 px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  onSelectTab(tab.id);
                }}
                className="flex flex-col items-center flex-1 py-1 focus:outline-none group transition"
              >
                {/* Active Pill Container */}
                <div
                  className={`px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-indigo-600/30 text-indigo-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                </div>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight font-medium ${
                    isActive ? 'text-indigo-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto my-1.5 opacity-80" />
      </nav>
    </>
  );
};
