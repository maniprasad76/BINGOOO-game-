import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  // Typography style options so user can switch between styles
  const [fontStyle, setFontStyle] = useState<'sans' | 'editorial' | 'syne'>('sans');

  // Letters of BINGOOO
  const letters = [
    { char: 'B', rot: '-2deg', color: 'hover:text-[#0071E3]' },
    { char: 'I', rot: '1.5deg', color: 'hover:text-[#0071E3]' },
    { char: 'N', rot: '-1.5deg', color: 'hover:text-[#0071E3]' },
    { char: 'G', rot: '2deg', color: 'hover:text-[#0071E3]' },
    { char: 'O', rot: '-2deg', color: 'hover:text-[#0071E3]' },
    { char: 'O', rot: '1.5deg', color: 'hover:text-[#0071E3]' },
    { char: 'O', rot: '-1.5deg', color: 'hover:text-[#0071E3]' },
  ];

  const [activeBounce, setActiveBounce] = useState<number | null>(null);

  const handleLetterClick = (index: number) => {
    setActiveBounce(index);
    setTimeout(() => setActiveBounce(null), 600);
  };

  // Font family mapping
  const getFontFamilyClass = () => {
    switch (fontStyle) {
      case 'editorial':
        return 'font-condensed tracking-normal uppercase';
      case 'syne':
        return 'font-syne tracking-tight uppercase';
      case 'sans':
      default:
        return 'font-montserrat tracking-tight uppercase';
    }
  };

  return (
    <footer className="bg-black border-t border-white/[0.08] text-[#86868B] text-xs transition-colors overflow-hidden relative">
      {/* Ambient background glow for footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-gradient-to-t from-[#0071E3]/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8 space-y-16 relative z-10">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">
                BINGO<span className="text-[#0071E3]">OO</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#86868B] font-medium border border-white/[0.1] px-2 py-0.5 rounded-full">
                Srikakulam Flagship
              </span>
            </Link>
            <p className="text-xs text-[#86868B] leading-relaxed max-w-sm">
              Srikakulam's premier destination for contemporary men's fashion. Premium oversized t-shirts, cuban collar shirts, selvedge denim, and structured trousers.
            </p>
            <div className="pt-1">
              <a
                href="https://www.bingooo.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] px-3.5 py-1.5 rounded-full transition"
              >
                <span>Visit bingooo.co.in</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#86868B]" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Rewards & Club
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/spin" className="hover:text-white transition">
                  Spin & Win Wheel
                </Link>
              </li>
              <li>
                <Link to="/club" className="hover:text-white transition">
                  Rewards Club Hub
                </Link>
              </li>
              <li>
                <Link to="/club/scratch" className="hover:text-white transition flex items-center space-x-1">
                  <span>Scratch Card</span>
                  <span className="text-[10px] bg-[#0071E3]/20 text-[#0071E3] px-1.5 py-0.2 rounded-full">NEW</span>
                </Link>
              </li>
              <li>
                <Link to="/club/wallet" className="hover:text-white transition">
                  Coins Wallet
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="hover:text-white transition">
                  My Vouchers
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Store Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://maps.app.goo.gl/hV1XT66gjiD9zG4dA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-2.5 hover:text-white transition group"
              >
                <MapPin className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  NH16, Kushalpuram, Srikakulam District, Andhra Pradesh — 532410
                  <span className="block text-[11px] text-[#0071E3] hover:underline mt-0.5">
                    Open in Google Maps ↗
                  </span>
                </span>
              </a>
              <div className="flex items-center space-x-2.5 text-[#86868B]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Open 7 Days: 10:00 AM – 9:30 PM IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* GIANT ANIMATED TYPOGRAPHY: B I N G O O O                  */}
        {/* ======================================================== */}
        <div className="pt-10 pb-4 border-t border-white/[0.06] select-none text-center">
          {/* Header Tagline & Font Style Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#86868B]">
                SRIKAKULAM • MEN'S WEAR
              </span>
            </div>

            {/* Typography Preset Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px]">
              <button
                type="button"
                onClick={() => setFontStyle('sans')}
                className={`px-3 py-1 rounded-full transition-all ${
                  fontStyle === 'sans'
                    ? 'bg-[#0071E3] text-white font-medium shadow-sm'
                    : 'text-[#86868B] hover:text-white'
                }`}
              >
                Modern Geometric
              </button>
              <button
                type="button"
                onClick={() => setFontStyle('editorial')}
                className={`px-3 py-1 rounded-full transition-all ${
                  fontStyle === 'editorial'
                    ? 'bg-[#0071E3] text-white font-medium shadow-sm'
                    : 'text-[#86868B] hover:text-white'
                }`}
              >
                Editorial Bold
              </button>
              <button
                type="button"
                onClick={() => setFontStyle('syne')}
                className={`px-3 py-1 rounded-full transition-all ${
                  fontStyle === 'syne'
                    ? 'bg-[#0071E3] text-white font-medium shadow-sm'
                    : 'text-[#86868B] hover:text-white'
                }`}
              >
                Avant-Garde
              </button>
            </div>
          </div>

          {/* Unified Giant Animated Wordmark */}
          <div className="flex items-center justify-center w-full overflow-hidden py-4 sm:py-6">
            <div className={`inline-flex items-center justify-center ${getFontFamilyClass()}`}>
              {letters.map((item, idx) => {
                const isBouncing = activeBounce === idx;
                return (
                  <span
                    key={idx}
                    onClick={() => handleLetterClick(idx)}
                    style={{
                      animation: `ambient-letter-wave 4s ease-in-out infinite`,
                      animationDelay: `${idx * 0.22}s`,
                      ['--rot' as any]: item.rot,
                    }}
                    className={`giant-footer-letter text-[17vw] sm:text-[14vw] md:text-[12.5vw] font-black leading-none transition-all duration-300 ${
                      item.color
                    } ${
                      isBouncing ? '-translate-y-8 scale-125 !text-white' : ''
                    }`}
                    title="Click or hover to animate"
                  >
                    <span className="bg-gradient-to-b from-white via-[#F0F0F5] to-[#7E7E86] bg-clip-text text-transparent hover:from-white hover:to-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.08)] animate-text-shimmer">
                      {item.char}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[0.25em] text-[#86868B]/60 mt-2">
            Tap or hover individual letters to animate
          </p>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#86868B] gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6">
            <span>© {new Date().getFullYear()} BINGOOO. All rights reserved.</span>
            <Link to="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-white transition">
              Contact & Store
            </Link>
          </div>
          <div className="flex items-center space-x-1.5 text-[#30D158]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[#86868B]">Fair Server Randomness (Asia/Kolkata)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
