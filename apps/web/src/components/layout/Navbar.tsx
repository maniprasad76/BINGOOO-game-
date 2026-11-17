import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Gift, Clock, LogOut, User, Menu, X, Coins, Share2, QrCode, Cake, ExternalLink } from 'lucide-react';
import { CelestialEmblem } from './CelestialEmblem';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem('bingooo_customer_token');
  const userEmail = localStorage.getItem('bingooo_customer_email');
  const userName = localStorage.getItem('bingooo_customer_name');

  const handleLogout = async () => {
    localStorage.removeItem('bingooo_customer_token');
    localStorage.removeItem('bingooo_customer_email');
    localStorage.removeItem('bingooo_customer_name');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0F0F0F] border-b-2 border-[#282828] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Bauhaus Geometric Brand Logo - Directly opens official bingooo.co.in website */}
        <a
          href="https://www.bingooo.co.in"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          className="flex items-center space-x-2.5 group cursor-pointer"
          title="Visit official store: https://www.bingooo.co.in"
        >
          <div className="w-8 h-8 bg-[#C91F32] border-2 border-white flex items-center justify-center font-black text-sm tracking-tighter text-white shadow-[2px_2px_0px_0px_#F5B700] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            B
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-xl sm:text-2xl font-black tracking-widest text-white font-display uppercase group-hover:text-[#F5B700] transition-colors flex items-center">
              BINGO<span className="text-[#C91F32]">OO</span>
              <span className="text-xs font-mono font-bold text-[#F5B700] lowercase tracking-normal ml-0.5 inline-flex items-center">
                .co.in
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </span>
            </span>
            <span className="text-[9px] text-gray-400 font-mono tracking-wider hidden sm:block">
              SRIKAKULAM // MEN'S WEAR // STORE ↗
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-5 text-xs font-bold uppercase tracking-wider">
          <Link
            to="/club"
            className={`transition flex items-center space-x-1.5 py-1 border-b-2 ${
              location.pathname === '/club' || location.pathname === '/'
                ? 'text-[#F5B700] border-[#F5B700]'
                : 'text-gray-300 hover:text-white border-transparent hover:border-[#F5B700]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5B700]" />
            <span>Rewards Club</span>
          </Link>
          <Link
            to="/spin"
            className={`transition py-1 border-b-2 ${
              location.pathname === '/spin'
                ? 'text-[#C91F32] border-[#C91F32]'
                : 'text-gray-300 hover:text-white border-transparent hover:border-[#C91F32]'
            }`}
          >
            Spin & Win
          </Link>
          <Link
            to="/club/wallet"
            className={`transition py-1 border-b-2 ${
              location.pathname === '/club/wallet'
                ? 'text-[#F5B700] border-[#F5B700]'
                : 'text-gray-300 hover:text-white border-transparent hover:border-[#F5B700]'
            }`}
          >
            Coins Wallet
          </Link>
          <Link
            to="/rewards"
            className={`transition flex items-center space-x-1 py-1 border-b-2 ${
              location.pathname === '/rewards'
                ? 'text-[#C91F32] border-[#C91F32]'
                : 'text-gray-300 hover:text-white border-transparent hover:border-[#C91F32]'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-gray-400" />
            <span>Vouchers</span>
          </Link>
          <Link
            to="/how-it-works"
            className="text-gray-400 hover:text-white transition py-1 border-b-2 border-transparent hover:border-gray-400"
          >
            How It Works
          </Link>
          <Link
            to="/contact"
            className="text-gray-400 hover:text-white transition py-1 border-b-2 border-transparent hover:border-gray-400"
          >
            Store Info
          </Link>
          <a
            href="https://www.bingooo.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5B700] hover:text-white transition py-1 px-2 bg-[#1C1C1C] border border-[#333333] hover:border-[#F5B700] flex items-center space-x-1 font-mono text-[11px]"
            title="Open official bingooo.co.in website"
          >
            <span>STORE ↗</span>
          </a>
        </nav>

        {/* Customer State, Celestial Icon & Action Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sun & Moon Celestial Icon */}
          <CelestialEmblem />

          {userEmail ? (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#181818] border border-[#333333] text-xs font-mono text-gray-300">
                <User className="w-3.5 h-3.5 text-[#F5B700]" />
                <span className="max-w-[120px] truncate">{userName || userEmail}</span>
              </span>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex p-1.5 text-gray-400 hover:text-white hover:bg-[#222222] border border-transparent hover:border-[#444] transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-block px-3.5 py-1.5 bg-[#1C1C1C] hover:bg-[#282828] text-gray-200 text-xs font-bold uppercase tracking-wider transition border border-[#3A3A3A]"
            >
              Sign In
            </Link>
          )}

          <Link
            to="/spin"
            onClick={closeMenu}
            className="px-3 sm:px-4 py-2 bg-[#C91F32] hover:bg-[#B01828] text-white text-xs font-black tracking-widest uppercase transition-all border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center space-x-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5B700]" />
            <span>SPIN NOW</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-[#1f1f1f] border-2 border-[#333] transition shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Bauhaus Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#282828] bg-[#121212] px-4 pt-4 pb-6 space-y-3">
          {userEmail && (
            <div className="p-3 bg-[#181818] border-2 border-[#333333] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#C91F32] border border-white flex items-center justify-center font-black text-xs text-white">
                  <User className="w-4 h-4 text-[#F5B700]" />
                </div>
                <div className="text-left font-mono">
                  <p className="text-[10px] text-gray-400 uppercase">IDENTIFIED ACCOUNT</p>
                  <p className="text-xs font-bold text-white max-w-[180px] truncate">{userName || userEmail}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs bg-[#242424] hover:bg-[#2e2e2e] text-red-400 border border-[#444]"
              >
                Sign Out
              </button>
            </div>
          )}

          {!userEmail && (
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#1F1F1F] text-gray-200 text-xs font-black uppercase tracking-wider border-2 border-[#383838] shadow-[2px_2px_0px_0px_#FFFFFF]"
            >
              <User className="w-4 h-4 text-[#F5B700]" />
              <span>Customer Sign In</span>
            </Link>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1 font-display">
            <Link
              to="/club"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E] shadow-[2px_2px_0px_0px_#C91F32]"
            >
              <span className="font-mono text-[10px] text-gray-500">01</span>
              <span>Rewards Club</span>
            </Link>
            <Link
              to="/spin"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E] shadow-[2px_2px_0px_0px_#F5B700]"
            >
              <span className="font-mono text-[10px] text-gray-500">02</span>
              <span>Spin & Win</span>
            </Link>
            <Link
              to="/club/wallet"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E] shadow-[2px_2px_0px_0px_#16428C]"
            >
              <span className="font-mono text-[10px] text-gray-500">03</span>
              <span>Coins Wallet</span>
            </Link>
            <Link
              to="/rewards"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E] shadow-[2px_2px_0px_0px_#FFFFFF]"
            >
              <span className="font-mono text-[10px] text-gray-500">04</span>
              <span>My Vouchers</span>
            </Link>
            <Link
              to="/club/refer"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E]"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Refer Friends</span>
            </Link>
            <Link
              to="/club/check-in"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E]"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-400" />
              <span>QR Check-in</span>
            </Link>
            <Link
              to="/club/birthday"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E]"
            >
              <Cake className="w-3.5 h-3.5 text-pink-400" />
              <span>Birthday Pass</span>
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="flex items-center space-x-2 p-2.5 bg-[#181818] hover:bg-[#222222] text-xs font-bold uppercase tracking-wide border-2 border-[#2E2E2E]"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Store Info</span>
            </Link>
          </div>

          <div className="pt-2">
            <a
              href="https://www.bingooo.co.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#C91F32] hover:bg-[#B01828] text-white text-xs font-mono font-black uppercase tracking-wider border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] transition"
            >
              <span>🌐 VISIT BINGOOO.CO.IN STORE ↗</span>
            </a>
          </div>

          <div className="pt-3 border-t border-[#262626] flex justify-between text-[11px] font-mono text-gray-400">
            <Link to="/how-it-works" onClick={closeMenu} className="hover:text-white">
              [ HOW IT WORKS ]
            </Link>
            <Link to="/terms" onClick={closeMenu} className="hover:text-white">
              [ TERMS ]
            </Link>
            <Link to="/privacy" onClick={closeMenu} className="hover:text-white">
              [ PRIVACY ]
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
