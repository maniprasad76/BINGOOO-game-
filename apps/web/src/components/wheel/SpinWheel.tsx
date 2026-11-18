import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, AlertCircle, Volume2, VolumeX, Instagram } from 'lucide-react';

// Web Audio API Sound Synthesizer (0 external dependencies, works offline)
class WheelSoundFX {
  private static ctx: AudioContext | null = null;
  public static isMuted = false;

  private static getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public static playTick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  public static playWinFanfare() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {}
  }
}

interface Segment {
  id: string;
  prizeType: string;
  label: string;
  color: string;
  textColor: string;
}

interface SpinWheelProps {
  segments: Segment[];
  onSpinRequest: () => Promise<{ segmentIndex: number; isWin: boolean; prizeName: string }>;
  disabled?: boolean;
  onBeforeSpinClick?: () => boolean;
  isInstagramFollowed?: boolean;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  segments,
  onSpinRequest,
  disabled = false,
  onBeforeSpinClick,
  isInstagramFollowed = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const numSegments = segments.length || 8;
  const segmentAngle = 360 / numSegments;

  const toggleSound = () => {
    WheelSoundFX.isMuted = soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Draw wheel on canvas
  const drawWheel = (rotationDeg: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 22;

    ctx.clearRect(0, 0, width, height);

    // Save context for entire wheel rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    // Draw Bauhaus outer high-contrast stark rim
    ctx.beginPath();
    ctx.arc(0, 0, radius + 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F0F0F';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Secondary Bauhaus yellow accent ring
    ctx.beginPath();
    ctx.arc(0, 0, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = '#F5B700';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Bauhaus slices with stark geometric purity
    segments.forEach((seg, i) => {
      const startAngle = ((i * segmentAngle) * Math.PI) / 180;
      const endAngle = (((i + 1) * segmentAngle) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Sharp Bauhaus pure white structural dividers
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Bold geometric typography inside slice
      ctx.save();
      const midAngle = startAngle + (endAngle - startAngle) / 2;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.textColor || '#FFFFFF';
      ctx.font = '800 14px "Space Grotesk", sans-serif';
      ctx.fillText(seg.label.toUpperCase(), radius - 20, 5);
      ctx.restore();
    });

    // Bauhaus geometric perimeter markers (alternating squares and circles)
    const totalMarkers = 16;
    for (let s = 0; s < totalMarkers; s++) {
      const markerAngle = ((s * (360 / totalMarkers)) * Math.PI) / 180;
      const mx = (radius + 8) * Math.cos(markerAngle);
      const my = (radius + 8) * Math.sin(markerAngle);

      if (s % 2 === 0) {
        // Geometric Square marker
        ctx.fillStyle = '#F5B700';
        ctx.fillRect(mx - 3, my - 3, 6, 6);
      } else {
        // Geometric Circle marker
        ctx.beginPath();
        ctx.arc(mx, my, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    }

    ctx.restore();

    // Central stationary Bauhaus concentric hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F0F0F';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI);
    ctx.strokeStyle = '#F5B700';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel(currentRotation);
  }, [segments, currentRotation]);

  const handleSpinClick = async () => {
    if (isSpinning || disabled) return;

    // Check pre-spin requirements (e.g. Instagram Follow Gate)
    if (onBeforeSpinClick && !onBeforeSpinClick()) {
      return;
    }

    try {
      setIsSpinning(true);

      // SECURITY CRITICAL: Server determines outcome FIRST
      const backendResult = await onSpinRequest();
      const targetSegmentIndex = backendResult.segmentIndex;

      // Calculate target rotation angle so pointer (top, 270 deg) lands in target slice
      // Pointer is fixed at top (270 degrees in canvas coordinates)
      const fullRotations = 5; // 5 full loops
      const segmentArc = 360 / numSegments;
      // Slice midpoint angle
      const targetMidAngle = targetSegmentIndex * segmentArc + segmentArc / 2;

      // Target rotation to align pointer with slice:
      // (rotation + targetMidAngle) % 360 = 270 deg
      const finalAngle = (fullRotations * 360) + (270 - targetMidAngle);

      const duration = 6000; // 6 seconds
      const startTime = performance.now();
      const startAngle = currentRotation % 360;
      let lastTickIndex = -1;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Quintic ease-out deceleration curve for ultra-realistic casino wheel momentum
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentAngle = startAngle + (finalAngle - startAngle) * easeOut;

        // Mechanical sound tick at each segment boundary
        const currentTick = Math.floor(currentAngle / (360 / numSegments));
        if (currentTick !== lastTickIndex) {
          lastTickIndex = currentTick;
          WheelSoundFX.playTick();
        }

        setCurrentRotation(currentAngle);
        drawWheel(currentAngle);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsSpinning(false);
          WheelSoundFX.playWinFanfare();
          if (backendResult.isWin) {
            confetti({
              particleCount: 120,
              spread: 75,
              origin: { y: 0.6 }
            });
          }
        }
      };

      requestAnimationFrame(animate);
    } catch (err) {
      setIsSpinning(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Bauhaus Constructivist Top Pointer */}
      <div className="relative z-20 flex flex-col items-center -mb-6">
        <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-[#C91F32] filter drop-shadow-[0_2px_0px_#FFFFFF]" />
        <div className="w-5 h-5 rounded-full bg-[#F5B700] border-2 border-white -mt-8 flex items-center justify-center shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
        </div>
      </div>

      {/* Bauhaus Canvas Wheel Frame */}
      <div className="relative rounded-full p-2.5 bg-[#0F0F0F] border-4 border-[#282828] shadow-[8px_8px_0px_0px_#C91F32]">
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          className="max-w-[330px] max-h-[330px] sm:max-w-[400px] sm:max-h-[400px] cursor-pointer"
          onClick={handleSpinClick}
        />

        {/* Central Apple-Grade SPIN Push-Button */}
        <button
          onClick={handleSpinClick}
          disabled={isSpinning || disabled}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full font-bold text-xs tracking-wider uppercase transition-all flex flex-col items-center justify-center z-10 shadow-2xl ${
            disabled
              ? 'bg-neutral-900 text-neutral-500 border border-neutral-800 cursor-not-allowed'
              : isSpinning
              ? 'bg-[#0071E3] text-white border-2 border-white/40 animate-pulse'
              : !isInstagramFollowed
              ? 'bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white hover:scale-105 active:scale-95 border-2 border-white/60 shadow-[0_0_20px_rgba(214,36,159,0.4)]'
              : 'bg-[#0071E3] hover:bg-[#0077ED] text-white hover:scale-105 active:scale-95 border-2 border-white/40 shadow-[0_0_25px_rgba(0,113,227,0.5)]'
          }`}
        >
          {isSpinning ? (
            <span className="text-[10px] font-mono tracking-tight">SPINNING</span>
          ) : !isInstagramFollowed ? (
            <>
              <Instagram className="w-4 h-4 text-white mb-0.5" />
              <span className="text-[10px] font-black">FOLLOW</span>
              <span className="text-[8px] opacity-90 -mt-0.5">TO SPIN</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white mb-0.5" />
              <span className="font-extrabold text-sm">SPIN</span>
            </>
          )}
        </button>
      </div>

      {/* Sound FX Toggle */}
      <button
        onClick={toggleSound}
        className="mt-4 px-3 py-1.5 bg-[#141414] hover:bg-[#222222] border-2 border-[#333333] hover:border-white text-xs font-mono text-gray-300 flex items-center space-x-1.5 transition-all shadow-[2px_2px_0px_0px_#F5B700]"
        title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
      >
        {soundEnabled ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#F5B700]" />
            <span>SOUND ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-gray-500" />
            <span>MUTED</span>
          </>
        )}
      </button>

      {disabled && (
        <div className="mt-4 text-xs text-gray-300 flex items-center space-x-2 bg-[#161616] px-4 py-2 border-2 border-[#333333] shadow-[3px_3px_0px_0px_#C91F32]">
          <AlertCircle className="w-4 h-4 text-[#F5B700] shrink-0" />
          <span className="font-mono uppercase tracking-wider">MONTHLY LIMIT REACHED // ONE SPIN PER CALENDAR MONTH</span>
        </div>
      )}
    </div>
  );
};
