import React, { useState } from 'react';
import {
  Instagram,
  ExternalLink,
  Play,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Check,
  Copy,
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
  badge: string;
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
      title: 'Premier 240 GSM Oversized T-Shirts Drop',
      category: 'drops',
      views: '74.2K',
      likes: '5,820',
      comments: '342',
      duration: '0:28',
      badge: '240 GSM Drop',
      caption: 'India\'s premier 240 GSM heavyweight combed cotton oversized tees. Zero shrinkage, drop-shoulder luxury drape. Available in-store at Srikakulam flagship & online at bingooo.co.in. #Bingooo #240GSM #OversizedTee #Srikakulam',
      audioTrack: 'Original Audio - BINGOOO Street Beats',
      coverGradient: 'from-amber-950/80 via-neutral-900 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-2',
      title: 'Custom Studio: Crafting 240 GSM Custom Tees',
      category: 'drops',
      views: '128.5K',
      likes: '9,430',
      comments: '581',
      duration: '0:42',
      badge: 'Custom Atelier',
      caption: 'Behind the scenes in our custom print studio: high-density screen printing on premium 240 GSM cotton. Create your bespoke oversized tee with us. #CustomTee #BingoooStudio #Streetwear',
      audioTrack: 'Store Vibe Beats - Luxury Lounge',
      coverGradient: 'from-blue-950/80 via-neutral-900 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-3',
      title: 'Heavyweight 320 GSM French Terry Hoodies',
      category: 'outfits',
      views: '62.9K',
      likes: '4,610',
      comments: '219',
      duration: '0:35',
      badge: 'Heavyweight Hoodies',
      caption: 'Structured double-layered hood, ribbed cuffs, and heavyweight French Terry cotton. The signature winter streetwear piece from Bingooo. #BingoooAtelier #HeavyweightHoodie #Srikakulam',
      audioTrack: 'Lo-Fi Chill Hop - Sunday Vibe',
      coverGradient: 'from-emerald-950/80 via-neutral-900 to-black',
      instagramUrl: 'https://www.instagram.com/bingooo.co.in/reels/'
    },
    {
      id: 'reel-4',
      title: 'Srikakulam Flagship & Spin-to-Win In-Store Claim',
      category: 'winners',
      views: '95.4K',
      likes: '7,380',
      comments: '462',
      duration: '0:30',
      badge: 'Flagship Store',
      caption: 'Live from our NH16 Srikakulam boutique! Verified customer spun the monthly wheel on their phone and redeemed their instant 20% discount coupon in person. #SpinAndWin #BingoooMensWear #Srikakulam',
      audioTrack: 'Victory Horns - Celebration Beat',
      coverGradient: 'from-rose-950/80 via-neutral-900 to-black',
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
      badge: 'Formal Suits',
      caption: 'Elevate your festive look. Tailored Italian silhouette blazers, stretch tuxedo shirts, and formal trousers crafted for perfection. #WeddingSeason #MensBlazer #Bingooo',
      audioTrack: 'Cinematic Fashion Pulse - Night Vibe',
      coverGradient: 'from-purple-950/80 via-neutral-900 to-black',
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
      badge: 'Premium Quality',
      caption: 'Touch and feel the difference. Zero shrinkage, biowashed 260 GSM pique cotton with structured rib collars that never roll up. #MensWear #QualityFirst #Srikakulam',
      audioTrack: 'Minimal Electronic - Pure Bass',
      coverGradient: 'from-cyan-950/80 via-neutral-900 to-black',
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
      {/* Profile Header Card */}
      <div className="apple-glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-white/[0.15] shrink-0">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-1 overflow-hidden border border-white/[0.1]">
              <span className="text-2xl sm:text-3xl font-bold text-white font-montserrat">
                B
              </span>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-3.5 text-center md:text-left flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>bingooo.co.in</span>
                <span className="inline-flex items-center text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full border border-[#0071E3]/20">
                  Verified
                </span>
              </h1>
              <span className="text-xs text-[#86868B]">
                Official Instagram Channel
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-xl leading-relaxed">
              Srikakulam's premier men's fashion boutique 📍 NH16, Kushalpuram. Oversized Tees, Cuban Shirts, Selvedge Denim, Korean Pants & Suits.
            </p>

            {/* Profile Statistics */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-xs text-[#86868B] pt-1">
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-primary text-xs inline-flex items-center space-x-1.5"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Follow @bingooo.co.in on Instagram ↗</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
              </a>

              <button
                type="button"
                onClick={handleCopyHandle}
                className="apple-button-secondary inline-flex items-center space-x-1.5 text-xs text-white hover:text-white"
              >
                {copiedHandle ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#30D158]" />
                    <span className="text-[#30D158]">Handle Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#86868B]" />
                    <span>Copy @bingooo.co.in</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reels Section Header & Filter Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Featured Reels & Outfit Drops
            </h2>
            <p className="text-xs text-[#86868B] mt-0.5">
              Direct from @bingooo.co.in
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Reels' },
              { id: 'drops', label: 'New Drops' },
              { id: 'store', label: 'Store Tour' },
              { id: 'outfits', label: 'Style Guides' },
              { id: 'winners', label: 'Spin Winners' },
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
                className="group apple-glass-card rounded-2xl overflow-hidden cursor-pointer relative flex flex-col transition-all duration-300 hover:border-white/20 select-none"
              >
                {/* 9:14 Aspect Ratio Cover Area */}
                <div className={`relative w-full aspect-[9/14] bg-gradient-to-b ${reel.coverGradient} p-4 flex flex-col justify-between overflow-hidden`}>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {reel.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/40 text-gray-300">
                      {reel.duration}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all">
                    <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#0071E3] transition">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-xs text-white/90">
                    <span className="flex items-center space-x-1">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{reel.views}</span>
                    </span>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => toggleLike(reel.id, e)}
                        className="hover:scale-110 transition flex items-center space-x-1"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#FF3B30] text-[#FF3B30]' : 'text-white'}`} />
                        <span className="text-[11px]">{reel.likes}</span>
                      </button>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{reel.comments}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reel Caption */}
                <div className="p-4 space-y-2.5 bg-black/40 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1 group-hover:text-[#0071E3] transition">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-[#86868B] line-clamp-2 mt-1 leading-relaxed">
                      {reel.caption}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#0071E3] font-medium flex items-center space-x-1">
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Watch Preview</span>
                    </span>
                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#86868B] hover:text-white transition flex items-center space-x-1"
                    >
                      <span>Open Instagram</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Player */}
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

            <div className={`relative aspect-[9/13] bg-gradient-to-b ${selectedReel.coverGradient} p-5 flex flex-col justify-between`}>
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
                href={selectedReel.instagramUrl}
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
    </div>
  );
};
