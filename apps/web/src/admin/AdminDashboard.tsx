import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Gift,
  CheckCircle2,
  Settings,
  ShieldAlert,
  LogOut,
  RefreshCw,
  Search,
  Check,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { ApiClient } from '../services/api.service';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'redemptions' | 'prizes' | 'spins' | 'customers' | 'settings'>('overview');

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Redemption state
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemNotes, setRedeemNotes] = useState('');
  const [redeemStatus, setRedeemStatus] = useState<any>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Prizes state
  const [prizes, setPrizes] = useState<any[]>([]);
  const [prizeSuccess, setPrizeSuccess] = useState<string | null>(null);

  // History states
  const [spinsList, setSpinsList] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [settingsList, setSettingsList] = useState<any[]>([]);

  const adminUser = JSON.parse(localStorage.getItem('bingooo_admin_user') || '{}');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [dash, pz, sp, cs, st] = await Promise.all([
        ApiClient.getAdminDashboard(),
        ApiClient.getAdminPrizes(),
        ApiClient.getAdminSpins(1),
        ApiClient.getAdminCustomers(1),
        ApiClient.getAdminSettings()
      ]);
      setMetrics(dash);
      setPrizes(pz || []);
      setSpinsList(sp?.data || []);
      setCustomersList(cs?.data || []);
      setSettingsList(st || []);
    } catch (err) {
      console.error(err);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    ApiClient.logoutAdmin();
    navigate('/admin/login');
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setRedeemError(null);
    setRedeemStatus(null);

    try {
      const res = await ApiClient.redeemVoucher(redeemCode, redeemNotes);
      setRedeemStatus(res);
      setRedeemCode('');
      setRedeemNotes('');
      loadDashboard();
    } catch (err: any) {
      setRedeemError(err.message || 'Redemption failed');
    }
  };

  const handleSavePrizes = async () => {
    try {
      setPrizeSuccess(null);
      await ApiClient.updateAdminPrizes(prizes);
      setPrizeSuccess('Prize probabilities updated successfully!');
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update prizes');
    }
  };

  const handlePrizeWeightChange = (id: string, weightStr: string) => {
    const val = parseInt(weightStr, 10) || 0;
    setPrizes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, weight: val, basisPoints: val * 100 } : p))
    );
  };

  const totalConfiguredWeight = prizes
    .filter((p) => p.isActive)
    .reduce((sum, p) => sum + p.weight, 0);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200">
      {/* Admin Topbar */}
      <header className="bg-[#141414] border-b border-[#222222] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-black text-white font-display tracking-wider">
            BINGO<span className="text-[#C91F32]">OO</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest">
            {adminUser.role || 'STAFF'} PORTAL
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-400">
            Signed in as: <strong className="text-white">{adminUser.name || 'Admin'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#333333] text-xs text-gray-300 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className="border-b border-[#1F1F1F] bg-[#111111] px-6 flex space-x-6 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3.5 border-b-2 transition ${
            activeTab === 'overview' ? 'border-[#C91F32] text-white' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('redemptions')}
          className={`py-3.5 border-b-2 transition ${
            activeTab === 'redemptions' ? 'border-[#C91F32] text-white' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Redeem Voucher (Staff)
        </button>
        {adminUser.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setActiveTab('prizes')}
            className={`py-3.5 border-b-2 transition ${
              activeTab === 'prizes' ? 'border-[#C91F32] text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Prize Probabilities
          </button>
        )}
        <button
          onClick={() => setActiveTab('spins')}
          className={`py-3.5 border-b-2 transition ${
            activeTab === 'spins' ? 'border-[#C91F32] text-white' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Spins History
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`py-3.5 border-b-2 transition ${
            activeTab === 'customers' ? 'border-[#C91F32] text-white' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Verified Customers
        </button>
      </div>

      {/* Main Body */}
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#141414] border border-[#222222]">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Total Customers</span>
                <span className="text-2xl font-bold font-display text-white mt-1 block">
                  {metrics.totalCustomers}
                </span>
                <span className="text-[10px] text-emerald-400">{metrics.verifiedCustomers} Verified Numbers</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-[#222222]">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Spins This Month</span>
                <span className="text-2xl font-bold font-display text-white mt-1 block">
                  {metrics.spinsTotal}
                </span>
                <span className="text-[10px] text-[#D4AF37]">{metrics.spinsToday} Today</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-[#222222]">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Active Vouchers</span>
                <span className="text-2xl font-bold font-display text-emerald-400 mt-1 block">
                  {metrics.rewardCounts.issued}
                </span>
                <span className="text-[10px] text-gray-400">{metrics.rewardCounts.redeemed} Redeemed</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-[#222222]">
                <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Gift Inventory</span>
                <span className="text-2xl font-bold font-display text-[#D4AF37] mt-1 block">
                  {metrics.totalGiftStockRemaining}
                </span>
                <span className="text-[10px] text-gray-400">Available Stock</span>
              </div>
            </div>

            {/* Prize Outcomes Summary */}
            <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] space-y-4">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wide">
                Cumulative Prize Distribution
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-[#191919] border border-[#262626]">
                  <span className="text-xs text-gray-400 block">10% OFF Bill</span>
                  <span className="text-xl font-bold text-[#C91F32] mt-1 block">{metrics.prizeCounts.discount10}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#191919] border border-[#262626]">
                  <span className="text-xs text-gray-400 block">5% OFF Bill</span>
                  <span className="text-xl font-bold text-[#D4AF37] mt-1 block">{metrics.prizeCounts.discount5}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#191919] border border-[#262626]">
                  <span className="text-xs text-gray-400 block">Free Gifts Won</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block">{metrics.prizeCounts.freeGift}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#191919] border border-[#262626]">
                  <span className="text-xs text-gray-400 block">Next Month Chances</span>
                  <span className="text-xl font-bold text-gray-400 mt-1 block">{metrics.prizeCounts.noPrize}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REDEMPTION TAB */}
        {activeTab === 'redemptions' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display uppercase text-white">
                  Staff In-Store Voucher Redemption
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Enter or scan the customer's BGO coupon code to validate and apply their discount.
                </p>
              </div>

              {redeemError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-200">
                  {redeemError}
                </div>
              )}

              {redeemStatus && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200 space-y-1">
                  <p className="font-bold text-sm">VOUCHER REDEEMED SUCCESSFULLY!</p>
                  <p>Code: <strong className="font-mono">{redeemStatus.reward?.code}</strong></p>
                  <p>Applied to: {redeemStatus.redemption?.storeLocation}</p>
                </div>
              )}

              <form onSubmit={handleRedeem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Coupon Code (Format: BGO-XXXX-XXXX)
                  </label>
                  <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    placeholder="BGO-A8F2-9X7K"
                    required
                    className="w-full px-4 py-3 bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl text-white font-mono text-lg font-bold tracking-wider focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Staff Notes / Invoice Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={redeemNotes}
                    onChange={(e) => setRedeemNotes(e.target.value)}
                    placeholder="Bill #10423 — 2 shirts, 1 trouser"
                    className="w-full px-4 py-2.5 bg-[#0E0E0E] border border-[#2A2A2A] rounded-xl text-white text-xs focus:outline-none focus:border-gray-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-900/30"
                >
                  VALIDATE & REDEEM VOUCHER
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PRIZE PROBABILITIES TAB */}
        {activeTab === 'prizes' && adminUser.role === 'SUPER_ADMIN' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-display uppercase text-white">
                    Prize Probabilities Engine
                  </h3>
                  <p className="text-xs text-gray-400">
                    Weights must strictly total 100% (10,000 basis points). Changes affect future spins only.
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  totalConfiguredWeight === 100
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-red-950 text-red-400 border-red-800'
                }`}>
                  Total Weight: {totalConfiguredWeight}% / 100%
                </div>
              </div>

              {prizeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-200">
                  {prizeSuccess}
                </div>
              )}

              <div className="space-y-3 pt-2">
                {prizes.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#181818] border border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-sm font-bold text-white block">{p.name}</span>
                      <span className="text-xs text-gray-400 block">{p.description}</span>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={p.weight}
                          onChange={(e) => handlePrizeWeightChange(p.id, e.target.value)}
                          className="w-16 px-2.5 py-1.5 bg-[#111111] border border-[#2A2A2A] rounded-lg text-white font-mono text-sm text-center focus:outline-none focus:border-[#C91F32]"
                        />
                        <span className="text-xs text-gray-400">%</span>
                      </div>

                      <label className="flex items-center space-x-1.5 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={p.isActive}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setPrizes((prev) =>
                              prev.map((item) => (item.id === p.id ? { ...item, isActive: val } : item))
                            );
                          }}
                          className="rounded border-[#2A2A2A] bg-[#111111] text-[#C91F32]"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSavePrizes}
                  disabled={totalConfiguredWeight !== 100}
                  className="px-6 py-3 rounded-xl bg-[#C91F32] hover:bg-[#A81525] text-white font-bold text-xs uppercase tracking-wider transition disabled:opacity-50"
                >
                  SAVE & PERSIST PROBABILITY SNAPSHOT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SPINS HISTORY TAB */}
        {activeTab === 'spins' && (
          <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] space-y-4">
            <h3 className="text-lg font-bold font-display uppercase text-white">
              Customer Spin Records
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1B1B1B] text-gray-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Period</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Outcome</th>
                    <th className="p-3">Reward Code</th>
                    <th className="p-3">Spin Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {spinsList.map((s) => (
                    <tr key={s.id} className="hover:bg-[#181818]">
                      <td className="p-3 font-mono font-bold text-gray-400">{s.periodKey}</td>
                      <td className="p-3 font-mono text-white">{s.customer?.phoneNumber}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.prize?.type !== 'NO_PRIZE' ? 'bg-[#C91F32]/20 text-[#C91F32]' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {s.prize?.name}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#D4AF37]">{s.reward?.code || '—'}</td>
                      <td className="p-3 text-gray-400">{new Date(s.completedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {spinsList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">
                        No spin attempts recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="p-6 rounded-3xl bg-[#141414] border border-[#222222] space-y-4">
            <h3 className="text-lg font-bold font-display uppercase text-white">
              Verified Customer Directory
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#1B1B1B] text-gray-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Spins</th>
                    <th className="p-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {customersList.map((c) => (
                    <tr key={c.id} className="hover:bg-[#181818]">
                      <td className="p-3 font-mono text-gray-500">{c.id.slice(0, 8)}...</td>
                      <td className="p-3 font-mono text-white font-semibold">{c.phoneNumber}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                          {c.isVerified ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </td>
                      <td className="p-3 text-white font-bold">{c._count?.spins || 0}</td>
                      <td className="p-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
