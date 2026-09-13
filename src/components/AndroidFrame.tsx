import React from 'react';

interface AndroidFrameProps {
  isFrameMode: boolean;
  isDarkMode?: boolean;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  isFrameMode,
  isDarkMode = false,
  children,
}) => {
  const canvasBg = isDarkMode ? 'bg-[#1e1324]' : 'bg-[#ebd3f0]';

  // Whole screen mode (Edge-to-edge, occupying 100% width and height)
  if (!isFrameMode) {
    return (
      <div className={`w-full h-screen h-[100dvh] flex flex-col overflow-hidden transition-colors ${canvasBg}`}>
        {children}
      </div>
    );
  }

  // Simulated Android phone bezel frame mode (optional toggle)
  return (
    <div
      className={`w-full h-screen h-[100dvh] flex flex-col items-center justify-center p-2 sm:p-4 select-none transition-colors overflow-hidden ${
        isDarkMode ? 'bg-[#140b19]' : 'bg-[#d8b8df]'
      }`}
    >
      {/* Outer Android Phone Bezel */}
      <div className="relative w-full max-w-[480px] h-full max-h-[96vh] bg-[#2a1e30] p-2 sm:p-2.5 rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-[3px] border-[#4b3554] flex flex-col">
        {/* Physical Button Accents */}
        <div className="absolute -left-[5px] top-28 w-[3px] h-10 bg-[#4b3554] rounded-l-sm" />
        <div className="absolute -left-[5px] top-42 w-[3px] h-16 bg-[#4b3554] rounded-l-sm" />
        <div className="absolute -right-[5px] top-32 w-[3px] h-14 bg-[#4b3554] rounded-r-sm" />

        {/* Screen Glass Container */}
        <div
          className={`w-full h-full rounded-[32px] overflow-hidden flex flex-col relative shadow-inner ${canvasBg}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
