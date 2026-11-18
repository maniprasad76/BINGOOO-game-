import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Award,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Gift,
  ArrowUpRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-[#86868B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
          <span>Srikakulam Store Rewards Program</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
          Spin. Win. <br />
          <span className="bg-gradient-to-r from-[#0071E3] via-[#409CFF] to-[#98C7FF] bg-clip-text text-transparent">
            Wear the best.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-[#86868B] font-normal leading-relaxed">
          Unlock monthly shopping discounts, cash vouchers, and free gifts redeemable in person at BINGOOO Men's Wear, Srikakulam.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/spin"
            className="apple-button-primary w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Spin the Wheel</span>
          </Link>
          <Link
            to="/club"
            className="apple-button-secondary w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm"
          >
            <span>Rewards Club</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#86868B]" />
          </Link>
        </div>

        {/* Garment Highlights */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#86868B]">
          <span className="flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-[#86868B]" />
            <span>Premium Tees</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-[#86868B]" />
            <span>Linen Shirts</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-[#86868B]" />
            <span>Baggy & Raw Denim</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1 h-1 rounded-full bg-[#86868B]" />
            <span>Korean Chinos</span>
          </span>
        </div>
      </section>

      {/* Monthly Rewards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Monthly Prizes
          </h2>
          <p className="text-xs sm:text-sm text-[#86868B]">
            Every verified phone number receives 1 free spin chance each calendar month.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 20% OFF */}
          <div className="apple-glass-card rounded-2xl p-6 space-y-3">
            <span className="text-2xl font-bold text-white tracking-tight">20% OFF</span>
            <h3 className="text-sm font-semibold text-white">Mega Discount</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Save 20% on party wear, blazers, and luxury shirts across the store.
            </p>
          </div>

          {/* 10% OFF */}
          <div className="apple-glass-card rounded-2xl p-6 space-y-3">
            <span className="text-2xl font-bold text-white tracking-tight">10% OFF</span>
            <h3 className="text-sm font-semibold text-white">Storewide Discount</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Flat 10% savings on any combination of shirts, jeans, and polos.
            </p>
          </div>

          {/* 5% OFF */}
          <div className="apple-glass-card rounded-2xl p-6 space-y-3">
            <span className="text-2xl font-bold text-white tracking-tight">5% OFF</span>
            <h3 className="text-sm font-semibold text-white">Instant Savings</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Instant discount on everyday tees, Korean trousers, and caps.
            </p>
          </div>

          {/* Surprise Gift */}
          <div className="apple-glass-card rounded-2xl p-6 space-y-3">
            <span className="text-2xl font-bold text-white tracking-tight">Surprise Gift</span>
            <h3 className="text-sm font-semibold text-white">Complimentary Gift</h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Receive a bespoke BINGOOO branded fashion accessory on checkout.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Minimal Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="apple-glass-card rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Three Simple Steps
            </h2>
            <p className="text-xs text-[#86868B]">
              How to participate and redeem your voucher at our flagship store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-white/[0.08] text-white text-xs font-semibold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-semibold text-white">Open & Spin</h4>
              <p className="text-xs text-[#86868B] leading-relaxed">
                Open the spin wheel and tap once. The server generates your monthly reward.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-white/[0.08] text-white text-xs font-semibold flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-semibold text-white">Get Digital Pass</h4>
              <p className="text-xs text-[#86868B] leading-relaxed">
                Receive your unique voucher code (e.g. BGO-XXXX-XXXX) saved to your device.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-7 h-7 rounded-full bg-white/[0.08] text-white text-xs font-semibold flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-semibold text-white">Redeem In Store</h4>
              <p className="text-xs text-[#86868B] leading-relaxed">
                Show your code to the billing counter at BINGOOO Men's Wear in Srikakulam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="apple-glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] text-[#0071E3] font-medium uppercase tracking-wider block">
              Flagship Boutique
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white">
              BINGOOO Men's Wear, Srikakulam
            </h3>
            <p className="text-xs text-[#86868B] flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0071E3] shrink-0" />
              <span>NH16 (Main Road), Kushalpuram, Srikakulam, AP — 532410</span>
            </p>
            <p className="text-[11px] text-[#86868B]">
              Open daily: 10:00 AM – 9:30 PM IST
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto">
            <a
              href="https://maps.app.goo.gl/hV1XT66gjiD9zG4dA"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-button-primary w-full sm:w-auto text-center text-xs"
            >
              Open in Maps ↗
            </a>
            <Link
              to="/contact"
              className="apple-button-secondary w-full sm:w-auto text-center text-xs"
            >
              Store Info
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
