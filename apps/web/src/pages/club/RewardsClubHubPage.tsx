import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Coins,
  Users,
  Gift,
  ArrowRight,
  Cake,
  Ticket,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Star
} from 'lucide-react';
import { ApiClient } from '../../services/api.service';
import { GoogleReviewModal } from '../../components/loyalty/GoogleReviewModal';

export const RewardsClubHubPage: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [refSummary, setRefSummary] = useState<any>(null);
  const [bdayStatus, setBdayStatus] = useState<any>(null);
  const [spinElig, setSpinElig] = useState<any>(null);
  const [googleReviewStatus, setGoogleReviewStatus] = useState<any>(null);
  const [googleReviewModalOpen, setGoogleReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      ApiClient.getLoyaltyWallet(),
      ApiClient.getReferralSummary(),
      ApiClient.getBirthdayEligibility(),
      ApiClient.checkEligibility(),
      ApiClient.getGoogleReviewStatus().catch(() => null)
    ])
      .then(([w, r, b, s, g]) => {
        setWallet(w);
        setRefSummary(r);
        setBdayStatus(b);
        setSpinElig(s);
        setGoogleReviewStatus(g);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Editorial Membership Header & Pass Card */}
      <div className="apple-glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center space-x-2 text-xs font-medium text-[#0071E3] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]" />
            <span>Official Customer Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Rewards Club
          </h1>
          <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
            Exclusive privileges for our Srikakulam flagship store. Earn BINGOOO Coins on every purchase, enjoy monthly spin rewards, and access in-store discount passes.
          </p>
        </div>

        {/* Minimalist Membership Pass Card */}
        <div className="w-full md:w-auto min-w-[240px] rounded-2xl p-5 border border-white/[0.1] bg-white/[0.04] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-medium">
              Coins Balance
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
              Active Member
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {wallet ? wallet.availableBalance : '0'}
            </span>
            <span className="text-xs text-[#86868B] font-medium">BINGOOO Coins</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/club/wallet"
              className="apple-button-secondary text-xs text-center py-2 text-white hover:text-white"
            >
              Ledger
            </Link>
            <Link
              to="/spin"
              className="apple-button-primary text-xs text-center py-2"
            >
              Spin Wheel
            </Link>
          </div>
        </div>
      </div>

      {/* Program Privileges Grid */}
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Member Privileges
            </h2>
            <p className="text-xs text-[#86868B] mt-0.5">
              Available benefits linked to your registered mobile number.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tile 1: Monthly Spin & Win */}
          <Link
            to="/spin"
            className="apple-glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                  spinElig?.isEligible ? 'bg-[#30D158]/10 text-[#30D158]' : 'bg-white/[0.06] text-[#86868B]'
                }`}>
                  {spinElig?.isEligible ? 'Spin Ready' : 'Claimed for Month'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#0071E3] transition">
                  Monthly Spin & Win
                </h3>
                <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                  One guaranteed chance per calendar month. Win up to 20% OFF or complimentary fashion gifts on checkout.
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-medium text-[#0071E3] flex items-center space-x-1">
              <span>Play spin wheel</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 2: Coins Wallet */}
          <Link
            to="/club/wallet"
            className="apple-glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-white flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-[#86868B]">
                  {wallet ? `${wallet.availableBalance} Coins` : '0 Coins'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-white transition">
                  Coins Wallet
                </h3>
                <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                  Earn 1 Coin per ₹10 spent in store. Redeem Coins directly for up to ₹350 instant discount passes.
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-medium text-white flex items-center space-x-1">
              <span>View balance and ledger</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 3: Scratch Card */}
          <Link
            to="/club/scratch"
            className="apple-glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
                  Interactive Foil
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#0071E3] transition">
                  Spin Scratch Card
                </h3>
                <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                  Scratch off the golden foil directly with your finger or pointer to reveal your monthly discount pass.
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-medium text-[#0071E3] flex items-center space-x-1">
              <span>Scratch to reveal</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 4: Referrals */}
          <Link
            to="/club/refer"
            className="apple-glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-[#30D158] bg-[#30D158]/10 px-2 py-0.5 rounded-full">
                  +50 Coins / Friend
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-white transition">
                  Refer Friends
                </h3>
                <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                  Share your invitation code. Friends receive 5% OFF, and you get 50 bonus Coins upon their qualifying purchase.
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-medium text-white flex items-center space-x-1">
              <span>Get invitation link</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 5: Birthday Pass */}
          <Link
            to="/club/birthday"
            className="apple-glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-white flex items-center justify-center">
                  <Cake className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-[#A1A1A6] bg-white/[0.06] px-2 py-0.5 rounded-full">
                  Annual Pass
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-white transition">
                  Birthday Pass
                </h3>
                <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                  Register your birth month. Receive 50 bonus Coins and an exclusive 10% in-store birthday coupon annually.
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-medium text-white flex items-center space-x-1">
              <span>Register birth month</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 6: Google Maps Review Bonus */}
          <div
            onClick={() => setGoogleReviewModalOpen(true)}
            className="apple-glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between space-y-4 cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  googleReviewStatus?.claimed
                    ? 'bg-[#30D158]/10 text-[#30D158]'
                    : 'bg-[#EA4335]/15 text-[#EA4335] font-semibold'
                }`}>
                  {googleReviewStatus?.claimed ? 'Claimed ✓' : '+75 Coins'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-white transition flex items-center gap-1.5">
                  <span>Google Maps Review</span>
                  <div className="flex items-center space-x-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                </h3>
                <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                  Review BINGOOO Men's Wear on Google Maps. Earn 75 instant Coins to convert into store discount vouchers.
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-medium text-[#EA4335] flex items-center space-x-1">
              <span>{googleReviewStatus?.claimed ? 'View review status' : 'Write review & claim 75 Coins'}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Tile 7: My Vouchers */}
          <Link
            to="/rewards"
            className="apple-glass-card rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-white flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-[#A1A1A6] bg-white/[0.06] px-2 py-0.5 rounded-full">
                  Stored Passes
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-white transition">
                  My Vouchers
                </h3>
                <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
                  View all active discount codes, gift passes, and redemption barcodes ready for cashier checkout.
                </p>
              </div>
            </div>
            <div className="pt-2 text-xs font-medium text-white flex items-center space-x-1">
              <span>View my vouchers</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Google Maps Review Modal */}
      <GoogleReviewModal
        isOpen={googleReviewModalOpen}
        onClose={() => setGoogleReviewModalOpen(false)}
        isAlreadyClaimed={googleReviewStatus?.claimed}
        onCoinsClaimed={(newBalance) => {
          setGoogleReviewStatus({ claimed: true, coinsEarned: 75 });
          setWallet((prev: any) => ({ ...prev, availableBalance: newBalance }));
        }}
      />
    </div>
  );
};
