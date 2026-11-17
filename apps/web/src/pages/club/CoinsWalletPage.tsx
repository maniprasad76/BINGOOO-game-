import React, { useState, useEffect } from 'react';
import { Coins, ArrowRight, ShieldCheck, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { ApiClient } from '../../services/api.service';

export const CoinsWalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [w, opt] = await Promise.all([
        ApiClient.getLoyaltyWallet(),
        ApiClient.getRedemptionOptions()
      ]);
      setWallet(w);
      setOptions(opt);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRedeem = async (tierId: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      setRedeeming(true);
      const res = await ApiClient.redeemCoins(tierId);
      setSuccessMsg(`Voucher ${res.reward.code} generated successfully! View it in My Rewards.`);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to redeem coins');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Bauhaus Wallet Balance Hero */}
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#F5B700] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1F1F1F] text-[#F5B700] text-xs font-mono font-bold uppercase border border-[#F5B700]">
            <span>LEDGER // BINGOOO REWARDS WALLET</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display text-white tracking-tight">
            {wallet ? wallet.availableBalance : '0'}{' '}
            <span className="text-[#F5B700] text-2xl sm:text-3xl font-mono">COINS</span>
          </h1>
          <p className="text-xs font-mono text-gray-400">
            LIFETIME EARNED: <strong className="text-white">{wallet?.lifetimeEarned || 0}</strong> • REDEEMED:{' '}
            <strong className="text-white">{wallet?.lifetimeRedeemed || 0}</strong>
          </p>
        </div>

        <div className="p-4 bg-[#0A0A0A] border-2 border-white text-xs text-gray-300 space-y-1.5 max-w-xs shadow-[4px_4px_0px_0px_#C91F32] font-mono">
          <p className="font-bold text-white flex items-center space-x-1.5 uppercase">
            <span className="w-2 h-2 bg-[#F5B700]" />
            <span>HOW TO EARN COINS:</span>
          </p>
          <p>• Store Spend: 1 Coin / ₹10</p>
          <p>• Refer Friends: 50 Coins / friend</p>
          <p>• Spin & Scratch Card: Exclusive Monthly Discounts</p>
          <p>• Birthday Gift: 50 Coins annual pass</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border-2 border-emerald-500 text-xs font-mono text-emerald-200 flex items-center space-x-2 shadow-[4px_4px_0px_0px_#FFFFFF]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border-2 border-red-500 text-xs font-mono text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Bauhaus Redemption Tiers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#282828] pb-2">
          <h3 className="text-xl font-black font-display uppercase tracking-wider text-white flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#C91F32]" />
            <span>REDEEM COINS FOR STORE VOUCHERS</span>
          </h3>
          <span className="text-xs font-mono text-gray-400 uppercase hidden sm:inline">
            // INSTANT GENERATION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {options.map((opt, idx) => {
            const canAfford = wallet && wallet.availableBalance >= opt.coinsRequired;
            return (
              <div
                key={opt.id}
                className="p-5 bg-[#161616] border-2 border-[#333333] hover:border-white transition-all flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_0px_#C91F32]"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-gray-500">#0{idx + 1}</span>
                    <span className="text-[10px] font-mono font-bold text-[#F5B700] bg-[#222] px-1.5 py-0.5 border border-[#444]">
                      {opt.coinsRequired} COINS
                    </span>
                  </div>
                  <span className="text-lg font-black font-display text-white block uppercase tracking-wide">
                    {opt.label}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-2 font-sans">
                    Valid for 30 days at BINGOOO Srikakulam store.
                  </p>
                </div>

                <button
                  onClick={() => handleRedeem(opt.id)}
                  disabled={!canAfford || redeeming}
                  className={`w-full py-2.5 font-mono font-black text-xs uppercase tracking-widest transition-all border-2 ${
                    canAfford
                      ? 'bg-[#C91F32] hover:bg-[#B01828] text-white border-white shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5'
                      : 'bg-[#1F1F1F] text-gray-600 border-[#333333] cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'REDEEM NOW' : 'NEED COINS'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bauhaus Immutable Ledger History */}
      <div className="p-6 bg-[#141414] border-2 border-[#333333] space-y-4 shadow-[5px_5px_0px_0px_#16428C]">
        <h3 className="text-base font-black font-display uppercase tracking-wider text-white flex items-center space-x-2">
          <History className="w-4 h-4 text-[#F5B700]" />
          <span>IMMUTABLE TRANSACTION LEDGER</span>
        </h3>

        <div className="divide-y-2 divide-[#222222]">
          {wallet?.recentTransactions?.map((t: any) => (
            <div key={t.id} className="py-3 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-white block uppercase">
                  {t.sourceType} ({t.type})
                </span>
                <span className="text-[10px] text-gray-500">
                  {new Date(t.occurredAt).toLocaleString()}
                </span>
              </div>
              <span
                className={`font-mono text-sm font-black ${
                  t.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {t.amount > 0 ? `+${t.amount}` : t.amount} COINS
              </span>
            </div>
          ))}
          {(!wallet?.recentTransactions || wallet.recentTransactions.length === 0) && (
            <p className="text-xs font-mono text-gray-500 py-4 text-center">NO TRANSACTIONS RECORDED YET.</p>
          )}
        </div>
      </div>
    </div>
  );
};
