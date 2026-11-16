import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t-2 border-[#282828] text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-[#C91F32] border border-white flex items-center justify-center font-black text-xs text-white">
                B
              </div>
              <span className="text-2xl font-black text-white font-display tracking-widest uppercase">
                BINGO<span className="text-[#C91F32]">OO</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed font-sans">
              Premier Men's Fashion House in Srikakulam. T-shirts, Shirts, Jeans & Trousers designed with modern geometric elegance.
            </p>
            <div className="font-mono text-[11px] text-[#F5B700] pt-1">
              [ DOMAIN: BINGOOO.CO.IN ]
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 font-mono">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-[#F5B700]" />
              <span>NAVIGATION</span>
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/club" className="hover:text-white transition">→ Rewards Club Hub</Link></li>
              <li><Link to="/spin" className="hover:text-white transition">→ Monthly Spin & Win</Link></li>
              <li><Link to="/club/wallet" className="hover:text-white transition">→ Coins Wallet & Ledger</Link></li>
              <li><Link to="/rewards" className="hover:text-white transition">→ My Reward Vouchers</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">→ How It Works</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">→ Terms & Rules</Link></li>
            </ul>
          </div>

          {/* Store Location */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-[#C91F32]" />
              <span>SRIKAKULAM STORE</span>
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C91F32] shrink-0 mt-0.5" />
                <span className="font-sans text-gray-300">Main Road, Srikakulam, Andhra Pradesh, India — 532001</span>
              </p>
              <p className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#F5B700] shrink-0" />
                <span className="font-mono text-gray-300">10:00 AM – 9:30 PM (DAILY)</span>
              </p>
            </div>
          </div>

          {/* Staff Portal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs font-mono flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-[#16428C]" />
              <span>STAFF TERMINAL</span>
            </h4>
            <div className="p-3 bg-[#141414] border-2 border-[#282828] space-y-2 text-xs shadow-[3px_3px_0px_0px_#C91F32]">
              <p className="text-gray-400 font-sans">Authorized cashiers and store supervisors:</p>
              <Link
                to="/admin/login"
                className="inline-block px-3 py-1.5 bg-[#222222] hover:bg-white hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider transition border border-[#444]"
              >
                STAFF LOGIN →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500">
          <p>© {new Date().getFullYear()} BINGOOO MEN'S WEAR // ALL RIGHTS RESERVED.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1 text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>STRICT SERVER-SIDE CALENDAR ELIGIBILITY (ASIA/KOLKATA)</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
