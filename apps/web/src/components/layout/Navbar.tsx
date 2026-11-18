import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Gift, LogOut, User, Menu, X, ArrowUpRight, Instagram } from 'lucide-react';
import { CelestialEmblem } from './CelestialEmblem';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem('bingooo_customer_token');
  const userEmail = localStorage.getItem('bingooo_customer_email');
  const userName = localStorage.getItem('bingooo_customer_name');

  const handleLogout = () => {
    localStorage.removeItem('bingooo_customer_token');
    localStorage.removeItem('bingooo_customer_email');
    localStorage.removeItem('bingooo_customer_name');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  // Helper to check active state
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/75 border-b border-white/[0.08] text-[#F5F5F7] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Apple-style Wordmark Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center space-x-2 group cursor-pointer"
          title="BINGOOO Homepage"
        >
          <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:opacity-85 transition-opacity">
            BINGO<span className="text-[#0071E3]">OO</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[#86868B] font-medium hidden sm:inline-block pl-1">
            Store
          </span>
        </Link>

        {/* Minimal Desktop Nav Links (3 essential destinations only) */}
        <nav className="hidden md:flex items-center space-x-8 text-[13px] font-medium tracking-normal">
          <Link
            to="/spin"
            className={`transition-colors py-1 ${
              isActive('/spin')
                ? 'text-white font-semibold'
                : 'text-[#86868B] hover:text-[#F5F5F7]'
            }`}
          >
            Spin & Win
          </Link>
          <Link
            to="/club"
            className={`transition-colors py-1 ${
              isActive('/club')
                ? 'text-white font-semibold'
                : 'text-[#86868B] hover:text-[#F5F5F7]'
            }`}
          >
            Rewards Club
          </Link>
          <Link
            to="/rewards"
            className={`transition-colors py-1 ${
              isActive('/rewards')
                ? 'text-white font-semibold'
                : 'text-[#86868B] hover:text-[#F5F5F7]'
            }`}
          >
            Vouchers
          </Link>
          <Link
            to="/contact"
            className={`transition-colors py-1 ${
              isActive('/contact')
                ? 'text-white font-semibold'
                : 'text-[#86868B] hover:text-[#F5F5F7]'
            }`}
          >
            Store
          </Link>
          <Link
            to="/instagram"
            className={`transition-colors py-1 flex items-center space-x-1 ${
              isActive('/instagram')
                ? 'text-white font-semibold'
                : 'text-[#86868B] hover:text-[#F5F5F7]'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
            <span>Reels</span>
          </Link>
        </nav>

        {/* Right Actions: Theme Toggle, User Auth & CTA */}
        <div className="flex items-center space-x-3">
          <CelestialEmblem />

          {userEmail ? (
            <div className="hidden sm:flex items-center space-x-2 pl-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-[#86868B]">
                <User className="w-3.5 h-3.5 text-[#0071E3]" />
                <span className="max-w-[100px] truncate text-white text-[12px] font-normal">
                  {userName || userEmail.split('@')[0]}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full text-[#86868B] hover:text-white hover:bg-white/[0.08] transition"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-block text-[13px] text-[#86868B] hover:text-[#F5F5F7] transition font-medium px-2 py-1"
            >
              Sign In
            </Link>
          )}

          {/* Minimal Apple Blue Pill CTA */}
          <Link
            to="/spin"
            onClick={closeMenu}
            className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-[13px] font-medium tracking-normal transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center space-x-1.5 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-white/90" />
            <span>Spin</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#86868B] hover:text-white hover:bg-white/[0.08] transition shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Clean Apple Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-black/95 backdrop-blur-2xl px-6 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-1">
            <Link
              to="/spin"
              onClick={closeMenu}
              className={`py-2.5 text-base font-medium flex items-center justify-between border-b border-white/[0.04] ${
                isActive('/spin') ? 'text-white font-semibold' : 'text-[#86868B]'
              }`}
            >
              <span>Spin & Win</span>
              <span className="text-xs text-[#0071E3]">Play</span>
            </Link>
            <Link
              to="/club"
              onClick={closeMenu}
              className={`py-2.5 text-base font-medium flex items-center justify-between border-b border-white/[0.04] ${
                isActive('/club') ? 'text-white font-semibold' : 'text-[#86868B]'
              }`}
            >
              <span>Rewards Club</span>
              <span className="text-xs text-[#86868B]">Scratch & Coins</span>
            </Link>
            <Link
              to="/rewards"
              onClick={closeMenu}
              className={`py-2.5 text-base font-medium flex items-center justify-between border-b border-white/[0.04] ${
                isActive('/rewards') ? 'text-white font-semibold' : 'text-[#86868B]'
              }`}
            >
              <span>My Vouchers</span>
              <Gift className="w-4 h-4 text-[#86868B]" />
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className={`py-2.5 text-base font-medium flex items-center justify-between border-b border-white/[0.04] ${
                isActive('/contact') ? 'text-white font-semibold' : 'text-[#86868B]'
              }`}
            >
              <span>Store Location & Hours</span>
              <span className="text-xs text-[#86868B]">Srikakulam</span>
            </Link>
            <Link
              to="/instagram"
              onClick={closeMenu}
              className={`py-2.5 text-base font-medium flex items-center justify-between border-b border-white/[0.04] ${
                isActive('/instagram') ? 'text-white font-semibold' : 'text-[#86868B]'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-[#E1306C]" />
                <span>Instagram Reels</span>
              </span>
              <span className="text-xs text-[#0071E3]">@bingooo.co.in</span>
            </Link>
            <a
              href="https://www.bingooo.co.in"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="py-2.5 text-base font-medium text-[#86868B] flex items-center justify-between border-b border-white/[0.04]"
            >
              <span>Official Clothing Store</span>
              <ArrowUpRight className="w-4 h-4 text-[#86868B]" />
            </a>
          </div>

          {/* User Sign In / Profile */}
          <div className="pt-2">
            {userEmail ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0071E3]/20 text-[#0071E3] flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] text-[#86868B]">Signed in as</p>
                    <p className="text-xs font-medium text-white max-w-[180px] truncate">{userName || userEmail}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#FF453A] hover:underline px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full flex items-center justify-center py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-medium transition"
              >
                Sign In to Rewards Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
