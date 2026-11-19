import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Gift,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Instagram,
  Check,
  ExternalLink,
  Star
} from 'lucide-react';
import { SpinWheel } from '../components/wheel/SpinWheel';
import { InstagramFollowGateModal } from '../components/wheel/InstagramFollowGateModal';
import { GoogleReviewModal } from '../components/loyalty/GoogleReviewModal';
import { ApiClient } from '../services/api.service';

export const SpinPage: React.FC = () => {
  const navigate = useNavigate();

  const [eligibility, setEligibility] = useState<any>(null);
  const [wheelSegments, setWheelSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinResult, setSpinResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [googleReviewModalOpen, setGoogleReviewModalOpen] = useState(false);

  // Mandatory Instagram Follow Gate
  const [isInstagramFollowed, setIsInstagramFollowed] = useState<boolean>(() => {
    return localStorage.getItem('bingooo_insta_followed') === 'true';
  });
  const [instaHandle, setInstaHandle] = useState<string>(() => {
    return localStorage.getItem('bingooo_insta_handle') || '';
  });
  const [showInstagramGateModal, setShowInstagramGateModal] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configRes, eligRes] = await Promise.all([
        ApiClient.getWheelConfig(),
        ApiClient.checkEligibility()
      ]);
      setWheelSegments(configRes.segments || []);
      setEligibility(eligRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Live countdown to next month 1st midnight IST
  useEffect(() => {
    if (!eligibility || eligibility.isEligible || !eligibility.nextEligibleAt) return;

    const targetTime = new Date(eligibility.nextEligibleAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        setCountdown('Unlocked! Refreshing...');
        loadData();
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eligibility]);

  // Intercept spin click if Instagram is not yet followed
  const handleBeforeSpinClick = (): boolean => {
    if (!isInstagramFollowed) {
      setShowInstagramGateModal(true);
      return false;
    }
    return true;
  };

  const handleInstagramVerified = (handle: string) => {
    setIsInstagramFollowed(true);
    setInstaHandle(handle);
  };

  const handleSpinRequest = async () => {
    const idempotencyKey = `spin_${Date.now()}_${Math.random()}`;
    const result = await ApiClient.executeSpin(idempotencyKey);
    setSpinResult(result);
    // Refresh eligibility state
    const eligRes = await ApiClient.checkEligibility();
    setEligibility(eligRes);

    return {
      segmentIndex: result.segmentIndex,
      isWin: result.isWin,
      prizeName: result.prizeName
    };
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Monthly Lock Status Banner */}
      {eligibility && !eligibility.isEligible && (
        <div className="apple-glass-card rounded-3xl p-6 sm:p-8 text-center space-y-4 border border-white/10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.06] text-[#A1A1A6] text-xs font-mono font-medium border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Monthly Chance Committed • {eligibility.periodKey}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            You Have Already Played This Month
          </h3>

          <p className="text-xs sm:text-sm text-[#86868B] max-w-lg mx-auto leading-relaxed">
            Per BINGOOO Club rules, members receive strictly <strong className="text-white font-medium">one committed spin per calendar month</strong>.
            Your next free spin unlocks automatically on the 1st of next month.
          </p>

          {countdown && (
            <div className="inline-block p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-[#86868B] mb-1">
                Next Free Spin Unlocks In
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                {countdown}
              </span>
            </div>
          )}

          {eligibility.currentResult?.rewardCode && (
            <div className="pt-2">
              <Link
                to={`/reward/${eligibility.currentResult.rewardCode}`}
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-[#0071E3] hover:underline"
              >
                <span>View active reward: {eligibility.currentResult.rewardCode}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Google Review Bonus Nudge */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setGoogleReviewModalOpen(true)}
              className="inline-flex items-center space-x-2 text-xs text-amber-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3.5 py-2 rounded-xl border border-white/10 transition"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Review BINGOOO on Google Maps to earn +75 Coins →</span>
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Instagram Verification Banner */}
      <div className={`apple-glass-card rounded-2xl p-4 sm:p-5 border transition-all ${
        isInstagramFollowed
          ? 'border-[#30D158]/30 bg-[#30D158]/5'
          : 'border-white/10 bg-white/[0.02]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isInstagramFollowed
                ? 'bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30'
                : 'bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white p-[2px]'
            }`}>
              {isInstagramFollowed ? (
                <Check className="w-5 h-5 text-[#30D158]" />
              ) : (
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  {isInstagramFollowed
                    ? 'Instagram Follow Verified'
                    : 'Mandatory: Follow @bingooo.co.in on Instagram'}
                </h4>
                {isInstagramFollowed && (
                  <span className="text-[10px] font-medium text-[#30D158] bg-[#30D158]/15 px-2 py-0.5 rounded-full border border-[#30D158]/20">
                    Spin Unlocked
                  </span>
                )}
              </div>
              <p className="text-xs text-[#86868B] mt-0.5">
                {isInstagramFollowed
                  ? `Verified as ${instaHandle || '@follower'}. You're eligible to spin the wheel!`
                  : 'Follow our official Instagram account to activate the wheel and claim store rewards.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {isInstagramFollowed ? (
              <button
                type="button"
                onClick={() => setShowInstagramGateModal(true)}
                className="apple-button-secondary text-xs text-[#86868B] hover:text-white"
              >
                <span>Edit Handle</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowInstagramGateModal(true)}
                className="apple-button-primary text-xs inline-flex items-center space-x-1.5"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Follow & Unlock Spin ↗</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Wheel Stage */}
      <div className="apple-glass-card rounded-3xl p-6 sm:p-10 flex flex-col items-center relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.06] text-[#A1A1A6] text-xs font-mono font-medium border border-white/10">
            <Sparkles className="w-3 h-3 text-[#0071E3]" />
            <span>Monthly Wheel • Srikakulam Flagship</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Spin & Win
          </h2>
          <p className="text-xs sm:text-sm text-[#86868B] max-w-md mx-auto">
            Spin for 20% OFF, 10% OFF, 5% OFF, or Free In-Store Surprise Gifts redeemable at BINGOOO Men's Wear.
          </p>
        </div>

        {wheelSegments.length > 0 && (
          <SpinWheel
            segments={wheelSegments}
            onSpinRequest={handleSpinRequest}
            disabled={eligibility && !eligibility.isEligible}
            onBeforeSpinClick={handleBeforeSpinClick}
            isInstagramFollowed={isInstagramFollowed}
          />
        )}
      </div>

      {/* Result Modal */}
      {spinResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="apple-glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 border border-white/20 shadow-2xl relative bg-neutral-950">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border ${
              spinResult.isTryAgain
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : spinResult.isWin
                ? 'bg-[#0071E3]/15 border-[#0071E3]/30 text-[#0071E3]'
                : 'bg-white/10 border-white/20 text-white'
            }`}>
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-0.5 rounded-full border border-[#0071E3]/20">
                {spinResult.isTryAgain
                  ? 'Bonus Re-Spin Unlocked'
                  : spinResult.isWin
                  ? 'Congratulations Winner!'
                  : 'Thank You for Playing'}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white pt-2">
                {spinResult.prizeName}
              </h3>
              <p className="text-xs text-[#86868B] leading-relaxed">
                {spinResult.description}
              </p>
            </div>

            {/* Winning Voucher Display */}
            {spinResult.rewardCode && (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#86868B] block">
                  Official In-Store Voucher Code
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono text-2xl font-bold tracking-wider text-white">
                    {spinResult.rewardCode}
                  </span>
                  <button
                    onClick={() => copyCode(spinResult.rewardCode)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <span className="text-[11px] text-[#30D158] font-medium block">Code copied to clipboard!</span>}
                <p className="text-[10px] text-[#86868B] pt-1">
                  Valid for 30 days at BINGOOO Men's Wear, NH16, Kushalpuram, Srikakulam.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              {spinResult.isTryAgain && (
                <button
                  onClick={() => setSpinResult(null)}
                  className="apple-button-primary w-full text-xs py-3 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Spin Again Now</span>
                </button>
              )}

              {spinResult.rewardCode && (
                <Link
                  to={`/reward/${spinResult.rewardCode}`}
                  className="apple-button-primary w-full text-xs py-3 text-center"
                >
                  View Reward Voucher →
                </Link>
              )}

              {!spinResult.isTryAgain && !spinResult.isWin && (
                <Link
                  to="/club"
                  className="apple-button-secondary w-full text-xs py-3 text-center text-white hover:text-white"
                >
                  Visit Rewards Club & Coins →
                </Link>
              )}

              <button
                onClick={() => setSpinResult(null)}
                className="apple-button-secondary w-full text-xs py-2.5 text-[#86868B] hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Follow Verification Gate Modal */}
      <InstagramFollowGateModal
        isOpen={showInstagramGateModal}
        onClose={() => setShowInstagramGateModal(false)}
        onVerified={handleInstagramVerified}
      />

      {/* Google Maps Review Modal */}
      <GoogleReviewModal
        isOpen={googleReviewModalOpen}
        onClose={() => setGoogleReviewModalOpen(false)}
      />
    </div>
  );
};
