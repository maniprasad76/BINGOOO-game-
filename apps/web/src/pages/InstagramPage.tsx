import React, { useState } from 'react';
import {
  Instagram,
  ExternalLink,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ShoppingBag,
  MapPin,
  Check,
  Copy,
  Radio,
  ArrowUpRight
} from 'lucide-react';

interface ReelItem {
  id: string;
  title: string;
  category: 'drops' | 'store' | 'outfits' | 'winners';
  views: string;
  likes: string;
  comments: string;
  duration: string;
  caption: string;
  audioTrack: string;
  coverGradient: string;
  instagramUrl: string;
  badge?: string;
}

export const InstagramPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);

  const instagramProfileUrl = "https://www.instagram.com/bingooo.co.in/";
  const instagramHandle = "@bingooo.co.in";

  const reelsData: ReelItem[] = [
    {
      id: 'reel-1',
      title: 'Winter Streetwear Drop: Heavyweight Acid-Wash Fits',
      category: 'drops',
      views: '74.2K',
      likes: '5,820',
      comments: '342',
      duration: '0:28',
      badge: 'NEW DROP 🔥',
      caption: 'The drop you have been waiting for. 280 GSM French Terry oversized hoodies and relaxed parachute pants now in stock at Srikakulam store! #BingoooMensWear #SrikakulamFashion #StreetwearStyle',
      audioTrack: 'Original Audio - BINGOOO Street Beats',
      coverGradient: 'from-amber-900/60 via-stone-900/80 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-2',
      title: 'Flagship Store Tour: Srikakulam NH16 Boutique',
      category: 'store',
      views: '128.5K',
      likes: '9,430',
      comments: '581',
      duration: '0:42',
      badge: 'TRENDING 🏬',
      caption: 'Step inside Srikakulam\'s premier men\'s fashion studio. Two floors of contemporary fits, fitting lounges, and our monthly Spin & Win rewards hub. #Srikakulam #MensStore #BingoooCoIn',
      audioTrack: 'Store Vibe Beats - Luxury Lounge',
      coverGradient: 'from-blue-950/70 via-slate-900/80 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-3',
      title: 'Styling 3 Korean Trousers with Cuban Collar Shirts',
      category: 'outfits',
      views: '62.9K',
      likes: '4,610',
      comments: '219',
      duration: '0:35',
      badge: 'STYLE GUIDE 👕',
      caption: 'Effortless weekend styling: Pleated cream trousers paired with deep olive and textured linen shirts. Available in sizes S through XXL. #StyleInspiration #KoreanPants #MenFit',
      audioTrack: 'Lo-Fi Chill Hop - Sunday Vibe',
      coverGradient: 'from-emerald-950/70 via-stone-900/80 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-4',
      title: 'Customer Won 20% OFF Spin Wheel + Free Custom T-Shirt!',
      category: 'winners',
      views: '95.4K',
      likes: '7,380',
      comments: '462',
      duration: '0:30',
      badge: 'SPIN WINNER 🎉',
      caption: 'Live from the billing counter! Verified customer spun the monthly wheel on his phone, won the instant 20% OFF pass, and claimed his free branded tee. #SpinAndWin #BingoooRewards',
      audioTrack: 'Victory Horns - Celebration Beat',
      coverGradient: 'from-red-950/70 via-zinc-900/80 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-5',
      title: 'Italian Cut Blazers & Luxury Party Wear Suits',
      category: 'drops',
      views: '48.1K',
      likes: '3,540',
      comments: '188',
      duration: '0:38',
      badge: 'FORMAL SUITS 👔',
      caption: 'Elevate your festive look. Tailored Italian silhouette blazers, stretch tuxedo shirts, and formal trousers crafted for perfection. #WeddingSeason #MensBlazer #Bingooo',
      audioTrack: 'Cinematic Fashion Pulse - Night Vibe',
      coverGradient: 'from-purple-950/70 via-neutral-900/80 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-6',
      title: 'Fabric Quality Test: 100% Combed Cotton Oversized Polos',
      category: 'outfits',
      views: '83.7K',
      likes: '6,190',
      comments: '375',
      duration: '0:25',
      badge: 'PREMIUM QUALITY ✨',
      caption: 'Touch and feel the difference. Zero shrinkage, biowashed 260 GSM pique cotton with structured rib collars that never roll up. #MensWear #QualityFirst #Srikakulam',
      audioTrack: 'Minimal Electronic - Pure Bass',
      coverGradient: 'from-cyan-950/70 via-zinc-900/80 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    }
  ];

  const filteredReels = activeCategory === 'all'
    ? reelsData
    : reelsData.filter(r => r.category === activeCategory);

  const handleCopyHandle = () => {
    navigator.clipboard.writeText(instagramHandle);
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedReels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      {/* Instagram Profile Header Card */}
      <div className="apple-glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#E1306C]/15 via-[#F77737]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
          {/* Animated Instagram Story Ring Avatar */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] animate-pulse">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-1 overflow-hidden border-2 border-black">
                <span className="text-3xl sm:text-4xl font-black text-white font-display">
                  B
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#0071E3] text-white border-2 border-black">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>bingooo.co.in</span>
                <span className="inline-flex items-center text-[11px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full border border-[#0071E3]/20">
                  Verified
                </span>
              </h1>
              <span className="text-xs text-[#86868B] font-mono">
                Official Brand Page
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-xl leading-relaxed">
              Srikakulam's premier men's fashion boutique 📍 NH16, Kushalpuram. Heavyweight Oversized Tees, Cuban Collar Shirts, Selvedge Denim, Korean Pants & Suits.
            </p>

            {/* Profile Statistics Row */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-[#86868B]">
              <div>
                <strong className="block text-white text-sm font-semibold">240+</strong>
                <span>Posts & Reels</span>
              </div>
              <div className="w-px h-6 bg-white/[0.08]" />
              <div>
                <strong className="block text-white text-sm font-semibold">18.6K</strong>
                <span>Followers</span>
              </div>
              <div className="w-px h-6 bg-white/[0.08]" />
              <div>
                <strong className="block text-white text-sm font-semibold">Srikakulam</strong>
                <span>Andhra Pradesh</span>
              </div>
            </div>

            {/* Action Buttons: Direct Instagram Redirect */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FD1D1D] via-[#E1306C] to-[#833AB4] hover:opacity-95 text-white text-xs font-semibold tracking-normal transition-all active:scale-[0.98] shadow-lg shadow-[#E1306C]/25 flex items-center space-x-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Follow @bingooo.co.in on Instagram ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyHandle}
                className="apple-button-secondary inline-flex items-center space-x-1.5 text-xs"
              >
                {copiedHandle ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#30D158]" />
                    <span className="text-[#30D158]">Handle Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#86868B]" />
                    <span>Copy @bingooo.co.in</span>
                  </>
                )}
              </button>

              <a
                href="https://ig.me/m/bingooo.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-secondary inline-flex items-center space-x-1.5 text-xs text-[#86868B] hover:text-white"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>DM Us on Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Community Reward Callout */}
      <div className="apple-glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#0071E3]/20 bg-gradient-to-r from-[#0071E3]/10 to-transparent">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-[#0071E3]/20 text-[#0071E3] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white">
              Tag @bingooo.co.in in your Reel or Story!
            </h3>
            <p className="text-[11px] text-[#86868B]">
              Post your outfit from BINGOOO Men's Wear and get 200 free BINGOOO Coins added to your wallet.
            </p>
          </div>
        </div>
        <a
          href={instagramProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="apple-button-primary text-xs shrink-0 whitespace-nowrap"
        >
          Tag Us on Instagram ↗
        </a>
      </div>

      {/* Reels Section Header & Category Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#0071E3] font-medium uppercase tracking-wider block">
              Official Instagram Feed
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-0.5">
              Featured Reels & Outfit Drops
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Reels' },
              { id: 'drops', label: 'New Drops 🔥' },
              { id: 'store', label: 'Store Tour 🏬' },
              { id: 'outfits', label: 'Outfits 👕' },
              { id: 'winners', label: 'Spin Winners 🎉' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#0071E3] text-white font-medium shadow-sm'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-[#86868B] hover:text-white border border-white/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 9:16 Vertical Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReels.map((reel) => {
            const isLiked = likedReels[reel.id];
            return (
              <div
                key={reel.id}
                onClick={() => setSelectedReel(reel)}
                className="group apple-glass-card rounded-3xl overflow-hidden cursor-pointer relative flex flex-col transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl hover:shadow-[#E1306C]/10"
              >
                {/* 9:16 Aspect Ratio Video/Cover Area */}
                <div className={`relative w-full aspect-[9/14] bg-gradient-to-b ${reel.coverGradient} p-5 flex flex-col justify-between overflow-hidden`}>
                  {/* Top Bar: Badge & Duration */}
                  <div className="flex items-center justify-between relative z-10">
                    {reel.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {reel.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/40 backdrop-blur-md text-gray-300 border border-white/5">
                      {reel.duration}
                    </span>
                  </div>

                  {/* Centered Play Button (reveals on hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl shadow-black/50 group-hover:bg-[#E1306C]/80 transition">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Overlay on Cover: Sound & Metrics */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center space-x-1.5 text-[10px] text-gray-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full w-fit max-w-[90%] truncate">
                      <Radio className="w-3 h-3 text-[#E1306C] shrink-0 animate-pulse" />
                      <span className="truncate">{reel.audioTrack}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white font-medium pt-1">
                      <span className="flex items-center space-x-1 text-white/90">
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{reel.views} views</span>
                      </span>

                      <div className="flex items-center space-x-3 text-white/90">
                        <button
                          type="button"
                          onClick={(e) => toggleLike(reel.id, e)}
                          className="hover:scale-125 transition flex items-center space-x-1"
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-white'}`} />
                          <span className="text-[11px]">{reel.likes}</span>
                        </button>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-[11px]">{reel.comments}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reel Caption & Action Footer */}
                <div className="p-4 sm:p-5 space-y-3 bg-black/60 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-[#0071E3] transition">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-[#86868B] line-clamp-2 mt-1 leading-relaxed">
                      {reel.caption}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-[#0071E3] font-medium flex items-center space-x-1">
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Watch Reel</span>
                    </span>
                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-[#86868B] hover:text-white transition flex items-center space-x-1"
                    >
                      <span>Open Instagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Reel Modal Player */}
      {selectedReel && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm sm:max-w-md apple-glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-black/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-[10px] text-white">
                    B
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">bingooo.co.in</h4>
                  <p className="text-[10px] text-[#86868B]">Official Instagram Reel</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReel(null)}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Canvas Presentation */}
            <div className={`relative aspect-[9/13] bg-gradient-to-b ${selectedReel.coverGradient} p-6 flex flex-col justify-between`}>
              <div className="flex justify-between items-center text-xs text-white/90">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold border border-white/10">
                  {selectedReel.badge || 'BINGOOO REELS'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Pulsing Audio Equalizer Simulation */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center animate-pulse">
                  <Play className="w-7 h-7 fill-white ml-1 text-white" />
                </div>
                <div className="flex items-end space-x-1 h-6">
                  <span className="w-1 bg-[#0071E3] h-3 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 bg-[#E1306C] h-6 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-[#F77737] h-4 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-[#833AB4] h-5 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <span className="w-1 bg-white h-2 animate-bounce" style={{ animationDelay: '0.15s' }} />
                </div>
              </div>

              {/* Reel Info Inside Modal */}
              <div className="space-y-3 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-white leading-relaxed font-normal">
                  {selectedReel.caption}
                </p>
                <div className="flex items-center justify-between text-xs text-[#86868B] pt-1">
                  <span>{selectedReel.views} views</span>
                  <div className="flex items-center space-x-3 text-white">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-[#FF3B30] fill-[#FF3B30]" />
                      <span>{selectedReel.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{selectedReel.comments}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Redirect to Instagram */}
            <div className="p-4 bg-black/90 space-y-2">
              <a
                href={selectedReel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#FD1D1D] via-[#E1306C] to-[#833AB4] hover:opacity-95 text-white font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <Instagram className="w-4 h-4" />
                <span>Watch Reel Directly on Instagram ↗</span>
              </a>
              <p className="text-[10px] text-center text-[#86868B]">
                Opens @bingooo.co.in in the Instagram App or Web
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
