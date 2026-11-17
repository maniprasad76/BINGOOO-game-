import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { ApiClient } from '../services/api.service';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Bingooo@Admin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminGoogleSuccess = async (profile: { email: string; name: string; googleId: string }) => {
    setError(null);
    setLoading(true);
    try {
      await ApiClient.adminGoogleLogin(profile.email, profile.name, profile.googleId);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Admin Google Sign-in failed. Please verify admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ApiClient.adminLogin(username, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_#C91F32] space-y-6 relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#F5B700] border-2 border-white text-black flex items-center justify-center mx-auto mb-2 shadow-[2px_2px_0px_0px_#FFFFFF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#F5B700] uppercase tracking-widest block">
            STAFF & MANAGEMENT PORTAL
          </span>
          <h2 className="text-2xl font-black font-display uppercase tracking-wider text-white">
            Admin Sign In
          </h2>
          <p className="text-xs text-gray-400 font-sans">
            Free Gift Winners Desk & Counter Voucher Redemption. Sign in with Google or store staff credentials.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border-2 border-red-500 text-xs text-red-200 flex items-start space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Admin Login */}
        <div className="space-y-3">
          <GoogleSignInButton
            onSuccess={handleAdminGoogleSuccess}
            buttonText="SIGN IN AS ADMIN WITH GOOGLE"
          />

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-[#333333] w-full absolute" />
            <span className="bg-[#141414] px-3 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest relative z-10">
              OR STAFF CREDENTIALS
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              USERNAME OR EMAIL
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white text-sm focus:outline-none focus:border-white transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white text-sm focus:outline-none focus:border-white transition font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0A0A0A] border border-[#262626] text-[11px] font-mono text-gray-400 space-y-1">
            <p className="text-white font-bold uppercase">Demo Credentials:</p>
            <p>Admin: <code className="text-[#F5B700]">admin</code> / <code className="text-gray-300">Bingooo@Admin2026!</code></p>
            <p>Staff Cashier: <code className="text-[#F5B700]">staff1</code> / <code className="text-gray-300">Staff@Bingooo2026!</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
              <>
                <span>SIGN IN TO ADMIN PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
