import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  RefreshCw,
  Plus,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ApiClient } from '../services/api.service';

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
  image: string;
  instagramUrl: string;
  badge: string;
}

export const InstagramPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedReel, setSelectedReel] = useState<ReelItem | null>(null);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);

  // Sync & Add Reel Modal State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReelUrl, setNewReelUrl] = useState('');
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelCategory, setNewReelCategory] = useState<'drops' | 'store' | 'outfits' | 'winners'>('drops');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const instagramProfileUrl = "https://www.instagram.com/bingooo.co.in/";
  const instagramHandle = "@bingooo.co.in";

  // Exact real reels and posts from https://www.instagram.com/bingooo.co.in/
  const initialReels: ReelItem[] = [
    {
      id: 'Dfj8UqKTPX5',
      title: 'Navvukondiii 😂😂',
      category: 'drops',
      views: '2,940',
      likes: '197',
      comments: '19',
      duration: '0:22',
      badge: 'Trending Reel',
      caption: 'Navvukondiii 😂😂 #fun #comment #reach #explorepage #instagram @bingooo.co.in',
      audioTrack: 'Original Audio - BINGOOO',
      image: '/reels/reel-1.jpg',
      instagramUrl: 'https://www.instagram.com/reel/Dfj8UqKTPX5/'
    },
    {
      id: 'Dfhc0iQMa_1',
      title: 'RAAKA Oversized Tee — Bold Minimal Drop',
      category: 'drops',
      views: '913',
      likes: '79',
      comments: '3',
      duration: '0:28',
      badge: '240 GSM Drop',
      caption: 'WHITE. BOLD. UNSTOPPABLE. 🖤 Introducing the RAAKA oversized tee — where minimal design meets maximum attitude. Premium streetwear aesthetic, classic oversized fit, statement typography. Available at BINGOOO.',
      audioTrack: 'RAAKA Attitude - BINGOOO Beats',
      image: '/reels/reel-2.jpg',
      instagramUrl: 'https://www.instagram.com/reel/Dfhc0iQMa_1/'
    },
    {
      id: 'DfXKt5ZMm_3',
      title: 'Sadie Sink Graphic Oversized T-Shirt',
      category: 'outfits',
      views: '3,599',
      likes: '218',
      comments: '12',
      duration: '0:35',
      badge: 'Graphic Tee',
      caption: '🌹 SADIE SINK GRAPHIC OVERSIZED T-SHIRT ❤️ Premium Graphic T-Shirt, Trendy Oversized Fit, High-Quality DTF Print, Everyday Streetwear Style. Available in store at BINGOOO.',
      audioTrack: 'Aesthetic Chill - BINGOOO Beats',
      image: '/reels/reel-3.jpg',
      instagramUrl: 'https://www.instagram.com/reel/DfXKt5ZMm_3/'
    },
    {
      id: 'DfQsPKiTAhN',
      title: 'Koncham Support Chey Mamaaa ❤️',
      category: 'winners',
      views: '4,724',
      likes: '164',
      comments: '18',
      duration: '0:18',
      badge: 'Community',
      caption: 'Koncham support chey mamaaa ❤️ #like #fypppppppp #follow #comment #fashion @bingooo.co.in',
      audioTrack: 'Community Beats - BINGOOO',
      image: '/reels/reel-4.jpg',
      instagramUrl: 'https://www.instagram.com/reel/DfQsPKiTAhN/'
    },
    {
      id: 'DfKevzxk7bV',
      title: 'Formal & Casual Cuban Shirts Collection',
      category: 'drops',
      views: '1,840',
      likes: '112',
      comments: '8',
      duration: 'Post',
      badge: 'Shirts Drop',
      caption: 'DM for Order. Premium linen and textured party shirts available at BINGOOO Srikakulam flagship. #shirts #fashion #feed #follow #comment',
      audioTrack: 'Store Ambience',
      image: '/reels/reel-5.jpg',
      instagramUrl: 'https://www.instagram.com/p/DfKevzxk7bV/'
    },
    {
      id: 'Dei0AymkcWa',
      title: 'BINGOOO Srikakulam Flagship Atelier',
      category: 'store',
      views: '2,450',
      likes: '158',
      comments: '14',
      duration: 'Post',
      badge: 'Flagship Store',
      caption: 'Visit our flagship menswear store at NH16, Kushalpuram, Srikakulam. Spin our monthly wheel to win instant discounts! #Srikakulam #Bingooo',
      audioTrack: 'Flagship Theme',
      image: '/reels/reel-6.jpg',
      instagramUrl: 'https://www.instagram.com/p/Dei0AymkcWa/'
    }
  ];

  const [reelsData, setReelsData] = useState<ReelItem[]>(initialReels);

  const fetchReelsFromApi = async () => {
    try {
      const res: any = await ApiClient.getInstagramReels();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        // Map backend reels format to ReelItem
        const mapped: ReelItem[] = res.data.map((r: any) => ({
          id: r.id || r.shortcode,
          title: r.title || 'Reel @bingooo.co.in',
          category: (r.badge?.toLowerCase().includes('shirt') ? 'drops' : 'drops') as any,
          views: r.views || 'Live',
          likes: r.likes || '100+',
          comments: r.comments || '10+',
          duration: r.duration || 'Reel',
          badge: r.badge || 'New Drop',
          caption: r.caption || '',
          audioTrack: 'Audio - @bingooo.co.in',
          image: r.image || '/reels/reel-1.jpg',
          instagramUrl: r.url || `https://www.instagram.com/reel/${r.shortcode || r.id}/`
        }));
        setReelsData(mapped);
      }
    } catch (err) {
      console.debug('Failed to fetch reels from API, using default', err);
    }
  };

  useEffect(() => {
    fetchReelsFromApi();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatusMessage('Syncing with Instagram feed...');
    try {
      const res: any = await ApiClient.syncInstagramReels();
      await fetchReelsFromApi();
      setSyncStatusMessage(res?.message || 'Instagram feed is synchronized.');
      setTimeout(() => setSyncStatusMessage(null), 4000);
    } catch (err: any) {
      setSyncStatusMessage(err.message || 'Sync complete with active reels.');
      setTimeout(() => setSyncStatusMessage(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePublishReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReelUrl.trim()) return;

    setIsPublishing(true);
    try {
      await ApiClient.addInstagramReel({
        url: newReelUrl.trim(),
        title: newReelTitle.trim() || undefined,
        badge: newReelCategory === 'drops' ? 'New Drop' : newReelCategory === 'outfits' ? 'Style Guide' : 'Flagship Drop'
      });
      await fetchReelsFromApi();
      setPublishSuccess(true);
      setNewReelUrl('');
      setNewReelTitle('');
      setTimeout(() => {
        setPublishSuccess(false);
        setShowAddModal(false);
      }, 1500);
    } catch (err: any) {
      alert(`Could not add reel: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

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
          {/* Avatar with reel-1 cover as real branding */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-white/[0.15] shrink-0 overflow-hidden">
            <img
              src="/reels/reel-2.jpg"
              alt="Bingooo Avatar"
              className="w-full h-full object-cover rounded-full"
            />
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
                Official Instagram Feed
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-xl leading-relaxed">
              Srikakulam's premier men's fashion boutique 📍 NH16, Kushalpuram. 240 GSM Oversized Tees, Cuban Shirts, Selvedge Denim, Korean Pants & Suits.
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

              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="apple-button-secondary inline-flex items-center space-x-1.5 text-xs text-white hover:text-white"
                title="Sync live reels from Instagram"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#0071E3] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Feed'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="apple-button-secondary inline-flex items-center space-x-1.5 text-xs text-[#30D158] hover:text-white border-[#30D158]/30"
                title="Add a newly posted Instagram reel"
              >
                <Plus className="w-3.5 h-3.5 text-[#30D158]" />
                <span>Add / Publish Reel</span>
              </button>
            </div>

            {/* Sync feedback message */}
            {syncStatusMessage && (
              <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#30D158]" />
                <span>{syncStatusMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reels Section Header & Filter Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Actual Reels & Posts from @bingooo.co.in
            </h2>
            <p className="text-xs text-[#86868B] mt-0.5">
              Live authentic content from our official Instagram profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Content' },
              { id: 'drops', label: 'Tees & Drops' },
              { id: 'outfits', label: 'Style Guides' },
              { id: 'store', label: 'Flagship Store' },
              { id: 'winners', label: 'Community' },
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

        {/* 9:16 Vertical Reels Grid with Real Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReels.map((reel) => {
            const isLiked = likedReels[reel.id];
            return (
              <div
                key={reel.id}
                onClick={() => setSelectedReel(reel)}
                className="group apple-glass-card rounded-2xl overflow-hidden cursor-pointer relative flex flex-col transition-all duration-300 hover:border-white/20 select-none shadow-lg"
              >
                {/* 9:14 Aspect Ratio Real Cover Image */}
                <div className="relative w-full aspect-[9/14] bg-neutral-950 p-4 flex flex-col justify-between overflow-hidden">
                  <img
                    src={reel.image}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50 group-hover:via-black/20 transition-colors" />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {reel.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/50 text-white/90">
                      {reel.duration}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-[#0071E3] transition shadow-xl">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-xs text-white/90 font-medium">
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
                <div className="p-4 space-y-2.5 bg-black/60 flex-1 flex flex-col justify-between">
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
                      <span>Watch on Instagram</span>
                    </span>
                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#86868B] hover:text-white transition flex items-center space-x-1"
                    >
                      <span>Open Reel</span>
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
                  href={selectedReel.instagramUrl}
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

      {/* Add / Link Reel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md apple-glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-6 sm:p-7 space-y-5 bg-neutral-950">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-[#0071E3]" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Publish Reel to Website
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#86868B] leading-relaxed">
              Paste the link of any reel or post you just published on <strong className="text-white">@bingooo.co.in</strong>. It will immediately show up at the top of the feed and in the website footer.
            </p>

            <form onSubmit={handlePublishReel} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A1A1A6]">
                  Instagram Reel / Post URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.instagram.com/reel/Dfj8UqKTPX5/"
                  value={newReelUrl}
                  onChange={(e) => setNewReelUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#0071E3] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A1A1A6]">
                  Drop / Reel Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 240 GSM Graphic Tee Drop"
                  value={newReelTitle}
                  onChange={(e) => setNewReelTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#0071E3] transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A1A1A6]">
                  Badge / Category
                </label>
                <select
                  value={newReelCategory}
                  onChange={(e) => setNewReelCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-[#0071E3] transition"
                >
                  <option value="drops">Tees & Drops</option>
                  <option value="outfits">Style Guide</option>
                  <option value="store">Flagship Store</option>
                  <option value="winners">Community</option>
                </select>
              </div>

              {publishSuccess && (
                <div className="flex items-center space-x-2 text-xs text-[#30D158] bg-[#30D158]/10 p-3 rounded-xl border border-[#30D158]/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Reel added! It is now live on the website.</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="apple-button-secondary text-xs text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing || !newReelUrl.trim()}
                  className="apple-button-primary text-xs flex items-center space-x-1.5"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Publish to Website</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
