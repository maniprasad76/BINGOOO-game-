import React, { useState } from 'react';
import {
  Instagram,
  CheckCircle2,
  ExternalLink,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface InstagramFollowGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (handle: string) => void;
}

export const InstagramFollowGateModal: React.FC<InstagramFollowGateModalProps> = ({
  isOpen,
  onClose,
  onVerified
}) => {
  const [handle, setHandle] = useState('');
  const [hasOpenedInstagram, setHasOpenedInstagram] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOpenInstagram = () => {
    window.open('https://www.instagram.com/bingooo.co.in/', '_blank', 'noopener,noreferrer');
    setHasOpenedInstagram(true);
    setError(null);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      setError('Please confirm that you have followed @bingooo.co.in on Instagram.');
      return;
    }

    setIsSubmitting(true);
    const cleanHandle = handle.trim() ? (handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`) : '@bingooo_follower';

    // Store in localStorage
    localStorage.setItem('bingooo_insta_followed', 'true');
    localStorage.setItem('bingooo_insta_handle', cleanHandle);
    localStorage.setItem('bingooo_insta_followed_at', new Date().toISOString());

    setTimeout(() => {
      setIsSubmitting(false);
      onVerified(cleanHandle);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md apple-glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-neutral-950 p-6 sm:p-7 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] flex items-center justify-center p-[2px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <Instagram className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Instagram Follow Required
              </h3>
              <p className="text-[11px] text-[#86868B]">
                Official @bingooo.co.in Verification
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

        {/* Profile Card Preview */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] shrink-0 overflow-hidden">
            <img
              src="/reels/reel-2.jpg"
              alt="bingooo.co.in"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-white truncate">bingooo.co.in</span>
              <span className="text-[9px] font-bold text-[#0071E3] bg-[#0071E3]/15 px-1.5 py-0.2 rounded-full">✓ Verified</span>
            </div>
            <p className="text-[11px] text-[#86868B] truncate mt-0.5">
              Men's Wear • NH16 Kushalpuram, Srikakulam
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#A1A1A6] mt-1">
              <span><strong>18.6K</strong> followers</span>
              <span>•</span>
              <span><strong>240+</strong> drops</span>
            </div>
          </div>
        </div>

        {/* Instruction Message */}
        <div className="text-xs text-[#A1A1A6] leading-relaxed space-y-2">
          <p>
            To spin the monthly wheel and unlock genuine in-store voucher prizes, members must follow our official Instagram page <strong className="text-white">@bingooo.co.in</strong>.
          </p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleConfirm} className="space-y-4">
          {/* Step 1 Button */}
          <div>
            <label className="block text-[11px] font-medium text-[#86868B] uppercase tracking-wider mb-1.5">
              Step 1: Follow Account
            </label>
            <button
              type="button"
              onClick={handleOpenInstagram}
              className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                hasOpenedInstagram
                  ? 'bg-white/[0.08] text-white border border-white/20'
                  : 'bg-gradient-to-r from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white shadow-lg hover:opacity-95'
              }`}
            >
              <Instagram className="w-4 h-4" />
              <span>{hasOpenedInstagram ? '✓ Opened @bingooo.co.in (Tap to Reopen)' : 'Follow @bingooo.co.in on Instagram ↗'}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
            </button>
          </div>

          {/* Step 2: Handle & Confirmation */}
          <div className="space-y-2 pt-1">
            <label className="block text-[11px] font-medium text-[#86868B] uppercase tracking-wider">
              Step 2: Enter Your Instagram Username (Optional)
            </label>
            <input
              type="text"
              placeholder="@your_instagram_handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#0071E3] transition"
            />
            <p className="text-[10px] text-[#86868B]">
              Store counter staff may verify your follow when redeeming in-store free gifts or vouchers.
            </p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start space-x-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 rounded bg-white/10 border-white/20 text-[#0071E3] focus:ring-0"
            />
            <span className="text-[11px] text-[#A1A1A6] select-none leading-tight">
              I confirm that I have followed <strong className="text-white">@bingooo.co.in</strong> on Instagram.
            </span>
          </label>

          {error && (
            <p className="text-[11px] text-[#FF453A] bg-[#FF453A]/10 p-2.5 rounded-xl border border-[#FF453A]/20">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="apple-button-primary w-full text-xs py-3 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Unlocking Wheel...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Follow & Unlock Spin</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
