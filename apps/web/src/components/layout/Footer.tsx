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
  ExternalLink,
  Volume2,
  VolumeX,
  X
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
  gradient: string;
  url: string;
}

export const Footer: React.FC = () => {
  const [selectedReel, setSelectedReel] = useState<ReelPreview | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeBounce, setActiveBounce] = useState<number | null>(null);

  // Reels from official @bingooo.co.in Instagram
  const reels: ReelPreview[] = [
    {
      id: 'reel-1',
      title: 'Heavyweight Acid-Wash French Terry Drop',
      duration: '0:28',
      views: '74.2K',
      likes: '5.8K',
      comments: '342',
      badge: 'New Drop',
      caption: '280 GSM oversized acid-wash hoodies and relaxed cargo pants. Now available in store. #BingoooMensWear #Srikakulam',
      gradient: 'from-amber-950/80 via-neutral-900 to-black',
      url: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-2',
      title: 'Flagship Store Walkthrough: Srikakulam NH16',
      duration: '0:42',
      views: '128K',
      likes: '9.4K',
      comments: '581',
      badge: 'Flagship Store',
      caption: 'Inside Srikakulam\'s premier men\'s atelier. Streetwear, formal tailoring, and our monthly Spin & Win hub. #Srikakulam #MensFashion',
      gradient: 'from-blue-950/80 via-neutral-900 to-black',
      url: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-3',
      title: 'Korean Pleated Trousers & Cuban Shirts',
      duration: '0:35',
      views: '62.9K',
      likes: '4.6K',
      comments: '219',
      badge: 'Style Guide',
      caption: 'Clean weekend styling: Pleated cream trousers paired with deep olive and linen shirts. #Streetwear #MensStyle',
      gradient: 'from-emerald-950/80 via-neutral-900 to-black',
      url: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-4',
      title: 'Customer Claim: 20% OFF Pass & Branded Tee',
      duration: '0:30',
      views: '95.4K',
      likes: '7.3K',
      comments: '462',
      badge: 'Spin Winner',
      caption: 'Live from checkout! Monthly Spin & Win customer redeemed their instant 20% discount coupon in person. #SpinAndWin #Bingooo',
      gradient: 'from-rose-950/80 via-neutral-900 to-black',
      url: 'https://www.instagram.com/bingooo.co.in/reels/'
    }
  ];

  // Letters of the giant typography
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
                Recent Reels & Drops
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                New fits, customer styling, and Srikakulam flagship arrivals.
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

          {/* 4-Card Reel Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {reels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setSelectedReel(reel)}
                className="group relative aspect-[9/14] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] hover:border-white/20 transition-all duration-300 bg-neutral-950 flex flex-col justify-between p-3.5 select-none"
              >
                {/* Background Gradient Poster */}
                <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient} opacity-90 group-hover:scale-105 transition-transform duration-500`} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                {/* Top Meta: Badge & Duration */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {reel.badge}
                  </span>
                  <span className="text-[10px] font-mono text-white/80 bg-black/40 px-1.5 py-0.5 rounded">
                    {reel.duration}
                  </span>
                </div>

                {/* Centered Play Button */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#0071E3] transition-all">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Title & Views */}
                <div className="relative z-10 space-y-1">
                  <h4 className="text-xs font-semibold text-white tracking-tight line-clamp-1">
                    {reel.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-white/80">
                    <span className="flex items-center space-x-1">
                      <Play className="w-3 h-3 fill-white" />
                      <span>{reel.views}</span>
                    </span>
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-white hover:text-[#0071E3] transition text-[10px] flex items-center space-x-0.5"
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
              Srikakulam's premier men's fashion boutique. Premium oversized tees, Cuban collar shirts, selvedge denim, and structured trousers.
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
                <span>Instagram ↗</span>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
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

            <div className={`relative aspect-[9/13] bg-gradient-to-b ${selectedReel.gradient} p-5 flex flex-col justify-between`}>
              <div className="flex justify-between items-center text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                  {selectedReel.badge}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
                </div>
              </div>

              <div className="bg-black/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-2">
                <p className="text-xs text-white leading-relaxed">
                  {selectedReel.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#A1A1A6]">
                  <span>{selectedReel.views} views</span>
                  <div className="flex items-center space-x-3 text-white">
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
