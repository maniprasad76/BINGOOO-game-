import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift,
  CheckCircle2,
  Clock,
  Search,
  Check,
  AlertTriangle,
  FileText,
  Printer,
  QrCode,
  LogOut,
  RefreshCw,
  Sparkles,
  Shirt,
  ShieldCheck,
  Copy,
  User,
  Phone,
  Mail,
  Calendar,
  Tag
} from 'lucide-react';
import { ApiClient } from '../services/api.service';
import { PrintableStandeeModal } from '../components/admin/PrintableStandeeModal';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Primary gift winners list
  const [giftWinners, setGiftWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED' | 'REDEEMED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Quick Redemption Section
  const [redeemCode, setRedeemCode] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [redeemNotes, setRedeemNotes] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemStatus, setRedeemStatus] = useState<any>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Standee Modal
  const [standeeModalOpen, setStandeeModalOpen] = useState(false);

  // Selected winner for quick handover modal
  const [selectedWinner, setSelectedWinner] = useState<any | null>(null);

  const adminUser = JSON.parse(localStorage.getItem('bingooo_admin_user') || '{}');

  const loadGiftWinners = async () => {
    try {
      setLoading(true);
      // Fetch gifts only: FREE_GIFT and FREE_CUSTOM_TSHIRT
      const res = await ApiClient.getAdminRewards(1, statusFilter, 'GIFTS_ONLY');
      setGiftWinners(res?.data || []);
    } catch (err: any) {
      console.error('Failed to load gift winners', err);
      if (err.status === 401 || err.message?.includes('Unauthorized')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGiftWinners();
  }, [statusFilter]);

  const handleLogout = () => {
    ApiClient.logoutAdmin();
    navigate('/admin/login');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError(null);
    setRedeemStatus(null);
    setRedeemLoading(true);

    const fullNotes = billNumber ? `Invoice #${billNumber}. ${redeemNotes}`.trim() : redeemNotes;

    try {
      const res = await ApiClient.redeemVoucher(redeemCode.trim().toUpperCase(), fullNotes);
      setRedeemStatus(res);
      setRedeemCode('');
      setBillNumber('');
      setRedeemNotes('');
      setSelectedWinner(null);
      await loadGiftWinners();
    } catch (err: any) {
      setRedeemError(err.message || 'Voucher redemption failed. Please verify code.');
    } finally {
      setRedeemLoading(false);
    }
  };

  const handleQuickHandover = (winner: any) => {
    setSelectedWinner(winner);
    setRedeemCode(winner.code);
    setRedeemError(null);
    setRedeemStatus(null);
    // Scroll smoothly to quick redemption box
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter winners by search query
  const filteredWinners = giftWinners.filter((winner) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = winner.customer?.displayName?.toLowerCase() || '';
    const phone = winner.customer?.phoneNumber?.toLowerCase() || '';
    const email = winner.customer?.email?.toLowerCase() || '';
    const code = winner.code?.toLowerCase() || '';
    const prizeName = winner.prize?.name?.toLowerCase() || '';
    return name.includes(q) || phone.includes(q) || email.includes(q) || code.includes(q) || prizeName.includes(q);
  });

  const totalGiftsCount = giftWinners.length;
  const pendingCount = giftWinners.filter((w) => w.status === 'ISSUED').length;
  const redeemedCount = giftWinners.filter((w) => w.status === 'REDEEMED').length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200">
      {/* Bauhaus Topbar */}
      <header className="bg-[#141414] border-b-2 border-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#C91F32] border-2 border-white flex items-center justify-center shadow-[3px_3px_0px_0px_#FFFFFF]">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-white font-display tracking-wider">
                BINGO<span className="text-[#C91F32]">OO</span>
              </span>
              <span className="px-2 py-0.5 bg-[#F5B700] text-black border border-black text-[10px] font-mono font-black uppercase tracking-wider">
                GIFT WINNERS DESK
              </span>
            </div>
            <p className="text-[11px] font-mono text-gray-400">
              Srikakulam Store // In-Store Free Gift & T-Shirt Claim Counter
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setStandeeModalOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#F5B700] hover:bg-[#DBA300] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT COUNTER STANDEE</span>
          </button>

          <span className="text-xs font-mono text-gray-300 hidden md:inline">
            Admin: <strong className="text-white">{adminUser.name || 'Store Cashier'}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-2 bg-[#222222] hover:bg-[#333333] border border-white text-xs font-mono text-gray-200 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* KPI Counter Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#141414] border-2 border-white shadow-[4px_4px_0px_0px_#0047AB]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                TOTAL GIFT WINNERS
              </span>
              <Gift className="w-5 h-5 text-[#0047AB]" />
            </div>
            <span className="text-3xl font-black font-display text-white mt-2 block">
              {totalGiftsCount}
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              Free Gifts & ₹3000+ Bill T-Shirts
            </span>
          </div>

          <div className="p-4 bg-[#141414] border-2 border-white shadow-[4px_4px_0px_0px_#F5B700]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F5B700] uppercase tracking-wider">
                PENDING HANDOVER
              </span>
              <Clock className="w-5 h-5 text-[#F5B700]" />
            </div>
            <span className="text-3xl font-black font-display text-[#F5B700] mt-2 block">
              {pendingCount}
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              Awaiting customer in-store collection
            </span>
          </div>

          <div className="p-4 bg-[#141414] border-2 border-white shadow-[4px_4px_0px_0px_#00A86B]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00A86B] uppercase tracking-wider">
                HANDED OVER & REDEEMED
              </span>
              <CheckCircle2 className="w-5 h-5 text-[#00A86B]" />
            </div>
            <span className="text-3xl font-black font-display text-[#00A86B] mt-2 block">
              {redeemedCount}
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              Successfully fulfilled at cash counter
            </span>
          </div>
        </div>

        {/* CASHIER QUICK REDEMPTION DESK */}
        <div className="p-5 sm:p-6 bg-[#161616] border-3 border-white shadow-[6px_6px_0px_0px_#C91F32] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#333333] pb-3">
            <div>
              <h3 className="text-lg font-black font-display uppercase tracking-wider text-white flex items-center space-x-2">
                <span>Cashier Handover Desk</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#C91F32] text-white">
                  VERIFY & DISPENSE
                </span>
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Scan QR or enter voucher code from winner's phone to verify and mark gift handed over.
              </p>
            </div>
            {selectedWinner && (
              <span className="text-xs font-mono bg-[#F5B700] text-black px-2.5 py-1 font-bold border border-black">
                SELECTED: {selectedWinner.code} ({selectedWinner.prize?.name})
              </span>
            )}
          </div>

          {redeemStatus && (
            <div className="p-4 bg-emerald-950/70 border-2 border-emerald-500 text-emerald-100 flex items-start space-x-3 font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">GIFT REDEEMED SUCCESSFULLY!</p>
                <p className="text-xs text-emerald-200 mt-1">
                  Voucher: <strong>{redeemStatus.reward?.code}</strong> | Prize: <strong>{redeemStatus.reward?.prize?.name}</strong>
                </p>
                <p className="text-[11px] text-emerald-300">
                  Customer: {redeemStatus.reward?.customer?.displayName || 'Customer'} ({redeemStatus.reward?.customer?.phoneNumber || redeemStatus.reward?.customer?.email || 'Store User'})
                </p>
              </div>
            </div>
          )}

          {redeemError && (
            <div className="p-4 bg-red-950/70 border-2 border-red-500 text-red-100 flex items-start space-x-3 font-mono">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">REDEMPTION REJECTED</p>
                <p className="text-xs text-red-200 mt-0.5">{redeemError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleRedeemSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-1">
                VOUCHER CODE *
              </label>
              <input
                type="text"
                placeholder="e.g. BG-WIN-XXXX"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                required
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border-2 border-white text-white font-mono font-bold text-sm focus:outline-none focus:border-[#F5B700] uppercase"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-1">
                BILL / INVOICE # (REQ FOR ₹3000+ T-SHIRT)
              </label>
              <input
                type="text"
                placeholder="e.g. INV-2026-8841"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white font-mono text-sm focus:outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-gray-300 mb-1">
                HANDOVER NOTES (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="e.g. Size L handed over"
                value={redeemNotes}
                onChange={(e) => setRedeemNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border-2 border-[#333333] text-white font-mono text-sm focus:outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                disabled={redeemLoading || !redeemCode}
                className="w-full py-2.5 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {redeemLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>VERIFY & HAND OVER</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* FREE GIFT WINNERS LIST SECTION */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black font-display uppercase tracking-wider text-white">
                Free Gift & T-Shirt Winners
              </h2>
              <p className="text-xs font-mono text-gray-400">
                Only customers who won physical gifts are listed here for store fulfillment.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 bg-[#141414] p-1 border-2 border-white">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ALL ({totalGiftsCount})
              </button>
              <button
                onClick={() => setStatusFilter('ISSUED')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition ${
                  statusFilter === 'ISSUED'
                    ? 'bg-[#F5B700] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                PENDING ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('REDEEMED')}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition ${
                  statusFilter === 'REDEEMED'
                    ? 'bg-[#00A86B] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                CLAIMED ({redeemedCount})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by customer name, phone number, email, or voucher code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border-2 border-white text-white font-mono text-xs focus:outline-none focus:border-[#F5B700] transition"
            />
          </div>

          {/* Winners Cards / List */}
          {loading ? (
            <div className="p-12 text-center bg-[#141414] border-2 border-white">
              <RefreshCw className="w-8 h-8 text-[#F5B700] animate-spin mx-auto mb-2" />
              <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                LOADING GIFT WINNERS...
              </p>
            </div>
          ) : filteredWinners.length === 0 ? (
            <div className="p-12 text-center bg-[#141414] border-2 border-dashed border-[#333333]">
              <Gift className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold font-mono text-gray-300 uppercase">
                NO GIFT WINNERS FOUND
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? 'No results matched your search term.'
                  : 'No customers have won this gift category yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWinners.map((winner) => {
                const isTshirt = winner.prize?.type === 'FREE_CUSTOM_TSHIRT';
                const isPending = winner.status === 'ISSUED';
                const isRedeemed = winner.status === 'REDEEMED';

                return (
                  <div
                    key={winner.id}
                    className={`bg-[#141414] border-2 border-white p-5 space-y-4 relative transition hover:translate-x-0.5 hover:translate-y-0.5 ${
                      isPending
                        ? 'shadow-[4px_4px_0px_0px_#F5B700]'
                        : 'shadow-[4px_4px_0px_0px_#00A86B]'
                    }`}
                  >
                    {/* Header with Prize Type */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#262626] pb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-9 h-9 border border-white flex items-center justify-center shrink-0 ${
                            isTshirt ? 'bg-[#0047AB] text-white' : 'bg-[#C91F32] text-white'
                          }`}
                        >
                          {isTshirt ? <Shirt className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-gray-400">
                            {isTshirt ? '₹3000+ BILL QUALIFIED' : 'STORE GIFT'}
                          </span>
                          <h4 className="font-display font-black text-sm text-white uppercase leading-snug">
                            {winner.prize?.name || 'Free Gift'}
                          </h4>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider border ${
                          isPending
                            ? 'bg-[#F5B700] text-black border-black'
                            : isRedeemed
                            ? 'bg-[#00A86B] text-white border-white'
                            : 'bg-gray-800 text-gray-400 border-gray-600'
                        }`}
                      >
                        {winner.status}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-center space-x-2 text-white">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-bold">
                          {winner.customer?.displayName || winner.customer?.phoneNumber || winner.customer?.email || 'Store Customer'}
                        </span>
                      </div>
                      {winner.customer?.phoneNumber && (
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span>{winner.customer.phoneNumber}</span>
                        </div>
                      )}
                      {winner.customer?.email && (
                        <div className="flex items-center space-x-2 text-gray-300 truncate">
                          <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          <span className="truncate">{winner.customer.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Voucher Code Box */}
                    <div className="p-2.5 bg-[#0A0A0A] border border-[#333333] flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">
                          VOUCHER CODE
                        </span>
                        <span className="text-sm font-mono font-black text-[#F5B700] tracking-wider">
                          {winner.code}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(winner.code)}
                        className="p-1.5 bg-[#1F1F1F] hover:bg-[#333333] text-gray-300 border border-[#444444] transition"
                        title="Copy code"
                      >
                        {copiedCode === winner.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Dates & Redemption Details */}
                    <div className="text-[10px] font-mono text-gray-400 space-y-1 border-t border-[#222222] pt-2">
                      <div className="flex items-center justify-between">
                        <span>Won on:</span>
                        <span className="text-gray-300">
                          {new Date(winner.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Expires on:</span>
                        <span className="text-gray-300">
                          {new Date(winner.expiresAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {isRedeemed && winner.redemption && (
                        <div className="pt-1 border-t border-[#222222] text-emerald-400">
                          <span>
                            Verified by: {winner.redemption.staff?.name || winner.redemption.staff?.username || 'Staff'}
                          </span>
                          {winner.redemption.notes && (
                            <p className="text-[9px] text-gray-400 mt-0.5 truncate">
                              {winner.redemption.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action button if pending */}
                    {isPending && (
                      <button
                        onClick={() => handleQuickHandover(winner)}
                        className="w-full py-2.5 bg-[#F5B700] hover:bg-[#DBA300] text-black font-mono font-black text-xs uppercase tracking-wider transition-all border border-black shadow-[2px_2px_0px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center space-x-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>DISPENSE GIFT IN STORE</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Printable Counter Standee Modal */}
      <PrintableStandeeModal
        isOpen={standeeModalOpen}
        onClose={() => setStandeeModalOpen(false)}
        checkInUrl={`${window.location.origin}/club/check-in`}
      />
    </div>
  );
};
