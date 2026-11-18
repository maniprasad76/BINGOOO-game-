import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  Instagram,
  Play,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
  X,
  ExternalLink
} from 'lucide-react';

interface ReelPreview {
  id: string;
  title: string;
  duration: string;
  views: string;
  likes: string;
  comments: string;
  badge: string;
  caption: string;
  image: string;
  url: string;
}

export const Footer: React.FC = () => {
  const [selectedReel, setSelectedReel] = useState<ReelPreview | null>(null);
  const [activeBounce, setActiveBounce] = useState<number | null>(null);

  // Exact authentic reels from official @bingooo.co.in Instagram
  const reels: ReelPreview[] = [
    {
      id: 'Dfj8UqKTPX5',
      title: 'Navvukondiii 😂😂',
      duration: '0:22',
      views: '2,940',
      likes: '197',
      comments: '19',
      badge: 'Reel',
      caption: 'Navvukondiii 😂😂 #fun #comment #reach #explorepage #instagram @bingooo.co.in',
      image: '/reels/reel-1.jpg',
      url: 'https://www.instagram.com/reel/Dfj8UqKTPX5/'
    },
    {
      id: 'Dfhc0iQMa_1',
      title: 'RAAKA Oversized Tee — Bold Minimal Drop',
      duration: '0:28',
      views: '913',
      likes: '79',
      comments: '3',
      badge: 'RAAKA Drop',
      caption: 'WHITE. BOLD. UNSTOPPABLE. 🖤 Introducing the RAAKA oversized tee — where minimal design meets maximum attitude. Premium streetwear aesthetic, classic oversized fit, statement typography. Available at BINGOOO.',
      image: '/reels/reel-2.jpg',
      url: 'https://www.instagram.com/reel/Dfhc0iQMa_1/'
    },
    {
      id: 'DfXKt5ZMm_3',
      title: 'Sadie Sink Graphic Oversized T-Shirt',
      duration: '0:35',
      views: '3,599',
      likes: '218',
      comments: '12',
      badge: 'Graphic Tee',
      caption: '🌹 SADIE SINK GRAPHIC OVERSIZED T-SHIRT ❤️ Premium Graphic T-Shirt, Trendy Oversized Fit, High-Quality DTF Print, Everyday Streetwear Style. Available in store at BINGOOO.',
      image: '/reels/reel-3.jpg',
      url: 'https://www.instagram.com/reel/DfXKt5ZMm_3/'
    },
    {
      id: 'DfQsPKiTAhN',
      title: 'Koncham Support Chey Mamaaa ❤️',
      duration: '0:18',
      views: '4,724',
      likes: '164',
      comments: '18',
      badge: 'Community',
      caption: 'Koncham support chey mamaaa ❤️ #like #fypppppppp #follow #comment #fashion @bingooo.co.in',
      image: '/reels/reel-4.jpg',
      url: 'https://www.instagram.com/reel/DfQsPKiTAhN/'
    }
  ];

  const letters = ['B', 'I', 'N', 'G', 'O', 'O', 'O'];

  const handleLetterClick = (index: number) => {
    setActiveBounce(index);
    setTimeout(() => setActiveBounce(null), 500);
  };

  return (
    <footer className="bg-black border-t border-white/[0.08] text-[#86868B] text-xs transition-colors overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8 space-y-16 relative z-10">

        {/* ======================================================== */}
        {/* INSTAGRAM REELS SHOWCASE (ON TOP OF FOOTER)              */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-[#A1A1A6]">
                <Instagram className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Instagram @bingooo.co.in</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Latest Reels from @bingooo.co.in
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Exact reels & drops from our official Instagram feed.
              </p>
            </div>

            <a
              href="https://www.instagram.com/bingooo.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-button-secondary text-xs inline-flex items-center space-x-1.5 self-start sm:self-auto text-white hover:text-white"
            >
              <Instagram className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Follow @bingooo.co.in ↗</span>
            </a>
          </div>

          {/* 4-Card Reel Grid with Real Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {reels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setSelectedReel(reel)}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.1] hover:border-white/30 transition-all duration-300 bg-neutral-950 flex flex-col justify-between p-3.5 select-none shadow-lg"
              >
                {/* Real Reel Poster Image */}
                <img
                  src={reel.image}
                  alt={reel.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50 group-hover:via-black/20 transition-colors" />

                {/* Top Meta: Badge & Duration */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {reel.badge}
                  </span>
                  <span className="text-[10px] font-mono text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
                    {reel.duration}
                  </span>
                </div>

                {/* Centered Play Button */}
                <div className="relative z-10 flex items-center justify-center my-auto opacity-90 group-hover:opacity-100">
                  <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#0071E3] transition-all shadow-xl">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Title & Views */}
                <div className="relative z-10 space-y-1.5">
                  <h4 className="text-xs font-semibold text-white tracking-tight line-clamp-2 leading-snug drop-shadow-md">
                    {reel.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-white/90 font-medium">
                    <span className="flex items-center space-x-1">
                      <Play className="w-3 h-3 fill-white" />
                      <span>{reel.views}</span>
                    </span>
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-white hover:text-[#0071E3] transition text-[10px] flex items-center space-x-0.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/10"
                    >
                      <span>Watch</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* MAIN FOOTER NAVIGATION GRID                              */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pt-4 border-t border-white/[0.08]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">
                BINGO<span className="text-[#0071E3]">OO</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#86868B] font-medium border border-white/[0.1] px-2 py-0.5 rounded-full">
                Srikakulam Flagship
              </span>
            </Link>
            <p className="text-xs text-[#86868B] leading-relaxed max-w-sm">
              Srikakulam's premier men's fashion boutique. 240 GSM oversized tees, Cuban collar shirts, selvedge denim, and structured trousers.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <a
                href="https://www.bingooo.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-secondary inline-flex items-center space-x-1.5 text-xs text-white"
              >
                <span>Store Website ↗</span>
              </a>
              <a
                href="https://www.instagram.com/bingooo.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-secondary inline-flex items-center space-x-1.5 text-xs text-white"
              >
                <Instagram className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>@bingooo.co.in ↗</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
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
                <Link to="/club/scratch" className="hover:text-white transition">
                  Spin Scratch Card
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
              Flagship Boutique
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
                  NH16, Kushalpuram, Srikakulam District, AP — 532410
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
        {/* MONUMENTAL BINGOOO TYPOGRAPHY                            */}
        {/* ======================================================== */}
        <div className="pt-10 pb-4 border-t border-white/[0.06] select-none text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] font-medium text-[#71717A] mb-4">
            SRIKAKULAM • MEN'S WEAR
          </p>

          <div className="flex items-center justify-center w-full overflow-hidden py-2">
            <div className="inline-flex items-center justify-center font-montserrat tracking-tight uppercase">
              {letters.map((char, idx) => {
                const isBouncing = activeBounce === idx;
                return (
                  <span
                    key={idx}
                    onClick={() => handleLetterClick(idx)}
                    style={{
                      animation: `ambient-letter-wave 4s ease-in-out infinite`,
                      animationDelay: `${idx * 0.2}s`,
                    }}
                    className={`giant-footer-letter text-[17vw] sm:text-[14vw] md:text-[12.5vw] font-black leading-none transition-all duration-300 hover:text-[#0071E3] ${
                      isBouncing ? '-translate-y-6 scale-110 text-white' : ''
                    }`}
                    title="BINGOOO"
                  >
                    <span className="bg-gradient-to-b from-white via-[#EAEAEA] to-[#606066] bg-clip-text text-transparent hover:from-white hover:to-white">
                      {char}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legal Row */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71717A] gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>© {new Date().getFullYear()} BINGOOO Men's Wear. All rights reserved.</span>
            <Link to="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-white transition">
              Store Contact
            </Link>
          </div>
          <div className="flex items-center space-x-1.5 text-[#30D158]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[#71717A]">Cryptographic Fair Play (IST)</span>
          </div>
        </div>
      </div>

      {/* Reel Modal Preview */}
      {selectedReel && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm apple-glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-black/60">
              <div className="flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-[#0071E3]" />
                <span className="text-xs font-semibold text-white">@bingooo.co.in</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReel(null)}
                className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[9/13] overflow-hidden flex flex-col justify-between p-5">
              {/* Real Background Image */}
              <img
                src={selectedReel.image}
                alt={selectedReel.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

              <div className="relative z-10 flex justify-between items-center text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                  {selectedReel.badge}
                </span>
                <span className="text-[10px] font-mono text-white/90 bg-black/50 px-2 py-0.5 rounded">
                  {selectedReel.duration}
                </span>
              </div>

              <div className="relative z-10 flex items-center justify-center">
                <a
                  href={selectedReel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full bg-black/60 border border-white/30 flex items-center justify-center hover:scale-110 transition shadow-xl"
                >
                  <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
                </a>
              </div>

              <div className="relative z-10 bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white">
                  {selectedReel.title}
                </h4>
                <p className="text-[11px] text-[#A1A1A6] leading-relaxed line-clamp-3">
                  {selectedReel.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-white/90 pt-1 border-t border-white/10">
                  <span>{selectedReel.views} views</span>
                  <div className="flex items-center space-x-3">
                    <span>❤️ {selectedReel.likes}</span>
                    <span>💬 {selectedReel.comments}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-black/90">
              <a
                href={selectedReel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-primary w-full text-center text-xs flex items-center justify-center space-x-1.5 py-2.5"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Open Reel on Instagram ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
