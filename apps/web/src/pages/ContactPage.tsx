import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  ExternalLink,
  Navigation,
  Copy,
  Check,
  Sparkles,
  Shirt,
  ShieldCheck
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const mapsShortUrl = "https://maps.app.goo.gl/hV1XT66gjiD9zG4dA";
  const exactAddress = "BINGOOO Men's Wear, NH16, Kushalpuram, Srikakulam District, Andhra Pradesh — 532001, India";
  const coordinates = "18.296273, 83.869070";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${exactAddress} (GPS: ${coordinates})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Bauhaus Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#F5B700] text-black border-2 border-black text-xs font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#FFFFFF]">
          <MapPin className="w-3.5 h-3.5" />
          <span>OFFICIAL FLAGSHIP STORE LOCATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
          Visit BINGO<span className="text-[#C91F32]">OO</span> In Srikakulam
        </h1>
        <p className="text-sm text-gray-400 font-sans max-w-2xl mx-auto">
          Experience Srikakulam's premier men's fashion boutique. Try on modern streetwear, formal suits, oversized tees, and redeem your spin wheel & coin vouchers in person.
        </p>
      </div>

      {/* Main Grid: Store Info & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Store Details & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#141414] border-3 border-white p-6 space-y-6 shadow-[6px_6px_0px_0px_#C91F32]">
            <div className="border-b border-[#282828] pb-3">
              <span className="text-[10px] font-mono font-bold text-[#F5B700] uppercase tracking-widest block">
                FLAGSHIP BOUTIQUE
              </span>
              <h2 className="text-xl font-black font-display uppercase tracking-wide text-white">
                Store Details
              </h2>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Address */}
              <div className="flex items-start space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-[#C91F32] border border-white text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <strong className="block text-white uppercase text-xs">Physical Address</strong>
                  <p className="font-sans text-gray-300 text-xs leading-relaxed">
                    NH16 (Main Road), Kushalpuram, Etcherla Mandal, Srikakulam District, Andhra Pradesh — 532001
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-[#1F1F1F] border border-[#333333] text-[10px] text-[#F5B700]">
                    GPS: {coordinates}
                  </span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-[#F5B700] border border-black text-black flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white uppercase text-xs">Operating Hours</strong>
                  <span className="font-sans text-gray-300">Open 7 Days a Week: 10:00 AM – 9:30 PM IST</span>
                  <span className="block text-[10px] text-emerald-400 mt-0.5">OPEN TODAY // READY FOR VOUCHER REDEMPTIONS</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-[#0047AB] border border-white text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white uppercase text-xs">Store Telephone</strong>
                  <a href="tel:+918942222333" className="hover:text-white transition font-sans text-sm font-bold">
                    +91 8942 222333
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-[#222222] border border-white text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white uppercase text-xs">Support Email</strong>
                  <a href="mailto:contact@bingooo.co.in" className="hover:text-white transition font-sans">
                    contact@bingooo.co.in
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href={mapsShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#C91F32] hover:bg-[#B01828] text-white font-mono font-black text-xs uppercase tracking-widest transition-all border-2 border-white shadow-[3px_3px_0px_0px_#F5B700] hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>OPEN IN GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="w-full py-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-gray-200 font-mono font-bold text-xs uppercase tracking-wider transition-all border border-white flex items-center justify-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">ADDRESS COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                    <span>COPY STORE ADDRESS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Google Maps Iframe */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#141414] border-3 border-white p-3 shadow-[6px_6px_0px_0px_#F5B700] space-y-3">
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-[#C91F32]" />
                <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                  LIVE INTERACTIVE MAP // SRIKAKULAM
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">
                18.296273, 83.869070
              </span>
            </div>

            {/* Responsive Google Maps Embed with exact coordinates */}
            <div className="relative w-full h-[360px] sm:h-[420px] border-2 border-white overflow-hidden bg-black">
              <iframe
                title="BINGOOO Srikakulam Store Exact Location"
                src="https://maps.google.com/maps?q=18.296273,83.869070&hl=en&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] contrast-[110%]"
              />
            </div>

            <div className="flex items-center justify-between px-2 text-[11px] font-mono text-gray-400">
              <span>Located directly on NH16 for effortless road access & ample parking.</span>
              <a
                href={mapsShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5B700] hover:underline font-bold uppercase flex items-center space-x-1"
              >
                <span>Full Screen Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Men's Collections Highlight */}
          <div className="bg-[#141414] border-2 border-white p-5 space-y-4 shadow-[4px_4px_0px_0px_#0047AB]">
            <h3 className="text-sm font-black font-display text-white uppercase tracking-wider flex items-center space-x-2">
              <Shirt className="w-4 h-4 text-[#F5B700]" />
              <span>Available Collections at This Location</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-[11px] font-mono">
              <div className="p-2.5 bg-[#0A0A0A] border border-[#2A2A2A]">
                <strong className="block text-white">T-SHIRTS</strong>
                <span className="text-gray-400 text-[10px]">Oversized & Polos</span>
              </div>
              <div className="p-2.5 bg-[#0A0A0A] border border-[#2A2A2A]">
                <strong className="block text-white">SHIRTS</strong>
                <span className="text-gray-400 text-[10px]">Linen & Cuban</span>
              </div>
              <div className="p-2.5 bg-[#0A0A0A] border border-[#2A2A2A]">
                <strong className="block text-white">JEANS</strong>
                <span className="text-gray-400 text-[10px]">Raw Denim & Baggy</span>
              </div>
              <div className="p-2.5 bg-[#0A0A0A] border border-[#2A2A2A]">
                <strong className="block text-white">TROUSERS</strong>
                <span className="text-gray-400 text-[10px]">Chinos & Formals</span>
              </div>
            </div>

            <p className="text-[11px] font-sans text-gray-400 text-center">
              * Show your active Spin & Win code or BINGOOO Coins pass to the cashier at checkout to apply instant discounts or claim your free surprise gift / custom T-shirt!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
