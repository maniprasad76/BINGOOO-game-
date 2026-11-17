import React from 'react';
import { useCelestialTheme } from '../../context/ThemeContext';

export const CelestialEmblem: React.FC = () => {
  const { theme, cycleCelestial } = useCelestialTheme();
  const isSun = theme === 'sun';

  return (
    <button
      type="button"
      onClick={cycleCelestial}
      title={isSun ? "Sun mode active. Click for Moon mode" : "Moon mode active. Click for Sun mode"}
      aria-label={isSun ? "Switch to Moon mode" : "Switch to Sun mode"}
      className={`w-9 h-9 flex items-center justify-center border-2 transition-all cursor-pointer select-none ${
        isSun
          ? 'bg-white border-black text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:shadow-[3px_3px_0px_0px_#F5B700]'
          : 'bg-[#181818] border-white text-white shadow-[2px_2px_0px_0px_#C91F32] hover:shadow-[3px_3px_0px_0px_#F5B700]'
      } hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 shrink-0`}
    >
      {isSun ? (
        /* Radiant Sun Icon */
        <svg
          className="w-5 h-5 text-[#F5B700] transition-transform duration-300 hover:rotate-45"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4.5" fill="#F5B700" stroke="#111111" />
          <line x1="12" y1="1" x2="12" y2="3.5" stroke="#111111" />
          <line x1="12" y1="20.5" x2="12" y2="23" stroke="#111111" />
          <line x1="4.22" y1="4.22" x2="5.99" y2="5.99" stroke="#111111" />
          <line x1="18.01" y1="18.01" x2="19.78" y2="19.78" stroke="#111111" />
          <line x1="1" y1="12" x2="3.5" y2="12" stroke="#111111" />
          <line x1="20.5" y1="12" x2="23" y2="12" stroke="#111111" />
          <line x1="4.22" y1="19.78" x2="5.99" y2="18.01" stroke="#111111" />
          <line x1="18.01" y1="5.99" x2="19.78" y2="4.22" stroke="#111111" />
        </svg>
      ) : (
        /* Crescent Moon Icon */
        <svg
          className="w-4 h-4 text-[#F5B700] transition-transform duration-300 hover:-rotate-12"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#F5B700"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <circle cx="17.5" cy="6.5" r="1" fill="#FFFFFF" />
          <circle cx="19.5" cy="10.5" r="0.75" fill="#FFFFFF" />
        </svg>
      )}
    </button>
  );
};
