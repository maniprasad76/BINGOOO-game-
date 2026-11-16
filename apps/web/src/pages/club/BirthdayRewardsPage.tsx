import React, { useState, useEffect } from 'react';
import { Gift, Calendar, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiClient } from '../../services/api.service';

export const BirthdayRewardsPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [birthMonth, setBirthMonth] = useState<number>(1);
  const [birthDay, setBirthDay] = useState<number>(1);
  const [category, setCategory] = useState<string>('Shirts');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claimMsg, setClaimMsg] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, elig] = await Promise.all([
        ApiClient.getBirthdayProfile(),
        ApiClient.getBirthdayEligibility()
      ]);
      setProfile(p);
      setEligibility(elig);
      if (p.birthMonth) setBirthMonth(p.birthMonth);
      if (p.birthDay) setBirthDay(p.birthDay);
      if (p.preferredClothingCategory) setCategory(p.preferredClothingCategory);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setClaimMsg(null);
    setClaimError(null);
    try {
      await ApiClient.updateBirthdayPreferences(birthMonth, birthDay, category);
      await loadData();
      setClaimMsg('Birthday preferences saved successfully!');
    } catch (err: any) {
      setClaimError(err.message || 'Failed to save birthday');
    } finally {
      setSaving(false);
    }
  };

  const handleClaim = async () => {
    setClaimMsg(null);
    setClaimError(null);
    try {
      const res = await ApiClient.claimBirthdayReward();
      setClaimMsg(res.message);
      await loadData();
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim birthday reward');
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Bauhaus Birthday Hero */}
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#F5B700] space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1F1F1F] text-[#F5B700] text-xs font-mono font-bold uppercase border border-[#F5B700]">
          <span>ANNUAL BENEFIT // BIRTHDAY REWARD PASS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
          CELEBRATE WITH <span className="text-[#F5B700]">BINGOOO.</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-sans">
          Receive an exclusive birthday month package every year: <strong>50 BINGOOO Coins</strong> added to your wallet plus a special <strong>10% Birthday Discount Pass</strong> for our Srikakulam store!
        </p>
      </div>

      {claimMsg && (
        <div className="p-4 bg-emerald-950/60 border-2 border-emerald-500 text-xs font-mono text-emerald-200 flex items-center space-x-2 shadow-[4px_4px_0px_0px_#FFFFFF]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{claimMsg}</span>
        </div>
      )}

      {claimError && (
        <div className="p-4 bg-red-950/60 border-2 border-red-500 text-xs font-mono text-red-200 flex items-center space-x-2 shadow-[4px_4px_0px_0px_#C91F32]">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{claimError}</span>
        </div>
      )}

      {/* Bauhaus Claim Card */}
      {eligibility && (
        <div className="p-6 sm:p-8 bg-[#161616] border-2 border-white space-y-4 shadow-[6px_6px_0px_0px_#C91F32]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black font-display uppercase tracking-wider text-white">
              BIRTHDAY STATUS ({eligibility.currentYear})
            </h3>
            <span
              className={`px-2.5 py-1 border text-[10px] font-mono font-bold uppercase ${
                eligibility.isEligible
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                  : 'bg-gray-900 text-gray-400 border-gray-700'
              }`}
            >
              {eligibility.isEligible ? 'ELIGIBLE TO CLAIM' : 'NOT IN BIRTHDAY MONTH'}
            </span>
          </div>

          <p className="text-xs text-gray-300 font-sans leading-relaxed">
            {eligibility.message}
          </p>

          {eligibility.isEligible && (
            <button
              onClick={handleClaim}
              className="px-6 py-3 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-[#F5B700]" />
              <span>CLAIM 50 COINS + 10% PASS NOW →</span>
            </button>
          )}
        </div>
      )}

      {/* Bauhaus Birthday Preferences Form */}
      <div className="p-6 sm:p-8 bg-[#141414] border-2 border-[#333333] space-y-6 shadow-[5px_5px_0px_0px_#16428C]">
        <h3 className="text-lg font-black font-display uppercase tracking-wider text-white">
          YOUR BIRTHDAY & PREFERENCES
        </h3>

        <form onSubmit={handleSavePreferences} className="space-y-4 font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-300 mb-1.5">
                BIRTH MONTH
              </label>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white text-xs focus:outline-none focus:border-white uppercase"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-300 mb-1.5">
                DAY OF MONTH
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={birthDay}
                onChange={(e) => setBirthDay(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white text-xs focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-gray-300 mb-1.5">
              FAVORITE MEN'S CLOTHING CATEGORY
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Shirts', 'T-Shirts', 'Jeans', 'Trousers'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 border-2 font-mono text-xs uppercase font-bold transition-all ${
                    category === cat
                      ? 'bg-white text-black border-white shadow-[2px_2px_0px_0px_#C91F32]'
                      : 'bg-[#181818] text-gray-400 border-[#333333] hover:border-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#1C1C1C] hover:bg-white hover:text-black text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] hover:translate-x-0.5 hover:translate-y-0.5"
          >
            {saving ? 'SAVING...' : 'SAVE BIRTHDAY DETAILS →'}
          </button>
        </form>
      </div>
    </div>
  );
};
