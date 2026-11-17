import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, X, Sparkles, MapPin } from 'lucide-react';

interface PrintableStandeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  storeAddress?: string;
  checkInUrl?: string;
}

export const PrintableStandeeModal: React.FC<PrintableStandeeModalProps> = ({
  isOpen,
  onClose,
  storeName = "BINGOOO MEN'S WEAR",
  storeAddress = "NH16, Kushalpuram, Srikakulam District, Andhra Pradesh — 532001",
  checkInUrl = "https://bingooo.co.in/club/check-in"
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(checkInUrl, {
        width: 450,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then(setQrDataUrl)
        .catch(console.error);
    }
  }, [isOpen, checkInUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#141414] border-4 border-white max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-[10px_10px_0px_0px_#C91F32] relative">
        {/* Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#282828] print:hidden">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#F5B700]" />
            <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
              IN-STORE COUNTER STANDEE // PREVIEW
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white flex items-center space-x-1.5 shadow-[2px_2px_0px_0px_#FFFFFF]"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT STANDEE</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-[#222222] hover:bg-[#333333] border border-white text-gray-300 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Standee Sheet (Styled for standard A4 / counter display) */}
        <div className="bg-white text-black p-8 sm:p-10 border-4 border-black text-center space-y-6 font-sans shadow-2xl rounded-none">
          {/* Bauhaus Brand Header */}
          <div className="space-y-2 border-b-4 border-black pb-4">
            <div className="inline-block px-3 py-1 bg-black text-white font-mono font-black text-xs uppercase tracking-widest mb-1">
              OFFICIAL CASH COUNTER DISPLAY
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-display tracking-widest uppercase text-black">
              BINGO<span className="text-[#C91F32]">OO</span>
            </h1>
            <p className="text-xs font-mono font-bold text-gray-800 uppercase tracking-widest">
              MEN'S WEAR • SRIKAKULAM
            </p>
          </div>

          {/* Standee Callout */}
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-[#F5B700] px-4 py-1.5 border-2 border-black font-mono font-black text-sm uppercase">
              <Sparkles className="w-4 h-4 text-black" />
              <span>EARN 5 COINS DAILY</span>
            </div>
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-black pt-2">
              SCAN TO CHECK IN
            </h2>
            <p className="text-xs text-gray-700 max-w-xs mx-auto">
              Open your smartphone camera to scan, check in, and collect reward coins towards store discounts!
            </p>
          </div>

          {/* High-Contrast QR Code */}
          <div className="p-4 border-4 border-black bg-white inline-block shadow-[6px_6px_0px_0px_#C91F32] mx-auto">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="BINGOOO Store QR Check-in"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
              />
            ) : (
              <div className="w-56 h-56 bg-gray-100 flex items-center justify-center font-mono text-xs">
                Generating QR...
              </div>
            )}
          </div>

          {/* Srikakulam Location Footer */}
          <div className="border-t-2 border-black pt-4 space-y-1 font-mono text-xs text-gray-800">
            <p className="font-bold uppercase flex items-center justify-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#C91F32]" />
              <span>{storeAddress}</span>
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              BINGOOO.CO.IN • REWARDS CLUB • 10:00 AM – 9:30 PM DAILY
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-mono text-gray-400 print:hidden">
          Tip: Set printer orientation to Portrait and enable background graphics for best results.
        </p>
      </div>
    </div>
  );
};