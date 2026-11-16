import React from 'react';
import { Sparkles, Calendar, CheckCircle2, ShieldCheck, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-wide text-white">
          How BINGOOO Spin & Win Works
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Everything you need to know about our monthly promotional customer rewards program.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-[#161616] border border-[#2A2A2A] flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-[#C91F32]/10 text-[#C91F32] shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">One Spin Every Calendar Month</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every verified Indian mobile number receives exactly 1 spin attempt per calendar month (Asia/Kolkata timezone). Eligibility resets automatically at 12:00:00 AM IST on the 1st of every month. Unused chances do not roll over or accumulate.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#161616] border border-[#2A2A2A] flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Server-Committed Fair Randomness</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our wheel uses cryptographic server-side randomness (CSPRNG). The frontend wheel animation accurately animates to the result committed by the backend. Browser refreshes will not alter or consume extra spins.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#161616] border border-[#2A2A2A] flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Physical Store Redemption in Srikakulam</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Winning coupons (10% OFF, 5% OFF, or FREE Gift) produce a unique code (e.g. BGO-XXXX-XXXX). Present this voucher on your mobile phone to our billing cashier at BINGOOO Men's Wear, Main Road, Srikakulam during checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/spin"
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#C91F32] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#C91F32]/30"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>TRY YOUR MONTHLY SPIN</span>
        </Link>
      </div>
    </div>
  );
};
