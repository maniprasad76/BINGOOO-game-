import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Gift,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { SpinWheel } from '../components/wheel/SpinWheel';
import { ApiClient } from '../services/api.service';

export const SpinPage: React.FC = () => {
  const navigate = useNavigate();

  const [eligibility, setEligibility] = useState<any>(null);
  const [wheelSegments, setWheelSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinResult, setSpinResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<string>('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [configRes, eligRes] = await Promise.all([
        ApiClient.getWheelConfig(),
        ApiClient.checkEligibility()
      ]);
      setWheelSegments(configRes.segments || []);
      setEligibility(eligRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Live countdown to next month 1st midnight IST
  useEffect(() => {
    if (!eligibility || eligibility.isEligible || !eligibility.nextEligibleAt) return;

    const targetTime = new Date(eligibility.nextEligibleAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        setCountdown('Unlocked! Refreshing...');
        loadData();
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eligibility]);

  const handleSpinRequest = async () => {
    const idempotencyKey = `spin_${Date.now()}_${Math.random()}`;
    const result = await ApiClient.executeSpin(idempotencyKey);
    setSpinResult(result);
    // Refresh eligibility state
    const eligRes = await ApiClient.checkEligibility();
    setEligibility(eligRes);

    return {
      segmentIndex: result.segmentIndex,
      isWin: result.isWin,
      prizeName: result.prizeName
    };
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Bauhaus Monthly Lock Status Banner */}
      {eligibility && !eligibility.isEligible && (
        <div className="mb-8 p-6 sm:p-8 bg-[#161616] border-3 border-white text-center space-y-4 shadow-[6px_6px_0px_0px_#C91F32]">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1F1F1F] text-[#F5B700] text-xs font-mono font-bold uppercase border border-[#F5B700]">
            <Calendar className="w-3.5 h-3.5" />
            <span>MONTHLY CHANCE COMMITTED // {eligibility.periodKey}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wider text-white">
            YOU HAVE ALREADY PLAYED THIS MONTH!
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
            Per BINGOOO Club rules, each member gets strictly <strong className="text-white uppercase font-mono">one committed spin per calendar month (IST)</strong>.
            Your next free spin unlocks automatically on the 1st of next month!
          </p>

          {countdown && (
            <div className="inline-block p-4 bg-[#0A0A0A] border-2 border-white shadow-[4px_4px_0px_0px_#F5B700]">
              <span className="block text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-1">
                NEXT CHANCE UNLOCKS IN
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black text-[#F5B700]">
                {countdown}
              </span>
            </div>
          )}

          {eligibility.currentResult?.rewardCode && (
            <div className="pt-2">
              <Link
                to={`/reward/${eligibility.currentResult.rewardCode}`}
                className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#C91F32] hover:text-white uppercase tracking-wider underline decoration-2 decoration-[#F5B700]"
              >
                <span>[ VIEW ACTIVE MONTHLY REWARD: {eligibility.currentResult.rewardCode} ]</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Main Bauhaus Wheel Stage */}
      <div className="bg-[#121212] border-3 border-white p-6 sm:p-10 flex flex-col items-center relative overflow-hidden shadow-[8px_8px_0px_0px_#F5B700]">
        <div className="text-center mb-6 space-y-1">
          <div className="inline-block px-2.5 py-0.5 bg-[#C91F32] text-white text-[10px] font-mono font-bold tracking-widest uppercase border border-white mb-1">
            VERIFIED PROBABILITY ENGINE // MONTHLY FESTIVE WHEEL
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-display uppercase tracking-widest text-white">
            BINGOOO <span className="text-[#C91F32]">SPIN & WIN</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans">
            Spin the Bauhaus wheel to win 20% OFF, 10% OFF, 5% OFF, or Free Store Surprise Gifts.
          </p>
        </div>

        {wheelSegments.length > 0 && (
          <SpinWheel
            segments={wheelSegments}
            onSpinRequest={handleSpinRequest}
            disabled={eligibility && !eligibility.isEligible}
          />
        )}
      </div>

      {/* Result Bauhaus Modal */}
      {spinResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#161616] border-4 border-white p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-[10px_10px_0px_0px_#C91F32] relative">
            <div className={`w-14 h-14 border-2 border-white flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#F5B700] ${
              spinResult.isTryAgain
                ? 'bg-[#F5B700] text-black'
                : spinResult.isWin
                ? 'bg-[#C91F32] text-white'
                : 'bg-[#1E1E1E] text-gray-300'
            }`}>
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F5B700] bg-[#1F1F1F] px-2 py-0.5 border border-[#444]">
                {spinResult.isTryAgain
                  ? '★ BONUS RE-SPIN UNLOCKED ★'
                  : spinResult.isWin
                  ? '★ CONGRATULATIONS WINNER ★'
                  : '★ THANK YOU FOR PLAYING ★'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide text-white mt-3">
                {spinResult.prizeName}
              </h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed font-sans">
                {spinResult.description}
              </p>
            </div>

            {/* Winning Voucher Display */}
            {spinResult.rewardCode && (
              <div className="p-4 bg-[#0A0A0A] border-2 border-white space-y-2 shadow-[4px_4px_0px_0px_#F5B700]">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 block">
                  OFFICIAL IN-STORE VOUCHER CODE
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-mono text-2xl font-black tracking-widest text-[#F5B700]">
                    {spinResult.rewardCode}
                  </span>
                  <button
                    onClick={() => copyCode(spinResult.rewardCode)}
                    className="p-1.5 bg-[#222222] hover:bg-[#333333] border border-white text-white transition"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <span className="text-[11px] text-emerald-400 font-mono font-bold block">CODE COPIED TO CLIPBOARD!</span>}
                <p className="text-[10px] text-gray-400 pt-1 font-mono">
                  Valid for 30 days at BINGOOO Men's Wear, NH16, Kushalpuram, Srikakulam.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {spinResult.isTryAgain && (
                <button
                  onClick={() => setSpinResult(null)}
                  className="w-full py-3.5 bg-[#F5B700] hover:bg-[#DBA300] text-black font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-black shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>SPIN AGAIN NOW ↻</span>
                </button>
              )}

              {spinResult.rewardCode && (
                <Link
                  to={`/reward/${spinResult.rewardCode}`}
                  className="w-full py-3 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF]"
                >
                  VIEW REWARD VOUCHER →
                </Link>
              )}

              {!spinResult.isTryAgain && !spinResult.isWin && (
                <Link
                  to="/club"
                  className="w-full py-3 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#F5B700]"
                >
                  VISIT REWARDS CLUB & COINS →
                </Link>
              )}

              <button
                onClick={() => setSpinResult(null)}
                className="w-full py-2.5 bg-[#242424] hover:bg-[#2F2F2F] text-gray-300 font-mono font-bold text-xs uppercase tracking-widest transition border border-[#444]"
              >
                [ CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
