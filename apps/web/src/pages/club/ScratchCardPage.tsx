import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Gift,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { ApiClient } from '../../services/api.service';

export const ScratchCardPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState<any>(null);
  const [activeReward, setActiveReward] = useState<any>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const token = localStorage.getItem('bingooo_customer_token');
  const userEmail = localStorage.getItem('bingooo_customer_email');
  const userName = localStorage.getItem('bingooo_customer_name');

  const loadSpinDetails = async () => {
    try {
      setLoading(true);
      if (!token) {
        setEligibility(null);
        return;
      }

      // Check eligibility and current monthly spin result
      const elig = await ApiClient.checkEligibility();
      setEligibility(elig);

      // Also fetch user's active reward vouchers
      const rewards = await ApiClient.getMyRewards().catch(() => []);
      if (Array.isArray(rewards) && rewards.length > 0) {
        // Find most recent reward
        setActiveReward(rewards[0]);
      }
    } catch (err) {
      console.error('Failed to load spin details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpinDetails();
  }, [token]);

  // Canvas Scratch Card Painting
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Background gradient: Bauhaus Gold & Bronze Foil
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#F5B700');
    grad.addColorStop(0.3, '#FFE066');
    grad.addColorStop(0.7, '#D49B00');
    grad.addColorStop(1, '#C91F32');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Bauhaus Geometric Shapes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let i = 0; i < w; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 16, h);
      ctx.lineTo(i + 24, h);
      ctx.lineTo(i + 8, 0);
      ctx.fill();
    }

    // Outer Border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Center Badge
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(w / 2 - 110, h / 2 - 45, 220, 90);
    ctx.strokeStyle = '#F5B700';
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - 110, h / 2 - 45, 220, 90);

    // Text on Foil
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BINGOOO MEN\'S WEAR', w / 2, h / 2 - 20);

    ctx.fillStyle = '#F5B700';
    ctx.font = '700 12px "Space Mono", monospace';
    ctx.fillText('★ SCRATCH & REVEAL ★', w / 2, h / 2 + 2);

    ctx.fillStyle = '#AAAAAA';
    ctx.font = '600 10px "Space Mono", monospace';
    ctx.fillText('DRAG FINGER OR MOUSE HERE', w / 2, h / 2 + 24);

    setIsScratched(false);
    setScratchPercent(0);
  }, []);

  useEffect(() => {
    if (!loading) {
      // Small timeout to ensure DOM rect is calculated
      const timer = setTimeout(() => {
        initCanvas();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, initCanvas]);

  // Scratch Drawing
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Check transparency every few scratches
    checkScratchCompletion();
  };

  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.floor(canvas.width / 4);
    const h = Math.floor(canvas.height / 4);

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentCount = 0;
      const totalPixels = data.length / 4;
      const sampleStep = 16; // Sample every 16th pixel for speed

      for (let i = 3; i < data.length; i += 4 * sampleStep) {
        if (data[i] === 0) {
          transparentCount++;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / (totalPixels / sampleStep)) * 100));
      setScratchPercent(percent);

      if (percent >= 38) {
        revealAll();
      }
    } catch (e) {
      // Ignore cross-origin error if any
    }
  };

  const revealAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsScratched(true);
    setScratchPercent(100);
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    scratchAt(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      setIsDrawing(true);
      scratchAt(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || e.touches.length === 0) return;
    scratchAt(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format Calendar Period (e.g. "2026-11" -> "NOVEMBER 2026")
  const getPeriodLabel = (key?: string) => {
    if (!key) {
      const now = new Date();
      return now.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    }
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
      {/* Bauhaus Header */}
      <div className="bg-[#141414] border-3 border-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_#F5B700] space-y-4 text-left relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1F1F1F] text-[#F5B700] text-xs font-mono font-bold uppercase border border-[#F5B700]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B700]" />
            <span>EXCLUSIVE MONTHLY REWARD // SCRATCH & WIN</span>
          </div>

          <span className="text-xs font-mono text-gray-400">
            PERIOD: <strong className="text-white">{getPeriodLabel(eligibility?.periodKey)}</strong>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">
          SPIN DETAILS <span className="text-[#F5B700]">SCRATCH CARD</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed font-sans">
          Scratch off the golden foil below to reveal your live monthly Spin & Win prize, instant store discount vouchers, and claim details for our Srikakulam boutique.
        </p>
      </div>

      {/* Main Interactive Scratch Card Area */}
      <div className="max-w-lg mx-auto space-y-6">
        <div
          ref={containerRef}
          className="relative w-full h-[360px] sm:h-[400px] bg-[#111111] border-4 border-white shadow-[10px_10px_0px_0px_#C91F32] overflow-hidden select-none"
        >
          {/* UNDERNEATH LAYER: The Revealed Spin Details */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-br from-[#181818] to-[#0A0A0A] text-white">
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between border-b-2 border-[#333333] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-[#C91F32] border border-white text-white font-black text-xs flex items-center justify-center font-display">
                  B
                </div>
                <span className="font-display font-black text-base tracking-wider uppercase text-white">
                  BINGO<span className="text-[#C91F32]">OO</span><span className="text-[#F5B700]">.CO.IN</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#F5B700] bg-[#222222] px-2 py-0.5 border border-[#444] uppercase font-bold">
                {getPeriodLabel(eligibility?.periodKey)}
              </span>
            </div>

            {/* Middle Section: Dynamic Spin Result / Status */}
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-6">
                <RefreshCw className="w-8 h-8 text-[#F5B700] animate-spin" />
                <span className="font-mono text-xs text-gray-400">Loading your spin details...</span>
              </div>
            ) : !token ? (
              /* State 1: Guest / Not Signed In */
              <div className="text-center space-y-3 py-4">
                <div className="w-12 h-12 bg-[#F5B700] text-black border-2 border-white flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#FFFFFF]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl uppercase text-white">
                  SIGN IN TO REVEAL REWARD
                </h3>
                <p className="text-xs text-gray-400 font-sans max-w-xs mx-auto">
                  Log in with Google or your customer email to uncover your monthly spin prize voucher.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_0px_#F5B700]"
                >
                  <span>Sign In Now →</span>
                </Link>
              </div>
            ) : eligibility?.isEligible ? (
              /* State 2: Eligible & Has Not Spun Yet This Month */
              <div className="text-center space-y-3 py-3">
                <div className="w-12 h-12 bg-[#F5B700] text-black border-2 border-white flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#C91F32]">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    STATUS: UNCLAIMED SPIN READY
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase text-white mt-1">
                    1 FREE SPIN WAITING!
                  </h3>
                  <p className="text-xs text-gray-300 font-sans mt-1">
                    Win 20% OFF, 10% OFF, 5% OFF, or Free Surprise Gift!
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    to="/spin"
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] transition"
                  >
                    <Sparkles className="w-4 h-4 text-[#F5B700]" />
                    <span>SPIN THE WHEEL NOW →</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* State 3: Already Spun This Month -> Show Prize Voucher Code */
              <div className="text-center space-y-2 py-2">
                <span className="text-[10px] font-mono font-bold text-[#F5B700] uppercase tracking-widest block">
                  PRIZE UNLOCKED FOR THIS MONTH
                </span>

                <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white tracking-wide">
                  {eligibility?.currentResult?.prizeName || activeReward?.prize?.name || 'STORE DISCOUNT VOUCHER'}
                </h3>

                {/* Voucher Code Box */}
                {(eligibility?.currentResult?.rewardCode || activeReward?.code) && (
                  <div className="p-3 bg-[#000000] border-2 border-[#F5B700] flex items-center justify-between space-x-2 my-2 shadow-[2px_2px_0px_0px_#FFFFFF]">
                    <div className="text-left font-mono">
                      <span className="text-[9px] text-gray-400 uppercase block">VOUCHER CODE</span>
                      <span className="text-sm sm:text-base font-black tracking-widest text-[#F5B700]">
                        {eligibility?.currentResult?.rewardCode || activeReward?.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyCode(eligibility?.currentResult?.rewardCode || activeReward?.code)
                      }
                      className="px-3 py-1.5 bg-white text-black hover:bg-gray-200 font-mono font-bold text-xs flex items-center space-x-1 uppercase transition border border-black"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-gray-300 font-sans">
                  Show this code to the cashier at BINGOOO Srikakulam store to claim your discount.
                </p>
              </div>
            )}

            {/* Bottom Footer Info */}
            <div className="pt-3 border-t-2 border-[#282828] flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SRIKAKULAM // 532410</span>
              </span>
              <span className="text-white">
                NEXT SPIN:{' '}
                {eligibility?.nextEligibleAt
                  ? new Date(eligibility.nextEligibleAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  : 'NEXT MONTH'}
              </span>
            </div>
          </div>

          {/* TOP CANVAS FOIL LAYER (Can be scratched off) */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-300 ${
              isScratched ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Action Controls Below Card */}
        <div className="flex items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#F5B700] animate-pulse" />
            <span>
              {isScratched
                ? 'CARD UNCOVERED'
                : scratchPercent > 0
                ? `SCRATCHED ${scratchPercent}%`
                : 'SCRATCH WITH FINGER/MOUSE'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {!isScratched ? (
              <button
                type="button"
                onClick={revealAll}
                className="px-3.5 py-2 bg-white text-black hover:bg-gray-200 font-bold uppercase transition border border-black shadow-[2px_2px_0px_0px_#C91F32]"
              >
                Reveal Now ✦
              </button>
            ) : (
              <button
                type="button"
                onClick={initCanvas}
                className="px-3.5 py-2 bg-[#222222] hover:bg-[#333333] text-gray-200 font-bold uppercase transition border border-[#444] flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scratch Again ↻</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Information Grid: Monthly Spin Rules & Redemption */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-mono text-xs">
        <div className="p-5 bg-[#161616] border-2 border-[#333333] space-y-2 shadow-[4px_4px_0px_0px_#C91F32]">
          <div className="w-8 h-8 bg-[#C91F32] text-white flex items-center justify-center font-bold">
            01
          </div>
          <h4 className="font-display font-black text-sm text-white uppercase">ONE SPIN PER MONTH</h4>
          <p className="font-sans text-gray-400 leading-relaxed text-[11px]">
            Every verified member receives strictly 1 committed spin per calendar month (Asia/Kolkata). Resets on the 1st of every month at midnight.
          </p>
        </div>

        <div className="p-5 bg-[#161616] border-2 border-[#333333] space-y-2 shadow-[4px_4px_0px_0px_#F5B700]">
          <div className="w-8 h-8 bg-[#F5B700] text-black flex items-center justify-center font-bold">
            02
          </div>
          <h4 className="font-display font-black text-sm text-white uppercase">IN-STORE REDEMPTION</h4>
          <p className="font-sans text-gray-400 leading-relaxed text-[11px]">
            Present your active voucher code or show this scratch card screen to our cashier during billing at BINGOOO Men's Wear, NH16, Kushalpuram — 532410.
          </p>
        </div>

        <div className="p-5 bg-[#161616] border-2 border-[#333333] space-y-2 shadow-[4px_4px_0px_0px_#16428C]">
          <div className="w-8 h-8 bg-[#16428C] text-white flex items-center justify-center font-bold">
            03
          </div>
          <h4 className="font-display font-black text-sm text-white uppercase">30-DAY VALIDITY</h4>
          <p className="font-sans text-gray-400 leading-relaxed text-[11px]">
            All unlocked discount vouchers (20% OFF, 10% OFF, 5% OFF, and Free Gift) are valid for 30 calendar days from the date of the spin.
          </p>
        </div>
      </div>
    </div>
  );
};
