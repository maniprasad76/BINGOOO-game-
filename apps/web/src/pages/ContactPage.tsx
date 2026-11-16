import React from 'react';
import { MapPin, Phone, Mail, Clock, ShoppingBag } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-wide text-white">
          BINGOOO Srikakulam Store
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Come visit our physical men's clothing store to redeem your vouchers and try the latest fashion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#161616] border border-[#2A2A2A] space-y-6">
          <h3 className="text-xl font-bold font-display text-white uppercase">Store Information</h3>

          <div className="space-y-4 text-xs sm:text-sm text-gray-300">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#C91F32] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Store Address</strong>
                <span>Main Road, Srikakulam, Andhra Pradesh, India</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Opening Hours</strong>
                <span>Monday to Sunday: 10:00 AM – 9:30 PM IST</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-[#C91F32] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Store Phone</strong>
                <span>+91 8942 222333</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Support Email</strong>
                <span>contact@bingooo.co.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#161616] border border-[#2A2A2A] space-y-4">
          <h3 className="text-xl font-bold font-display text-white uppercase">Men's Collections</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Discover a wide assortment of premium fabrics, modern streetwear fits, and formal luxury wear:
          </p>

          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#C91F32]" />
              <span>Oversized, Graphic & Pique Polo T-Shirts</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Casual Linen, Formal Spread Collar & Cuban Shirts</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#C91F32]" />
              <span>Raw Denim, Baggy, Slim & Distressed Jeans</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>Cotton Chinos, Korean Baggy Trousers & Formal Pants</span>
            </li>
          </ul>

          <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] text-xs text-gray-400">
            Voucher discounts applied instantly upon presenting your mobile screen at billing counter.
          </div>
        </div>
      </div>
    </div>
  );
};
