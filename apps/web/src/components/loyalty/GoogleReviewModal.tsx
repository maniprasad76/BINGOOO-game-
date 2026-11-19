import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Star,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  Coins,
  ArrowRight
} from 'lucide-react';
import { ApiClient } from '../../services/api.service';

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCoinsClaimed?: (newBalance: number) => void;
  isAlreadyClaimed?: boolean;
}

export const GoogleReviewModal: React.FC<GoogleReviewModalProps> = ({
  isOpen,
  onClose,
  onCoinsClaimed,
  isAlreadyClaimed = false
}) => {
  const [reviewerName, setReviewerName] = useState('');
  const [hasOpenedMaps, setHasOpenedMaps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Official BINGOOO Men's Wear Google Maps Search / Review Intent URL
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=BINGOOO+Men+Wear+NH16+Kushalpuram+Srikakulam';

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    setHasOpenedMaps(true);
    setErrorMessage(null);
  };

  const handleClaimCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await ApiClient.claimGoogleReview(reviewerName.trim() || undefined);
      if (res?.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSuccessMessage(res.message || '75 BINGOOO Coins added to your wallet!');
        if (onCoinsClaimed && res.newBalance !== undefined) {
          onCoinsClaimed(res.newBalance);
        }
        setTimeout(() => {
          onClose();
        }, 2200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not claim coins. Please make sure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md apple-glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-neutral-950 p-6 sm:p-7 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EA4335]/15 border border-[#EA4335]/30 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#EA4335]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Review on Google Maps
              </h3>
              <p className="text-[11px] text-[#86868B]">
                BINGOOO Flagship • Srikakulam
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reward Callout Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0071E3]/20 via-[#0071E3]/5 to-transparent border border-[#0071E3]/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#0071E3] font-semibold">
              Member Reward
            </span>
            <h4 className="text-lg font-bold text-white flex items-center space-x-1.5">
              <span>+75 BINGOOO Coins</span>
            </h4>
            <p className="text-[11px] text-[#86868B]">
              Redeemable for in-store cash discount vouchers
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/20 flex items-center justify-center text-[#0071E3]">
            <Coins className="w-6 h-6 text-[#0071E3]" />
          </div>
        </div>

        {isAlreadyClaimed ? (
          <div className="p-5 rounded-2xl bg-[#30D158]/10 border border-[#30D158]/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#30D158] mx-auto" />
            <h4 className="text-sm font-bold text-white">
              Reward Already Claimed!
            </h4>
            <p className="text-xs text-[#86868B] leading-relaxed">
              You have already earned 75 Coins for reviewing BINGOOO Men's Wear on Google Maps. Thank you for your support!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="apple-button-secondary text-xs w-full py-2.5 text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleClaimCoins} className="space-y-4">
            {/* Step 1: Write Review */}
            <div>
              <label className="block text-[11px] font-medium text-[#86868B] uppercase tracking-wider mb-1.5">
                Step 1: Open Google Maps & Leave a 5-Star Review
              </label>
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                  hasOpenedMaps
                    ? 'bg-white/[0.08] text-white border border-white/20'
                    : 'bg-[#EA4335] hover:bg-[#d9382b] text-white shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                </div>
                <span>{hasOpenedMaps ? '✓ Opened Google Maps (Tap to re-open)' : 'Write Review on Google Maps ↗'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
              <p className="text-[10px] text-[#86868B] mt-1">
                📍 BINGOOO Men's Wear, NH16, Kushalpuram, Srikakulam.
              </p>
            </div>

            {/* Step 2: Confirmation / Name */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-medium text-[#86868B] uppercase tracking-wider">
                Step 2: Your Name on Google (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#0071E3] transition"
              />
            </div>

            {errorMessage && (
              <p className="text-[11px] text-[#FF453A] bg-[#FF453A]/10 p-2.5 rounded-xl border border-[#FF453A]/20">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-[#30D158]/15 border border-[#30D158]/30 flex items-center space-x-2 text-xs text-[#30D158]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !!successMessage}
                className="apple-button-primary w-full text-xs py-3 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding Coins...</span>
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4 text-amber-300" />
                    <span>Claim 75 BINGOOO Coins</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
