import React, { useState, useEffect } from 'react';
import { QrCode, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ApiClient } from '../../services/api.service';

export const StoreCheckInPage: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkInMsg, setCheckInMsg] = useState<string | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [st, h] = await Promise.all([
        ApiClient.getStores(),
        ApiClient.getCheckInHistory()
      ]);
      setStores(st);
      setHistory(h);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCheckIn = async (storeId: string) => {
    setCheckInMsg(null);
    setCheckInError(null);
    try {
      const res = await ApiClient.requestCheckIn(storeId);
      if (res.success) {
        setCheckInMsg(res.message);
      } else {
        setCheckInError(res.message);
      }
      await loadData();
    } catch (err: any) {
      setCheckInError(err.message || 'Check-in failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Bauhaus QR Check-in Hero */}
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#C91F32] space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1F1F1F] text-[#F5B700] text-xs font-mono font-bold uppercase border border-[#F5B700]">
          <span>LOCATION // IN-STORE CHECK-IN</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
          SCAN STORE QR. <span className="text-[#F5B700]">EARN 5 COINS.</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-sans">
          Visiting BINGOOO Men's Wear in Srikakulam today? Scan our in-store QR code at the cash counter or tap below to submit your daily visit check-in!
        </p>
      </div>

      {checkInMsg && (
        <div className="p-4 bg-emerald-950/60 border-2 border-emerald-500 text-xs font-mono text-emerald-200 flex items-center space-x-2 shadow-[4px_4px_0px_0px_#FFFFFF]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{checkInMsg}</span>
        </div>
      )}

      {checkInError && (
        <div className="p-4 bg-amber-950/60 border-2 border-amber-500 text-xs font-mono text-amber-200 flex items-center space-x-2 shadow-[4px_4px_0px_0px_#C91F32]">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{checkInError}</span>
        </div>
      )}

      {/* Bauhaus Available Stores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#282828] pb-2">
          <h3 className="text-lg font-black font-display uppercase tracking-wider text-white">
            SELECT STORE LOCATION
          </h3>
          <span className="text-xs font-mono text-gray-400 uppercase hidden sm:inline">
            // SRIKAKULAM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((s) => (
            <div
              key={s.id}
              className="p-6 bg-[#161616] border-2 border-white flex flex-col justify-between space-y-4 shadow-[5px_5px_0px_0px_#F5B700]"
            >
              <div className="space-y-2">
                <span className="text-base font-black font-display uppercase text-white block tracking-wide">
                  {s.name}
                </span>
                <p className="text-xs text-gray-300 flex items-start space-x-1.5 font-sans">
                  <MapPin className="w-4 h-4 text-[#C91F32] shrink-0 mt-0.5" />
                  <span>{s.address}, {s.city}</span>
                </p>
                <a
                  href="https://maps.app.goo.gl/hV1XT66gjiD9zG4dA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[10px] font-mono font-bold text-[#F5B700] hover:underline"
                >
                  📍 Open in Google Maps ↗
                </a>
                <span className="text-xs text-[#F5B700] font-mono font-bold block pt-1">
                  DAILY REWARD: +5 BINGOOO COINS
                </span>
              </div>

              <button
                onClick={() => handleCheckIn(s.id)}
                className="w-full py-3 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>CHECK IN AT THIS STORE →</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bauhaus Past Visits History */}
      <div className="p-6 bg-[#141414] border-2 border-[#333333] space-y-4 shadow-[5px_5px_0px_0px_#16428C]">
        <h3 className="text-base font-black font-display uppercase tracking-wider text-white font-mono">
          YOUR CHECK-IN HISTORY
        </h3>
        <div className="divide-y-2 divide-[#222222]">
          {history.map((h) => (
            <div key={h.id} className="py-3 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-white block uppercase">{h.store?.name}</span>
                <span className="text-[10px] text-gray-400">
                  {new Date(h.createdAt).toLocaleDateString()} ({h.checkInPeriodKey})
                </span>
              </div>
              <span
                className={`px-2.5 py-1 border text-[10px] font-mono font-bold uppercase ${
                  h.status === 'VERIFIED'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                    : 'bg-amber-950 text-amber-400 border-amber-500'
                }`}
              >
                {h.status === 'VERIFIED' ? '+5 COINS VERIFIED' : 'PENDING STAFF VERIFY'}
              </span>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-xs font-mono text-gray-500 py-4 text-center">NO CHECK-INS RECORDED YET.</p>
          )}
        </div>
      </div>
    </div>
  );
};
