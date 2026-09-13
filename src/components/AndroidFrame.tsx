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

  if (!isFrameMode) {
    return (
      <div className={`min-h-screen w-full flex justify-center transition-colors ${canvasBg}`}>
        <div className={`w-full max-w-md min-h-screen relative shadow-2xl flex flex-col ${canvasBg}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-5 select-none transition-colors ${
        isDarkMode ? 'bg-[#140b19]' : 'bg-[#d8b8df]'
      }`}
    >
      {/* Outer Android Phone Bezel */}
      <div className="relative w-full max-w-[430px] h-[94vh] max-h-[900px] bg-[#2a1e30] p-2.5 rounded-[46px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border-[3px] border-[#4b3554] flex flex-col">
        {/* Physical Button Accents */}
        <div className="absolute -left-[5px] top-28 w-[3px] h-10 bg-[#4b3554] rounded-l-sm" />
        <div className="absolute -left-[5px] top-42 w-[3px] h-16 bg-[#4b3554] rounded-l-sm" />
        <div className="absolute -right-[5px] top-32 w-[3px] h-14 bg-[#4b3554] rounded-r-sm" />

        {/* Screen Glass Container */}
        <div
          className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative shadow-inner ${canvasBg}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
