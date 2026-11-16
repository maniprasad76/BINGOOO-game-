import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, Share2, Gift, ArrowRight } from 'lucide-react';
import { ApiClient } from '../../services/api.service';

export const ReferralsPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const loadSummary = () => {
    ApiClient.getReferralSummary().then(setSummary).catch(console.error);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const copyLink = () => {
    if (!summary?.referralLink) return;
    navigator.clipboard.writeText(summary.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyFriendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyMsg(null);
    setApplyError(null);
    try {
      const res = await ApiClient.attributeReferral(friendCode);
      setApplyMsg(`Referral applied! You unlocked welcome coupon: ${res.welcomeVoucherCode}`);
      setFriendCode('');
    } catch (err: any) {
      setApplyError(err.message || 'Failed to apply referral code');
    }
  };

  const shareOnWhatsApp = () => {
    if (!summary?.referralLink) return;
    const text = encodeURIComponent(
      `Hey! Get 5% OFF on stylish shirts, jeans & t-shirts at BINGOOO Men's Wear, Srikakulam using my referral link: ${summary.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Bauhaus Referral Hero */}
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#16428C] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1F1F1F] text-emerald-400 text-xs font-mono font-bold uppercase border border-emerald-500">
            <span>NETWORK // REFER & EARN PROGRAM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
            INVITE FRIENDS. <span className="text-emerald-400">EARN 50 COINS.</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-sans">
            Give your friend 5% OFF on their first purchase at BINGOOO Srikakulam. When they complete their shopping, you get 50 BINGOOO Coins credited automatically!
          </p>
        </div>

        {/* Bauhaus Stats */}
        <div className="flex gap-4 shrink-0 font-mono">
          <div className="p-4 bg-[#0A0A0A] border-2 border-white text-center min-w-[110px] shadow-[4px_4px_0px_0px_#16428C]">
            <span className="text-3xl font-black font-display text-emerald-400 block">
              {summary?.qualifiedCount || 0}
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">QUALIFIED</span>
          </div>
          <div className="p-4 bg-[#0A0A0A] border-2 border-white text-center min-w-[110px] shadow-[4px_4px_0px_0px_#F5B700]">
            <span className="text-3xl font-black font-display text-[#F5B700] block">
              {summary?.totalEarnedCoins || 0}
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">COINS WON</span>
          </div>
        </div>
      </div>

      {/* Bauhaus Share Box */}
      <div className="p-6 sm:p-8 bg-[#161616] border-2 border-white space-y-6 shadow-[6px_6px_0px_0px_#FFFFFF]">
        <h3 className="text-lg font-black font-display uppercase tracking-wider text-white">
          YOUR UNIQUE REFERRAL INVITE
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow px-4 py-3 bg-[#0A0A0A] border-2 border-[#333333] text-white font-mono text-xs sm:text-sm flex items-center justify-between">
            <span className="truncate">{summary?.referralLink || 'Generating link...'}</span>
            <span className="text-xs font-bold text-[#F5B700] ml-2 shrink-0 bg-[#1F1F1F] px-2 py-0.5 border border-[#444]">
              CODE: {summary?.code}
            </span>
          </div>

          <button
            onClick={copyLink}
            className="px-5 py-3 bg-[#1C1C1C] hover:bg-white hover:text-black text-white font-mono font-bold text-xs uppercase tracking-wider transition-all border-2 border-white flex items-center justify-center space-x-1.5 shrink-0 shadow-[2px_2px_0px_0px_#F5B700]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED!' : 'COPY LINK'}</span>
          </button>

          <button
            onClick={shareOnWhatsApp}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all border-2 border-white flex items-center justify-center space-x-1.5 shrink-0 shadow-[2px_2px_0px_0px_#FFFFFF]"
          >
            <Share2 className="w-4 h-4" />
            <span>WHATSAPP</span>
          </button>
        </div>
      </div>

      {/* Bauhaus Friend Code Claim */}
      <div className="p-6 sm:p-8 bg-[#141414] border-2 border-[#333333] space-y-4 shadow-[5px_5px_0px_0px_#C91F32]">
        <h3 className="text-base font-black font-display uppercase tracking-wider text-white">
          HAVE A FRIEND'S INVITE CODE?
        </h3>
        <p className="text-xs text-gray-400 font-sans">
          Enter a friend's referral code to instantly claim your 5% welcome discount voucher for BINGOOO Men's Wear.
        </p>

        {applyMsg && (
          <div className="p-3 bg-emerald-950/60 border-2 border-emerald-500 text-xs font-mono text-emerald-300">
            {applyMsg}
          </div>
        )}
        {applyError && (
          <div className="p-3 bg-red-950/60 border-2 border-red-500 text-xs font-mono text-red-300">
            {applyError}
          </div>
        )}

        <form onSubmit={handleApplyFriendCode} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. BGO9876"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
            required
            className="flex-grow px-4 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white font-mono text-sm focus:outline-none focus:border-white uppercase"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-wider transition-all border-2 border-white shadow-[2px_2px_0px_0px_#FFFFFF]"
          >
            APPLY CODE →
          </button>
        </form>
      </div>

      {/* Bauhaus Referral History */}
      <div className="p-6 sm:p-8 bg-[#141414] border-2 border-[#333333] space-y-4 shadow-[5px_5px_0px_0px_#F5B700]">
        <h3 className="text-base font-black font-display uppercase tracking-wider text-white font-mono">
          YOUR REFERRED FRIENDS
        </h3>
        <div className="divide-y-2 divide-[#222222]">
          {summary?.history?.map((r: any) => (
            <div key={r.id} className="py-3 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-white block uppercase">{r.maskedPhone}</span>
                <span className="text-[10px] text-gray-400">
                  Invited on: {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span
                className={`px-2.5 py-1 border text-[10px] font-mono font-bold uppercase ${
                  r.status === 'REWARDED' || r.status === 'QUALIFIED'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                    : 'bg-gray-900 text-gray-400 border-gray-700'
                }`}
              >
                {r.status === 'REWARDED' ? '+50 COINS EARNED' : r.status}
              </span>
            </div>
          ))}
          {(!summary?.history || summary.history.length === 0) && (
            <p className="text-xs font-mono text-gray-500 py-4 text-center">NO FRIENDS INVITED YET. SHARE YOUR LINK ABOVE!</p>
          )}
        </div>
      </div>
    </div>
  );
};
