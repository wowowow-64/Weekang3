import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Key } from 'lucide-react';

interface AndroidStatusBarProps {
  isDarkMode?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ isDarkMode = false }) => {
  const [timeString, setTimeString] = useState('4:30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      // Format 12h without am/pm for classic Android status bar
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      setTimeString(`${displayHours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-4 pt-1.5 pb-1 flex items-center justify-between text-xs select-none z-40 transition-colors ${
        isDarkMode ? 'bg-[#500c4e] text-white' : 'bg-[#ad1ca8] text-white'
      }`}
    >
      {/* Left side: Time + Notification icons */}
      <div className="flex items-center gap-1.5 font-bold tracking-tight">
        <span className="text-[13px] font-extrabold mr-1">{timeString}</span>

        {/* Missed call / call icon */}
        <svg className="w-3.5 h-3.5 text-white/95" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.27 1.11l-2.3 2.1z"/>
        </svg>

        {/* Vibrate / Audio mode icon */}
        <svg className="w-3.5 h-3.5 text-white/95" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 15h2V9H0v6zm3 2h2V7H3v10zm19-8v6h2V9h-2zm-3 8h2V7h-2v10zM16 4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H8V6h8v12z"/>
        </svg>

        {/* Small notification dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-white/90 ml-0.5" />
      </div>

      {/* Center Camera Punch Hole */}
      <div className="w-3 h-3 rounded-full bg-black/40 border border-white/20 shadow-inner flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-[#1b031b]" />
      </div>

      {/* Right side: Key, Signal, Wifi, Battery 62% */}
      <div className="flex items-center gap-1.5 text-white font-medium">
        {/* Key icon (VPN) */}
        <Key className="w-3 h-3 text-white/90" />

        {/* Cellular signal */}
        <div className="flex items-end gap-0.5 h-3">
          <div className="w-0.5 h-1.5 bg-white rounded-xs" />
          <div className="w-0.5 h-2 bg-white rounded-xs" />
          <div className="w-0.5 h-2.5 bg-white rounded-xs" />
          <div className="w-0.5 h-3 bg-white rounded-xs" />
        </div>

        {/* Wi-Fi */}
        <Wifi className="w-3.5 h-3.5 text-white" />

        {/* Android Battery Pill with "62" inside */}
        <div className="flex items-center">
          <div className="relative border-[1.5px] border-white rounded-[4px] px-1 py-[1px] flex items-center justify-center h-4 min-w-[24px]">
            <span className="text-[9px] font-extrabold leading-none tracking-tighter">62</span>
          </div>
          <div className="w-[1.5px] h-1.5 bg-white rounded-r-xs -ml-[0.5px]" />
        </div>
      </div>
    </div>
  );
};
