import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiClient } from '../services/api.service';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';

export const CustomerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (profile: { email: string; name: string; googleId: string; picture?: string }) => {
    setError(null);
    setLoading(true);
    try {
      await ApiClient.loginWithGoogle(profile.email, profile.name, profile.googleId, profile.picture);
      navigate('/club');
    } catch (err: any) {
      setError(err.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ApiClient.emailLogin(email, displayName);
      navigate('/club');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_#C91F32] space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#F5B700] border-2 border-white text-black flex items-center justify-center mx-auto mb-2 shadow-[2px_2px_0px_0px_#FFFFFF]">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#F5B700] uppercase tracking-widest block">
            CUSTOMER AUTHENTICATION // INSTANT ACCESS
          </span>
          <h2 className="text-2xl font-black font-display uppercase tracking-wider text-white">
            Customer Sign In
          </h2>
          <p className="text-xs text-gray-400 font-sans">
            Sign in with Google or your email to access your BINGOOO Rewards Club wallet and spin the wheel.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border-2 border-red-500 text-xs text-red-200 flex items-start space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-in */}
        <div className="space-y-3">
          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            buttonText="CONTINUE WITH GOOGLE"
          />

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-[#333333] w-full absolute" />
            <span className="bg-[#141414] px-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest relative z-10">
              OR CONTINUE WITH EMAIL
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white text-sm focus:outline-none focus:border-white transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              YOUR NAME (OPTIONAL)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white text-sm focus:outline-none focus:border-white transition font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>CONTINUE WITH EMAIL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs font-mono text-gray-500">
          <span>NO PHONE OTP REQUIRED // INSTANT SESSION</span>
        </div>
      </div>
    </div>
  );
};
