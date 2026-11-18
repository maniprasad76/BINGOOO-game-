import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Gift, Calendar, CheckCircle2, Clock, MapPin, Copy, ShieldCheck, ArrowLeft, Check } from 'lucide-react';
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
    return <div className="text-center py-20 text-[#86868B] text-sm font-normal">Loading pass...</div>;
  }

  if (error || !reward) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-semibold text-white tracking-tight">Voucher Not Found</h2>
        <p className="text-xs text-[#86868B]">{error || 'Please check the coupon code.'}</p>
        <Link to="/rewards" className="text-xs text-[#0071E3] hover:underline font-medium inline-block pt-2">
          Back to My Vouchers
        </Link>
      </div>
    );
  }

  const isRedeemed = reward.status === 'REDEEMED';
  const isExpired = reward.status === 'EXPIRED';

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link to="/rewards" className="inline-flex items-center space-x-1.5 text-xs text-[#86868B] hover:text-[#F5F5F7] mb-6 transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to My Vouchers</span>
      </Link>

      {/* Apple Wallet-Style Pass Card */}
      <div className="apple-glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-6">
        {/* Pass Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <span className="text-base font-bold tracking-tight text-white">
              BINGO<span className="text-[#0071E3]">OO</span>
            </span>
            <span className="block text-[11px] text-[#86868B] font-normal tracking-normal mt-0.5">
              Official Store Pass
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-normal ${
              isRedeemed
                ? 'bg-white/[0.06] text-[#86868B]'
                : isExpired
                ? 'bg-[#FF453A]/10 text-[#FF453A]'
                : 'bg-[#30D158]/10 text-[#30D158]'
            }`}
          >
            {isRedeemed ? 'Redeemed' : isExpired ? 'Expired' : 'Active Pass'}
          </span>
        </div>

        {/* Prize Main */}
        <div className="text-center space-y-2 py-2">
          <span className="text-xs text-[#86868B] font-medium uppercase tracking-wider">
            {reward.isGift ? 'Gift Voucher' : 'Discount Voucher'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {reward.prize.name}
          </h3>
          <p className="text-xs text-[#86868B] max-w-xs mx-auto leading-relaxed">
            {reward.prize.description}
          </p>
        </div>

        {/* Minimal Code Block */}
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center space-y-2">
          <span className="text-[11px] text-[#86868B] block font-normal">
            Present to cashier at checkout
          </span>
          <div className="flex items-center justify-center space-x-3 pt-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-widest">
              {reward.code}
            </span>
            <button
              onClick={copyCode}
              className="p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-[#86868B] hover:text-white transition active:scale-95"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-[#30D158]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && <span className="text-[11px] text-[#30D158] font-medium block">Copied to clipboard</span>}
        </div>

        {/* Store Redemption Instructions */}
        <div className="space-y-2.5 text-xs text-[#86868B] border-t border-white/[0.08] pt-4">
          <div className="flex items-start space-x-2.5">
            <MapPin className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
            <span className="leading-relaxed text-[#A1A1A6]">
              Redeemable in person at BINGOOO Men's Wear, Main Road, Srikakulam.
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-[#86868B] shrink-0" />
            <span className="text-[#A1A1A6]">
              Valid through: {new Date(reward.expiresAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {isRedeemed && reward.redemption && (
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-[#86868B] text-center">
            Redeemed on {new Date(reward.redemption.redeemedAt).toLocaleString()} ({reward.redemption.staff?.name || 'Store Staff'})
          </div>
        )}
      </div>
    </div>
  );
};
