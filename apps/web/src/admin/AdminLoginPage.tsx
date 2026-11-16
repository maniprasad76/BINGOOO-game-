import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, RefreshCw, AlertCircle } from 'lucide-react';
import { ApiClient } from '../services/api.service';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Bingooo@Admin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-display uppercase tracking-wide text-white">
            Staff & Admin Portal
          </h2>
          <p className="text-xs text-gray-400">
            Secure login for BINGOOO store staff and administrators.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-200 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-[#2A2A2A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4AF37] transition"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#111111] border border-[#222222] text-[11px] text-gray-400 space-y-1">
            <p><strong>Demo Seed Logins:</strong></p>
            <p>Super Admin: <code className="text-gray-300">admin</code> / <code className="text-gray-300">Bingooo@Admin2026!</code></p>
            <p>Staff Cashier: <code className="text-gray-300">staff1</code> / <code className="text-gray-300">Staff@Bingooo2026!</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#B8972E] text-[#111111] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center space-x-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>SIGN IN TO PORTAL</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
