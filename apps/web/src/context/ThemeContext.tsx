import React, { createContext, useContext, useEffect, useState } from 'react';

export type CelestialTheme = 'sun' | 'moon';
export type CelestialMode = 'auto' | 'manual';

interface ThemeContextType {
  theme: CelestialTheme;
  mode: CelestialMode;
  isDaytime: boolean;
  srikakulamTime: string;
  cycleCelestial: () => void;
  setThemeDirectly: (theme: CelestialTheme) => void;
  resetToAuto: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Srikakulam sunrise is approx 06:00 AM, sunset is approx 18:15 PM
const checkIsSrikakulamDaylight = (): { isDay: boolean; formattedTime: string } => {
  const now = new Date();
  try {
    const timeFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const formattedTime = timeFormatter.format(now);

    const hourFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = hourFormatter.format(now).split(':');
    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    const totalMinutes = hour * 60 + minute;

    // Day from 06:00 (360 min) to 18:15 (1095 min)
    const isDay = totalMinutes >= 360 && totalMinutes < 1095;
    return { isDay, formattedTime };
  } catch (e) {
    const hour = now.getHours();
    return {
      isDay: hour >= 6 && hour < 18,
      formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<CelestialMode>(() => {
    const saved = localStorage.getItem('bingooo_celestial_mode');
    return (saved as CelestialMode) || 'auto';
  });

  const [theme, setTheme] = useState<CelestialTheme>(() => {
    const savedTheme = localStorage.getItem('bingooo_celestial_theme');
    if (savedTheme === 'sun' || savedTheme === 'moon') {
      return savedTheme;
    }
    const { isDay } = checkIsSrikakulamDaylight();
    return isDay ? 'sun' : 'moon';
  });

  const [isDaytime, setIsDaytime] = useState<boolean>(() => checkIsSrikakulamDaylight().isDay);
  const [srikakulamTime, setSrikakulamTime] = useState<string>(() => checkIsSrikakulamDaylight().formattedTime);

  // Update real-world solar time every 30 seconds
  useEffect(() => {
    const updateTime = () => {
      const { isDay, formattedTime } = checkIsSrikakulamDaylight();
      setIsDaytime(isDay);
      setSrikakulamTime(formattedTime);

      if (mode === 'auto') {
        const autoTheme: CelestialTheme = isDay ? 'sun' : 'moon';
        setTheme(autoTheme);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [mode]);

  // Synchronize HTML attributes & document classes whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (theme === 'moon') {
      root.classList.add('dark', 'theme-moon');
      root.classList.remove('theme-sun');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0D0D0D');
    } else {
      root.classList.remove('dark', 'theme-moon');
      root.classList.add('theme-sun');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F7F5F0');
    }

    localStorage.setItem('bingooo_celestial_theme', theme);
    localStorage.setItem('bingooo_celestial_mode', mode);
  }, [theme, mode]);

  // Tapping the celestial emblem cycles through Sun, Moon, and Auto
  const cycleCelestial = () => {
    if (mode === 'auto') {
      // Switch to manual alternate
      const nextTheme = theme === 'sun' ? 'moon' : 'sun';
      setMode('manual');
      setTheme(nextTheme);
    } else {
      // If currently manual, toggle to the other, or back to auto
      if (theme === (isDaytime ? 'sun' : 'moon')) {
        // Toggle to the opposite
        setTheme(theme === 'sun' ? 'moon' : 'sun');
      } else {
        // Return to auto-synced
        setMode('auto');
        setTheme(isDaytime ? 'sun' : 'moon');
      }
    }
  };

  const setThemeDirectly = (newTheme: CelestialTheme) => {
    setMode('manual');
    setTheme(newTheme);
  };

  const resetToAuto = () => {
    setMode('auto');
    const { isDay } = checkIsSrikakulamDaylight();
    setTheme(isDay ? 'sun' : 'moon');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        isDaytime,
        srikakulamTime,
        cycleCelestial,
        setThemeDirectly,
        resetToAuto
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useCelestialTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCelestialTheme must be used within a ThemeProvider');
  }
  return context;
};
