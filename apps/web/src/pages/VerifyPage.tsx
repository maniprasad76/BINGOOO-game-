import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '../services/api.service';

export const VerifyPage: React.FC = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [devMockOtp, setDevMockOtp] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await ApiClient.requestOtp(phoneNumber, marketingConsent);
      setChallengeId(res.challengeId);
      setMaskedPhone(res.maskedPhone);
      setResendCooldown(res.resendCooldownSeconds || 60);
      if (res.devMockOtp) {
        setDevMockOtp(res.devMockOtp);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeId) return;

    setError(null);
    setLoading(true);

    try {
      await ApiClient.verifyOtp(challengeId, otp);
      navigate('/spin');
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#C91F32]/10 border border-[#C91F32]/30 text-[#C91F32] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-display uppercase tracking-wide text-white">
            {challengeId ? 'Enter Verification Code' : 'Verify Mobile Number'}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            {challengeId
              ? `Code sent to ${maskedPhone}. Code valid for 5 minutes.`
              : 'Enter your 10-digit Indian phone number to spin and claim monthly rewards.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-900/30 border border-red-800 text-xs text-red-200 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {devMockOtp && (
          <div className="mb-6 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-xs text-[#D4AF37] flex items-center justify-between">
            <span>Dev Mock OTP Code: <strong>{devMockOtp}</strong></span>
            <button
              type="button"
              onClick={() => setOtp(devMockOtp)}
              className="text-[11px] underline font-bold"
            >
              Auto Fill
            </button>
          </div>
        )}

        {!challengeId ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-sm font-semibold">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={14}
                  required
                  className="w-full pl-14 pr-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C91F32] transition font-medium"
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 rounded border-[#2A2A2A] bg-[#111111] text-[#C91F32] focus:ring-0"
              />
              <label htmlFor="consent" className="text-[11px] text-gray-400 leading-tight">
                (Optional) Receive WhatsApp updates and festive discount alerts from BINGOOO Men's Wear.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#C91F32] hover:bg-[#A81525] text-white font-bold text-sm uppercase tracking-wider transition shadow-lg shadow-[#C91F32]/30 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>SEND OTP CODE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                className="w-full px-4 py-3 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white text-center text-2xl tracking-[0.3em] font-mono focus:outline-none focus:border-[#D4AF37] transition font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#B8972E] text-[#111111] font-bold text-sm uppercase tracking-wider transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>CONFIRM & PROCEED</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setChallengeId(null)}
                className="text-gray-400 hover:text-white"
              >
                Change Number
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleRequestOtp}
                className="text-[#C91F32] disabled:text-gray-500 font-semibold"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
