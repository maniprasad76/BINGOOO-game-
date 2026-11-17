import React, { useState } from 'react';
import { useCelestialTheme } from '../../context/ThemeContext';
import { Sparkles, Compass } from 'lucide-react';

export const CelestialEmblem: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    theme,
    mode,
    isDaytime,
    srikakulamTime,
    cycleCelestial,
    setThemeDirectly,
    resetToAuto
  } = useCelestialTheme();

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const isSun = theme === 'sun';

  return (
    <div className="relative inline-flex items-center">
      {/* The Celestial Astronomical Disc (Not a toggle button) */}
      <div
        role="button"
        tabIndex={0}
        onClick={cycleCelestial}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cycleCelestial();
          }
        }}
        title={`Current: ${isSun ? 'Sun / Daylight' : 'Moon / Night'}. Srikakulam Time: ${srikakulamTime}. Click emblem to cycle.`}
        className={`group relative flex items-center space-x-2.5 p-1.5 transition-all cursor-pointer select-none border-2 ${
          isSun
            ? 'bg-[#FFFFFF] border-black text-black shadow-[2px_2px_0px_0px_#111111] hover:shadow-[3px_3px_0px_0px_#F5B700]'
            : 'bg-[#181818] border-white text-white shadow-[2px_2px_0px_0px_#C91F32] hover:shadow-[3px_3px_0px_0px_#F5B700]'
        } hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0`}
      >
        {/* Animated Sun / Moon Emblem Core */}
        <div className="relative w-7 h-7 flex items-center justify-center">
          {isSun ? (
            /* Radiant Bauhaus Sun */
            <svg
              className="w-6 h-6 text-[#F5B700] transition-transform duration-500 ease-out group-hover:rotate-45"
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
            /* Crescent Bauhaus Moon with Stars */
            <svg
              className="w-5 h-5 text-[#F5B700] transition-transform duration-500 ease-out group-hover:-rotate-12"
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

          {/* Real-time Astronomical Sync Indicator Dot */}
          {mode === 'auto' && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse"
              title="Synchronized with real Srikakulam Sun & Moon cycle"
            />
          )}
        </div>

        {/* Textual Astronomical Status (Desktop/Tablet) */}
        {!compact && (
          <div className="hidden sm:flex flex-col text-left pr-1 leading-tight font-mono">
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-black uppercase tracking-wider">
                {isSun ? 'SUN // DAY' : 'MOON // NIGHT'}
              </span>
              {mode === 'auto' && (
                <span className="text-[8px] px-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  SYNC
                </span>
              )}
            </div>
            <span className="text-[9px] text-gray-400 tracking-tight">
              SRIKAKULAM {srikakulamTime}
            </span>
          </div>
        )}

        {/* Options caret */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpenMenu(!isOpenMenu);
          }}
          className={`p-1 hover:bg-gray-500/20 rounded text-[10px] font-mono transition ${
            isSun ? 'text-gray-700' : 'text-gray-300'
          }`}
          title="Celestial options"
        >
          ▾
        </button>
      </div>

      {/* Celestial Options Popover Menu */}
      {isOpenMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpenMenu(false)}
          />
          <div
            className={`absolute right-0 top-full mt-2 w-56 z-50 p-3 space-y-2 text-xs font-mono border-2 shadow-[6px_6px_0px_0px_#C91F32] ${
              isSun ? 'bg-white border-black text-black' : 'bg-[#181818] border-white text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-500/30">
              <span className="font-black uppercase tracking-widest text-[10px] text-[#F5B700]">
                CELESTIAL THEME
              </span>
              <span className="text-[9px] text-gray-400">SRIKAKULAM</span>
            </div>

            <div className="space-y-1">
              {/* Sun Option */}
              <button
                type="button"
                onClick={() => {
                  setThemeDirectly('sun');
                  setIsOpenMenu(false);
                }}
                className={`w-full px-2.5 py-1.5 text-left flex items-center space-x-2 border transition ${
                  theme === 'sun' && mode === 'manual'
                    ? 'bg-[#F5B700] text-black border-black font-bold'
                    : 'border-transparent hover:border-gray-400'
                }`}
              >
                <span>☀️</span>
                <div className="flex flex-col">
                  <span className="font-bold">Sun Theme (Daylight)</span>
                  <span className="text-[9px] opacity-75">Clean off-white Bauhaus canvas</span>
                </div>
              </button>

              {/* Moon Option */}
              <button
                type="button"
                onClick={() => {
                  setThemeDirectly('moon');
                  setIsOpenMenu(false);
                }}
                className={`w-full px-2.5 py-1.5 text-left flex items-center space-x-2 border transition ${
                  theme === 'moon' && mode === 'manual'
                    ? 'bg-[#C91F32] text-white border-white font-bold'
                    : 'border-transparent hover:border-gray-400'
                }`}
              >
                <span>🌙</span>
                <div className="flex flex-col">
                  <span className="font-bold">Moon Theme (Night)</span>
                  <span className="text-[9px] opacity-75">Deep obsidian dark canvas</span>
                </div>
              </button>

              {/* Auto Sync with Real Sun & Moon */}
              <button
                type="button"
                onClick={() => {
                  resetToAuto();
                  setIsOpenMenu(false);
                }}
                className={`w-full px-2.5 py-1.5 text-left flex items-center space-x-2 border transition ${
                  mode === 'auto'
                    ? 'bg-emerald-600 text-white border-black font-bold'
                    : 'border-transparent hover:border-gray-400'
                }`}
              >
                <Compass className="w-4 h-4 shrink-0 text-emerald-300" />
                <div className="flex flex-col">
                  <span className="font-bold">Solar Auto-Sync</span>
                  <span className="text-[9px] opacity-75">
                    Follows real Srikakulam sunrise & sunset
                  </span>
                </div>
              </button>
            </div>

            <div className="pt-1.5 border-t border-gray-500/20 text-[9px] text-gray-400">
              Current: <strong>{isDaytime ? 'Daytime (Sun)' : 'Nighttime (Moon)'}</strong> in Srikakulam ({srikakulamTime})
            </div>
          </div>
        </>
      )}
    </div>
  );
};
