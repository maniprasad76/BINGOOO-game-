import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Calendar, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { ApiClient } from '../services/api.service';

export const RewardsPage: React.FC = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.getMyRewards()
      .then((data) => setRewards(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#282828] pb-4">
        <div>
          <div className="inline-block px-2.5 py-0.5 bg-[#C91F32] text-white text-[10px] font-mono font-bold tracking-widest uppercase border border-white mb-1">
            WALLET PRIVILEGES // IN-STORE PASSES
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wider text-white">
            MY REWARD VOUCHERS
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Present your active voucher QR or code at BINGOOO Men's Wear checkout, Main Road, Srikakulam.
          </p>
        </div>
        <Link
          to="/spin"
          className="px-4 py-2 bg-[#1C1C1C] hover:bg-white hover:text-black border-2 border-white text-xs font-mono font-bold uppercase tracking-wider text-[#F5B700] transition-all shrink-0 shadow-[2px_2px_0px_0px_#C91F32]"
        >
          SPIN WHEEL →
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 font-mono text-xs">LOADING REWARDS...</div>
      ) : rewards.length === 0 ? (
        <div className="p-8 bg-[#141414] border-2 border-white text-center space-y-4 shadow-[6px_6px_0px_0px_#F5B700]">
          <Gift className="w-10 h-10 text-[#F5B700] mx-auto" />
          <h3 className="text-lg font-black font-display uppercase text-white">NO ACTIVE VOUCHERS YET</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto font-sans">
            Spin this month's wheel or redeem your BINGOOO Coins to generate instant store discount passes!
          </p>
          <Link
            to="/spin"
            className="inline-block px-6 py-2.5 bg-[#C91F32] hover:bg-[#B01828] text-white text-xs font-mono font-black uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_0px_#FFFFFF]"
          >
            PLAY MONTHLY SPIN →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="p-5 bg-[#161616] border-2 border-[#333333] hover:border-white transition-all space-y-3 relative overflow-hidden shadow-[4px_4px_0px_0px_#C91F32]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 border text-[10px] font-mono font-bold uppercase tracking-wider ${
                      r.status === 'REDEEMED'
                        ? 'bg-gray-900 text-gray-400 border-gray-700'
                        : r.status === 'EXPIRED'
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-500'
                    }`}
                  >
                    {r.status}
                  </span>
                  <h4 className="text-base font-black font-display uppercase tracking-wide text-white mt-1">
                    {r.prize.name}
                  </h4>
                </div>
                <span className="font-mono text-sm font-black text-[#F5B700] bg-[#0A0A0A] px-2.5 py-1 border border-white">
                  {r.code}
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {r.prize.description}
              </p>

              <div className="pt-2 border-t border-[#282828] flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>EXPIRES: {new Date(r.expiresAt).toLocaleDateString()}</span>
                <Link
                  to={`/reward/${r.code}`}
                  className="text-[#F5B700] hover:text-white font-bold flex items-center space-x-1 uppercase"
                >
                  <span>VIEW PASS →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
