import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Gift
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#C91F32] via-[#851320] to-[#C91F32] py-2 px-4 text-center text-xs sm:text-sm font-semibold tracking-wider text-white shadow-md flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
        <span>NOVEMBER FESTIVE SPIN & WIN LIVE — VISIT SRIKAKULAM STORE!</span>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] text-xs font-semibold text-[#D4AF37] mb-6">
          <Award className="w-4 h-4" />
          <span>Exclusive Srikakulam Men's Store Promotion</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-display mb-6 uppercase">
          SPIN. WIN. <span className="text-[#C91F32]">SHOP.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-gray-300 font-normal leading-relaxed mb-8">
          Your monthly chance to unlock exclusive <strong className="text-white">BINGOOO</strong> discounts, vouchers, and free gifts for your next in-store shopping spree.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/spin"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C91F32] hover:bg-[#A81525] text-white font-bold text-base tracking-wider uppercase transition shadow-xl shadow-[#C91F32]/30 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span>SPIN NOW</span>
          </Link>
          <Link
            to="/how-it-works"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-gray-200 font-semibold text-base transition flex items-center justify-center space-x-2"
          >
            <span>How It Works</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>

        {/* Brand Garment Tagline */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400 font-medium">
          <span className="flex items-center space-x-1.5"><ShoppingBag className="w-4 h-4 text-[#C91F32]" /><span>Premium T-Shirts</span></span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center space-x-1.5"><ShoppingBag className="w-4 h-4 text-[#D4AF37]" /><span>Stylist Shirts</span></span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center space-x-1.5"><ShoppingBag className="w-4 h-4 text-[#C91F32]" /><span>Slim & Baggy Jeans</span></span>
          <span className="text-gray-700">•</span>
          <span className="flex items-center space-x-1.5"><ShoppingBag className="w-4 h-4 text-[#D4AF37]" /><span>Formal & Casual Trousers</span></span>
        </div>
      </section>

      {/* Four Reward Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wide">
            Monthly Spin Rewards
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Every verified customer gets 1 free spin every calendar month at midnight IST.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* FREE CUSTOMISED T-SHIRT (₹3000+ Bill) */}
          <div className="p-5 rounded-2xl bg-[#161616] border-2 border-[#C91F32] hover:border-[#D4AF37] transition space-y-3 relative overflow-hidden group shadow-xl shadow-[#C91F32]/10">
            <div className="w-10 h-10 rounded-xl bg-[#C91F32]/20 border border-[#C91F32]/30 flex items-center justify-center text-[#C91F32]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">FREE Customised T-Shirt</h3>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Buy above ₹3,000+ bill & receive an exclusive premium custom-designed BINGOOO T-Shirt completely free!
            </p>
            <span className="inline-block text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
              ₹3000+ Bill Exclusive
            </span>
          </div>

          {/* 20% OFF */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition space-y-3 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-black text-sm">
              20%
            </div>
            <h3 className="text-base font-bold text-white font-display">20% Mega Discount</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Unlock a mega 20% discount on luxury suits, party shirts, and seasonal trousers.
            </p>
            <span className="inline-block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Mega Savings
            </span>
          </div>

          {/* 10% OFF */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-[#2A2A2A] hover:border-[#C91F32]/50 transition space-y-3 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-[#C91F32]/20 border border-[#C91F32]/30 flex items-center justify-center text-[#C91F32] font-black text-sm">
              10%
            </div>
            <h3 className="text-base font-bold text-white font-display">10% OFF Entire Bill</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Flat 10% savings on any combination of shirts, jeans, and polo t-shirts.
            </p>
            <span className="inline-block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Storewide Discount
            </span>
          </div>

          {/* 5% OFF */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition space-y-3 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-black text-sm">
              5%
            </div>
            <h3 className="text-base font-bold text-white font-display">5% Instant Discount</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Instant savings on Korean trousers and summer t-shirts on checkout.
            </p>
            <span className="inline-block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Instant In-Store Pass
            </span>
          </div>

          {/* FREE GIFT */}
          <div className="p-5 rounded-2xl bg-[#161616] border border-[#2A2A2A] hover:border-[#C91F32]/50 transition space-y-3 relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-[#C91F32]/20 border border-[#C91F32]/30 flex items-center justify-center text-[#C91F32]">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white font-display">FREE Accessory</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Win an exclusive BINGOOO branded fashion accessory or keychain given free on visit.
            </p>
            <span className="inline-block text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Limited Gift Stock
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141414] rounded-3xl border border-[#222222] p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wide">
              How To Play & Claim Rewards
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Three effortless steps to claim your discount at our physical store in Srikakulam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#C91F32] text-white font-bold flex items-center justify-center mx-auto md:mx-0 shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold text-white">Visit & Spin The Wheel</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                No phone number or OTP verification needed! Simply open the wheel and tap spin to participate.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#111111] font-bold flex items-center justify-center mx-auto md:mx-0 shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold text-white">Spin The Wheel</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hit the central spin button! The server securely commits your prize and delivers your unique reward code.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto md:mx-0 shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold text-white">Redeem At Store Checkout</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Show your unique voucher code (e.g. BGO-XXXX-XXXX) to the cashier at our Srikakulam store to apply your discount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store Location & Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#181818] via-[#1F1F1F] to-[#181818] border border-[#2A2A2A] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wide text-white">
              Visit BINGOOO In Srikakulam
            </h3>
            <p className="text-sm text-gray-300 flex items-center justify-center md:justify-start space-x-2">
              <MapPin className="w-4 h-4 text-[#C91F32]" />
              <span>Main Road, Srikakulam, Andhra Pradesh, India</span>
            </p>
            <p className="text-xs text-gray-400">
              Open 7 days a week: 10:00 AM to 9:30 PM IST
            </p>
          </div>

          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm tracking-wide hover:bg-gray-200 transition shrink-0"
          >
            Get Store Directions
          </Link>
        </div>
      </section>
    </div>
  );
};
