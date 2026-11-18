import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="apple-glass-card rounded-3xl p-6 sm:p-8 relative space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {challengeId ? 'Enter Code' : 'Verify Mobile'}
          </h2>
          <p className="text-xs text-[#86868B] max-w-xs mx-auto">
            {challengeId
              ? `Verification code sent to ${maskedPhone}.`
              : 'Enter your 10-digit phone number to spin and claim rewards.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/20 text-xs text-[#FF453A] flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {devMockOtp && (
          <div className="p-3 rounded-2xl bg-[#0071E3]/10 border border-[#0071E3]/20 text-xs text-[#0071E3] flex items-center justify-between">
            <span>Dev Mock Code: <strong>{devMockOtp}</strong></span>
            <button
              type="button"
              onClick={() => setOtp(devMockOtp)}
              className="text-[11px] underline font-medium"
            >
              Auto Fill
            </button>
          </div>
        )}

        {!challengeId ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#86868B] mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#86868B] text-sm font-medium">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={14}
                  required
                  className="w-full pl-14 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-[#86868B] text-sm focus:outline-none focus:border-[#0071E3] transition"
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="consent"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 rounded border-white/[0.1] bg-white/[0.04] text-[#0071E3] focus:ring-0"
              />
              <label htmlFor="consent" className="text-[11px] text-[#86868B] leading-tight">
                (Optional) Receive WhatsApp alerts for festive rewards & events.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="apple-button-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#86868B] mb-1.5 text-center">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-center text-2xl tracking-[0.3em] font-mono focus:outline-none focus:border-[#0071E3] transition font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="apple-button-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Confirm & Continue</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setChallengeId(null)}
                className="text-[#86868B] hover:text-white"
              >
                Change Number
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleRequestOtp}
                className="text-[#0071E3] disabled:text-[#86868B] font-medium"
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
