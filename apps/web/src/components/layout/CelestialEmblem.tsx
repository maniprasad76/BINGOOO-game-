import React from 'react';
import { useCelestialTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const CelestialEmblem: React.FC = () => {
  const { theme, cycleCelestial } = useCelestialTheme();
  const isSun = theme === 'sun';

  return (
    <button
      type="button"
      onClick={cycleCelestial}
      title={isSun ? "Switch to Dark mode" : "Switch to Light mode"}
      aria-label={isSun ? "Switch to Dark mode" : "Switch to Light mode"}
      className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-[#86868B] hover:text-[#F5F5F7] transition-all cursor-pointer select-none shrink-0 active:scale-95"
    >
      {isSun ? (
        <Sun className="w-4 h-4 text-[#F5A623] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#A1A1A6] transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
