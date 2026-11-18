import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Coins,
  Users,
  Gift,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Instagram,
  ExternalLink,
  Award,
  Cake,
  ArrowUpRight
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Apple-style Glass Welcome Hero Banner */}
      <div className="apple-glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left z-10">
          <span className="apple-badge">
            BINGOOO Rewards Club
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            One Club. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0071E3] via-[#409CFF] to-[#98C7FF] bg-clip-text text-transparent">
              Endless Rewards.
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] max-w-lg leading-relaxed">
            Srikakulam's premier men's fashion rewards program. Earn BINGOOO Coins, enjoy monthly Spin & Win, scratch cards, and in-store discounts.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-[#86868B]">
            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">Spin & Win</span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">Coins Wallet</span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">Scratch Cards</span>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">Birthday Passes</span>
          </div>
        </div>

        {/* Quick Balance Widget */}
        <div className="apple-glass-card rounded-2xl p-6 text-center space-y-2 shrink-0 min-w-[220px] z-10 border border-white/[0.1] bg-white/[0.03]">
          <span className="text-[11px] text-[#86868B] uppercase tracking-wider block font-medium">
            Available Coins
          </span>
          <div className="flex items-center justify-center space-x-2 py-1">
            <Coins className="w-5 h-5 text-[#F5A623]" />
            <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {wallet ? wallet.availableBalance : '0'}
            </span>
          </div>
          <Link
            to="/club/wallet"
            className="apple-button-primary block text-xs py-2 w-full text-center"
          >
            Open Coins Wallet
          </Link>
        </div>
      </div>

      {/* Instagram Spotlight Card */}
      <div className="apple-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#E1306C]/20 bg-gradient-to-r from-[#E1306C]/10 via-[#833AB4]/5 to-transparent">
        <div className="flex items-center space-x-4 text-center md:text-left flex-col md:flex-row">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] p-[2px] shrink-0 shadow-lg shadow-[#E1306C]/20">
            <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center">
              <Instagram className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Follow @bingooo.co.in on Instagram
              </h3>
              <span className="text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
                Official
              </span>
            </div>
            <p className="text-xs text-[#86868B] max-w-lg">
              Explore new outfit drops, customer styling reels, store walkthroughs, and tag us to win 200 bonus BINGOOO Coins!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/instagram"
            className="apple-button-primary text-xs inline-flex items-center space-x-1.5"
          >
            <span>Watch Reels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://www.instagram.com/bingooo.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="apple-button-secondary text-xs inline-flex items-center space-x-1.5 text-white"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
            <span>Open App ↗</span>
          </a>
        </div>
      </div>

      {/* Program Privileges Grid */}
      <div className="space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Club Privileges
          </h2>
          <p className="text-xs text-[#86868B] mt-1">
            Unlock exclusive rewards for your visits to BINGOOO Men's Wear in Srikakulam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tile 1: Monthly Spin & Win */}
          <Link
            to="/spin"
            className="apple-glass-card rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                spinElig?.isEligible ? 'bg-[#30D158]/10 text-[#30D158]' : 'bg-white/[0.06] text-[#86868B]'
              }`}>
                {spinElig?.isEligible ? 'Ready to Spin' : 'Played this month'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#0071E3] transition">
                Monthly Spin & Win
              </h3>
              <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                One guaranteed spin chance per calendar month! Win up to 20% OFF or complimentary store gifts.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-[#0071E3] flex items-center space-x-1">
              <span>Spin the wheel</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 2: BINGOOO Coins Wallet */}
          <Link
            to="/club/wallet"
            className="apple-glass-card rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <span className="text-[11px] font-medium text-[#F5A623]">
                {wallet ? `${wallet.availableBalance} Coins` : '0 Coins'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#F5A623] transition">
                Coins Wallet & Ledger
              </h3>
              <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                Earn 1 Coin per ₹10 spent in store. Redeem Coins for up to ₹350 instant discount passes on fashion wear.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-[#F5A623] flex items-center space-x-1">
              <span>View ledger & redeem</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 3: Refer & Earn */}
          <Link
            to="/club/refer"
            className="apple-glass-card rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#30D158]/10 text-[#30D158] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <span className="text-[10px] font-medium text-[#30D158] bg-[#30D158]/10 px-2 py-0.5 rounded-full">
                +50 Coins / Friend
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#30D158] transition">
                Refer & Earn Program
              </h3>
              <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                Share your invite code with friends. They receive 5% OFF, and you get 50 bonus Coins on their purchase.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-[#30D158] flex items-center space-x-1">
              <span>Get invite link</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 4: Spin Scratch Card */}
          <Link
            to="/club/scratch"
            className="apple-glass-card rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center font-bold text-sm">
                04
              </div>
              <span className="text-[10px] font-medium text-[#AF52DE] bg-[#AF52DE]/10 px-2 py-0.5 rounded-full">
                Interactive Touch
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#AF52DE] transition">
                Spin Scratch Card
              </h3>
              <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                Scratch off the interactive golden layer with your finger to reveal your monthly discount code and prizes.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-[#AF52DE] flex items-center space-x-1">
              <span>Scratch to reveal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 5: Annual Birthday Pass */}
          <Link
            to="/club/birthday"
            className="apple-glass-card rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FF2D55]/10 text-[#FF2D55] flex items-center justify-center font-bold text-sm">
                05
              </div>
              <span className="text-[10px] font-medium text-[#FF2D55] bg-[#FF2D55]/10 px-2 py-0.5 rounded-full">
                50 Coins + 10%
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#FF2D55] transition">
                Annual Birthday Pass
              </h3>
              <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                Save your birthday month. Enjoy 50 bonus Coins plus an exclusive 10% in-store discount pass every year.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-[#FF2D55] flex items-center space-x-1">
              <span>Claim birthday pass</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 6: My Vouchers */}
          <Link
            to="/rewards"
            className="apple-glass-card rounded-3xl p-6 hover:border-white/20 transition-all duration-300 group space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.08] text-white flex items-center justify-center font-bold text-sm">
                06
              </div>
              <span className="text-[10px] font-medium text-white/80 bg-white/[0.06] px-2 py-0.5 rounded-full">
                Saved Passes
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-white transition">
                My Reward Vouchers
              </h3>
              <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                View all your claimed discount codes and gift vouchers ready for presentation to the cashier.
              </p>
            </div>
            <div className="pt-2 text-xs font-medium text-white flex items-center space-x-1">
              <span>View vouchers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
