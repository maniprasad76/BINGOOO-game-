import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black font-display uppercase tracking-wide text-white">
        Promotion Terms & Conditions
      </h1>

      <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#141414] border border-[#222222] p-6 rounded-3xl">
        <h3 className="text-base font-bold text-white">1. Eligibility</h3>
        <p>
          The BINGOOO Monthly Spin & Win promotion is open to customers holding a verified Indian mobile number (+91). Each verified mobile number is entitled to exactly one (1) spin attempt per calendar month based on Indian Standard Time (Asia/Kolkata).
        </p>

        <h3 className="text-base font-bold text-white pt-2">2. Monthly Reset</h3>
        <p>
          Eligibility renews automatically at 00:00:00 IST on the first day of each calendar month. Unused chances do not carry forward or accumulate.
        </p>

        <h3 className="text-base font-bold text-white pt-2">3. Voucher Redemption</h3>
        <p>
          All discount codes and gift vouchers are valid for 30 calendar days from the date of issuance and can only be redeemed once in person at the BINGOOO Men's Wear retail store located at Main Road, Srikakulam, Andhra Pradesh. Coupons cannot be exchanged for cash.
        </p>

        <h3 className="text-base font-bold text-white pt-2">4. Disqualification & Misuse</h3>
        <p>
          Any automated script execution, brute-force attempts, or unauthorized access will result in immediate disqualification and voucher cancellation.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-black font-display uppercase tracking-wide text-white">
        Customer Privacy Notice
      </h1>

      <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#141414] border border-[#222222] p-6 rounded-3xl">
        <h3 className="text-base font-bold text-white">1. Data We Collect</h3>
        <p>
          We collect your mobile number solely for identity verification and monthly promotion eligibility. We do not sell or share your contact number with third-party advertisers.
        </p>

        <h3 className="text-base font-bold text-white pt-2">2. Masking & Protection</h3>
        <p>
          Your mobile number is securely masked in all public user interfaces (e.g. +91 98*** **210) to protect your privacy.
        </p>

        <h3 className="text-base font-bold text-white pt-2">3. Marketing Consent</h3>
        <p>
          Marketing notifications via SMS or WhatsApp are completely optional. You may opt out at any time by contacting contact@bingooo.co.in or requesting assistance at our store.
        </p>
      </div>
    </div>
  );
};
