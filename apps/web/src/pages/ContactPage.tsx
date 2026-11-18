import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
  Copy,
  Check,
  Shirt,
  Sparkles
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const mapsShortUrl = "https://maps.app.goo.gl/hV1XT66gjiD9zG4dA";
  const exactAddress = "BINGOOO Men's Wear, NH16, Kushalpuram, Srikakulam District, Andhra Pradesh — 532410, India";
  const coordinates = "18.296273, 83.869070";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${exactAddress} (GPS: ${coordinates})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="apple-badge">Flagship Store Location</span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Visit BINGO<span className="text-[#0071E3]">OO</span> Srikakulam
        </h1>
        <p className="text-sm text-[#86868B] max-w-xl mx-auto leading-relaxed">
          Srikakulam's premier men's fashion boutique. Explore modern streetwear, formal wear, oversized fits, and redeem your vouchers in person.
        </p>
      </div>

      {/* Main Grid: Store Info & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Store Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="apple-glass-card rounded-3xl p-6 sm:p-7 space-y-6">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-[11px] text-[#0071E3] font-medium uppercase tracking-wider block">
                Flagship Boutique
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                Store Details
              </h2>
            </div>

            <div className="space-y-5 text-xs">
              {/* Address */}
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <strong className="block text-white text-xs font-semibold">Physical Address</strong>
                  <p className="text-[#86868B] leading-relaxed">
                    NH16 (Main Road), Kushalpuram, Etcherla Mandal, Srikakulam District, Andhra Pradesh — 532410
                  </p>
                  <span className="inline-block text-[11px] text-[#86868B] font-mono">
                    GPS: {coordinates}
                  </span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-xs font-semibold">Operating Hours</strong>
                  <span className="text-[#86868B]">Open 7 Days: 10:00 AM – 9:30 PM IST</span>
                  <span className="block text-[11px] text-[#30D158] font-medium mt-0.5">Open Today for Redemptions</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-xs font-semibold">Store Telephone</strong>
                  <a href="tel:+918942222333" className="text-[#86868B] hover:text-white transition font-medium">
                    +91 8942 222333
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-xs font-semibold">Support Email</strong>
                  <a href="mailto:contact@bingooo.co.in" className="text-[#86868B] hover:text-white transition font-medium">
                    contact@bingooo.co.in
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
              <a
                href={mapsShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-primary w-full flex items-center justify-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Apple / Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="apple-button-secondary w-full flex items-center justify-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#30D158]" />
                    <span className="text-[#30D158]">Address Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#86868B]" />
                    <span>Copy Store Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Map & Collections */}
        <div className="lg:col-span-7 space-y-4">
          <div className="apple-glass-card rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs font-semibold text-white tracking-tight">
                Store Location Map
              </span>
              <a
                href={mapsShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0071E3] hover:underline flex items-center space-x-1"
              >
                <span>Full Map</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Responsive Map Embed */}
            <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-white/[0.08]">
              <iframe
                title="BINGOOO Srikakulam Store Exact Location"
                src="https://maps.google.com/maps?q=18.296273,83.869070&hl=en&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
            <p className="text-[11px] text-[#86868B] px-2">
              Located directly on NH16 with easy parking access for all customers.
            </p>
          </div>

          {/* Men's Collections Highlight */}
          <div className="apple-glass-card rounded-3xl p-5 sm:p-6 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
              <Shirt className="w-4 h-4 text-[#0071E3]" />
              <span>Available Collections at This Location</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="block text-white font-medium">T-Shirts</strong>
                <span className="text-[#86868B] text-[11px]">Oversized & Polos</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="block text-white font-medium">Shirts</strong>
                <span className="text-[#86868B] text-[11px]">Linen & Cuban</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="block text-white font-medium">Jeans</strong>
                <span className="text-[#86868B] text-[11px]">Raw & Baggy</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <strong className="block text-white font-medium">Trousers</strong>
                <span className="text-[#86868B] text-[11px]">Chinos & Formal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
