import React from 'react';
import { Sparkles, Calendar, ShieldCheck, Gift, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-20 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          How It Works
        </h1>
        <p className="text-sm text-[#86868B] max-w-lg mx-auto">
          Everything you need to know about BINGOOO's monthly customer rewards.
        </p>
      </div>

      <div className="space-y-4">
        <div className="apple-glass-card rounded-2xl p-6 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white tracking-tight">One Free Spin Every Calendar Month</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Every verified Indian mobile number receives 1 spin chance per calendar month (IST). Eligibility resets automatically at 12:00:00 AM IST on the 1st of every month.
            </p>
          </div>
        </div>

        <div className="apple-glass-card rounded-2xl p-6 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white tracking-tight">Fair Cryptographic Randomness</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Our wheel uses cryptographic server-side randomness (CSPRNG). The wheel animation accurately stops at the server-committed slice, ensuring complete fairness.
            </p>
          </div>
        </div>

        <div className="apple-glass-card rounded-2xl p-6 flex items-start space-x-4">
          <div className="w-10 h-10 rounded-full bg-[#30D158]/10 text-[#30D158] flex items-center justify-center shrink-0 mt-0.5">
            <Gift className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white tracking-tight">In-Store Redemption in Srikakulam</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Winning coupons generate an instant digital voucher (e.g. BGO-XXXX-XXXX). Simply present this code at checkout at BINGOOO Men's Wear, Main Road, Srikakulam.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/spin"
          className="apple-button-primary inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Try Your Monthly Spin</span>
        </Link>
      </div>
    </div>
  );
};
