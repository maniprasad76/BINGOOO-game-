import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Gift, Calendar, CheckCircle2, Clock, MapPin, Copy, ShieldCheck, ArrowLeft } from 'lucide-react';
import { ApiClient } from '../services/api.service';

export const RewardDetailPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [reward, setReward] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    ApiClient.getRewardByCode(code)
      .then(setReward)
      .catch((err) => setError(err.message || 'Reward voucher not found'))
      .finally(() => setLoading(false));
  }, [code]);

  const copyCode = () => {
    if (!reward?.code) return;
    navigator.clipboard.writeText(reward.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400 text-sm">Loading voucher...</div>;
  }

  if (error || !reward) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Voucher Not Found</h2>
        <p className="text-xs text-gray-400">{error || 'Please check the coupon code.'}</p>
        <Link to="/rewards" className="text-xs text-[#C91F32] font-semibold underline">
          Back to My Rewards
        </Link>
      </div>
    );
  }

  const isRedeemed = reward.status === 'REDEEMED';
  const isExpired = reward.status === 'EXPIRED';

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link to="/rewards" className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Rewards</span>
      </Link>

      {/* Pass Card */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Pass Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <div>
            <span className="text-lg font-black tracking-wider text-white font-display">
              BINGO<span className="text-[#C91F32]">OO</span>
            </span>
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest">
              Store Reward Voucher
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isRedeemed
                ? 'bg-gray-800 text-gray-400'
                : isExpired
                ? 'bg-red-950 text-red-400'
                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}
          >
            {reward.status}
          </span>
        </div>

        {/* Prize Main */}
        <div className="text-center space-y-2 py-2">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            {reward.isGift ? 'GIFT PASS' : 'DISCOUNT PASS'}
          </span>
          <h3 className="text-2xl font-black font-display text-white uppercase">
            {reward.prize.name}
          </h3>
          <p className="text-xs text-gray-400">
            {reward.prize.description}
          </p>
        </div>

        {/* Big Code Block */}
        <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#2A2A2A] text-center space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 block">
            Scan or Present to Cashier
          </span>
          <div className="flex items-center justify-center space-x-3">
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#D4AF37] tracking-widest">
              {reward.code}
            </span>
            <button
              onClick={copyCode}
              className="p-2 rounded-xl bg-[#222222] hover:bg-[#333333] text-gray-300 transition"
              title="Copy voucher code"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && <span className="text-[11px] text-emerald-400 font-semibold block">Copied!</span>}
        </div>

        {/* Store Redemption Instructions */}
        <div className="space-y-2 text-xs text-gray-400 border-t border-[#2A2A2A] pt-4">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-[#C91F32] shrink-0 mt-0.5" />
            <span>Redeemable only at BINGOOO Men's Wear, Main Road, Srikakulam.</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Valid through: {new Date(reward.expiresAt).toLocaleDateString()}</span>
          </div>
        </div>

        {isRedeemed && reward.redemption && (
          <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-400 text-center">
            Redeemed on {new Date(reward.redemption.redeemedAt).toLocaleString()} by staff ({reward.redemption.staff?.name || 'Store Staff'})
          </div>
        )}
      </div>
    </div>
  );
};
