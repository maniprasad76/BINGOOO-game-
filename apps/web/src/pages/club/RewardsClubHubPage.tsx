import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Coins,
  Users,
  QrCode,
  Gift,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  Copy,
  Clock
} from 'lucide-react';
import { ApiClient } from '../../services/api.service';

export const RewardsClubHubPage: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [refSummary, setRefSummary] = useState<any>(null);
  const [bdayStatus, setBdayStatus] = useState<any>(null);
  const [spinElig, setSpinElig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiClient.getLoyaltyWallet(),
      ApiClient.getReferralSummary(),
      ApiClient.getBirthdayEligibility(),
      ApiClient.checkEligibility()
    ])
      .then(([w, r, b, s]) => {
        setWallet(w);
        setRefSummary(r);
        setBdayStatus(b);
        setSpinElig(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Bauhaus Constructivist Welcome Hero Banner */}
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#C91F32] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 text-center md:text-left z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1F1F1F] text-[#F5B700] border-2 border-[#F5B700] text-xs font-mono font-bold tracking-widest uppercase">
            <span className="w-2 h-2 bg-[#C91F32]" />
            <span>SYSTEM // BINGOOO REWARDS CLUB</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase leading-none">
            ONE CLUB. <span className="text-[#C91F32] underline decoration-[#F5B700] decoration-4">5 WAYS TO WIN.</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-sans leading-relaxed">
            Srikakulam's premier men's fashion rewards ecosystem. Earn BINGOOO Coins, enjoy monthly Spin & Win, refer friends, scan store QR codes, and celebrate your birthday in style!
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-gray-400">
            <span className="bg-[#1C1C1C] border border-[#333] px-2 py-0.5 text-white">#01 SPIN & WIN</span>
            <span className="bg-[#1C1C1C] border border-[#333] px-2 py-0.5 text-[#F5B700]">#02 COINS WALLET</span>
            <span className="bg-[#1C1C1C] border border-[#333] px-2 py-0.5 text-emerald-400">#03 REFERRAL</span>
            <span className="bg-[#1C1C1C] border border-[#333] px-2 py-0.5 text-purple-400">#04 STORE QR</span>
            <span className="bg-[#1C1C1C] border border-[#333] px-2 py-0.5 text-pink-400">#05 BIRTHDAY PASS</span>
          </div>
        </div>

        {/* Bauhaus Quick Stats Balance Widget */}
        <div className="bg-[#0A0A0A] border-2 border-white p-6 text-center space-y-2 shrink-0 min-w-[220px] z-10 shadow-[5px_5px_0px_0px_#F5B700]">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono block">
            AVAILABLE COINS
          </span>
          <div className="flex items-center justify-center space-x-2 py-1">
            <div className="w-7 h-7 bg-[#F5B700] text-black font-black flex items-center justify-center border border-white text-sm">
              ₹
            </div>
            <span className="text-4xl font-black font-display text-white">
              {wallet ? wallet.availableBalance : '—'}
            </span>
          </div>
          <Link
            to="/club/wallet"
            className="text-xs bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-bold uppercase tracking-wider block py-1.5 px-3 border border-white transition-all shadow-[2px_2px_0px_0px_#FFFFFF]"
          >
            OPEN WALLET →
          </Link>
        </div>
      </div>

      {/* 5 Primary Bauhaus Program Tiles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-[#282828] pb-3">
          <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wider text-white flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#C91F32]" />
            <span>5 EXCLUSIVE CLUB PRIVILEGES</span>
          </h2>
          <span className="text-xs font-mono text-[#F5B700] uppercase hidden sm:inline">
            // SRIKAKULAM STORE REWARDS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tile 1: Monthly Spin & Win */}
          <Link
            to="/spin"
            className="p-6 bg-[#161616] border-2 border-[#333333] hover:border-white hover:translate-x-1 hover:translate-y-1 transition-all group space-y-4 relative overflow-hidden shadow-[5px_5px_0px_0px_#C91F32]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#C91F32] border-2 border-white text-white flex items-center justify-center font-mono font-black text-sm">
                01
              </div>
              <span className={`px-2 py-0.5 border text-[10px] font-mono font-bold uppercase ${
                spinElig?.isEligible ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : 'bg-gray-900 text-gray-400 border-gray-700'
              }`}>
                {spinElig?.isEligible ? 'READY TO SPIN' : 'PLAYED THIS MONTH'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase font-display tracking-wide">
                Monthly Spin & Win
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                One guaranteed win per calendar month! Win Free Customised T-Shirts (₹3000+ bills), 20% OFF, 10% OFF, or Gifts.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-[#C91F32] flex items-center space-x-1 uppercase tracking-wider">
              <span>[ SPIN THE WHEEL NOW ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Tile 2: BINGOOO Coins Wallet */}
          <Link
            to="/club/wallet"
            className="p-6 bg-[#161616] border-2 border-[#333333] hover:border-white hover:translate-x-1 hover:translate-y-1 transition-all group space-y-4 relative overflow-hidden shadow-[5px_5px_0px_0px_#F5B700]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#F5B700] border-2 border-white text-black flex items-center justify-center font-mono font-black text-sm">
                02
              </div>
              <span className="text-xs font-mono font-bold text-[#F5B700] bg-[#1F1F1F] px-2 py-0.5 border border-[#444]">
                {wallet ? `${wallet.availableBalance} COINS` : '0 COINS'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase font-display tracking-wide">
                BINGOOO Coins Wallet
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Earn 1 Coin per ₹10 spend in store. Redeem Coins for up to ₹350 instant discount vouchers on fashion wear.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-[#F5B700] flex items-center space-x-1 uppercase tracking-wider">
              <span>[ REDEEM & VIEW LEDGER ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Tile 3: Refer & Earn */}
          <Link
            to="/club/refer"
            className="p-6 bg-[#161616] border-2 border-[#333333] hover:border-white hover:translate-x-1 hover:translate-y-1 transition-all group space-y-4 relative overflow-hidden shadow-[5px_5px_0px_0px_#16428C]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#16428C] border-2 border-white text-white flex items-center justify-center font-mono font-black text-sm">
                03
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-[#1F1F1F] px-2 py-0.5 border border-[#444]">
                +50 COINS/FRIEND
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase font-display tracking-wide">
                Refer & Earn Program
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Share your invite code. Friends get 5% OFF, and you receive 50 BINGOOO Coins on their first qualified purchase.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1 uppercase tracking-wider">
              <span>[ GET INVITE LINK ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Tile 4: Spin Scratch Card */}
          <Link
            to="/club/scratch"
            className="p-6 bg-[#161616] border-2 border-[#333333] hover:border-white hover:translate-x-1 hover:translate-y-1 transition-all group space-y-4 relative overflow-hidden shadow-[5px_5px_0px_0px_#F5B700]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#F5B700] border-2 border-white text-black flex items-center justify-center font-mono font-black text-sm">
                04
              </div>
              <span className="text-xs font-mono font-bold text-white bg-[#C91F32] px-2 py-0.5 border border-white">
                SCRATCH & REVEAL
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase font-display tracking-wide group-hover:text-[#F5B700] transition-colors">
                Spin Scratch Card
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Scratch off the golden foil to uncover your monthly Spin & Win prize, store discount voucher code, or claim your free spin!
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-[#F5B700] flex items-center space-x-1 uppercase tracking-wider">
              <span>[ SCRATCH TO REVEAL ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Tile 5: Birthday Rewards */}
          <Link
            to="/club/birthday"
            className="p-6 bg-[#161616] border-2 border-[#333333] hover:border-white hover:translate-x-1 hover:translate-y-1 transition-all group space-y-4 relative overflow-hidden shadow-[5px_5px_0px_0px_#F5B700]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-[#F5B700] border-2 border-white text-black flex items-center justify-center font-mono font-black text-sm">
                05
              </div>
              <span className="text-xs font-mono font-bold text-[#F5B700] bg-[#1F1F1F] px-2 py-0.5 border border-[#444]">
                50 COINS + 10%
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase font-display tracking-wide">
                Annual Birthday Pass
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Save your birthday month. Enjoy 50 bonus Coins plus an exclusive 10% in-store birthday discount pass every year.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-[#F5B700] flex items-center space-x-1 uppercase tracking-wider">
              <span>[ CLAIM BIRTHDAY PASS ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Tile 6: My Vouchers */}
          <Link
            to="/rewards"
            className="p-6 bg-[#161616] border-2 border-[#333333] hover:border-white hover:translate-x-1 hover:translate-y-1 transition-all group space-y-4 relative overflow-hidden shadow-[5px_5px_0px_0px_#FFFFFF]"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white border-2 border-black text-black flex items-center justify-center font-mono font-black text-sm">
                06
              </div>
              <span className="text-xs font-mono font-bold text-gray-300 bg-[#1F1F1F] px-2 py-0.5 border border-[#444]">
                ACTIVE PASSES
              </span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase font-display tracking-wide">
                My Reward Vouchers
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                View all your claimed discount codes, Free T-Shirt vouchers, and gift passes ready for redemption at the store.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono font-bold text-white flex items-center space-x-1 uppercase tracking-wider">
              <span>[ VIEW SAVED VOUCHERS ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
