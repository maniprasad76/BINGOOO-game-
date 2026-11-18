import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Promotion Terms & Conditions
      </h1>

      <div className="space-y-5 text-xs sm:text-sm text-[#86868B] leading-relaxed apple-glass-card p-6 sm:p-8 rounded-3xl">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">1. Eligibility</h3>
          <p>
            The BINGOOO Monthly Spin & Win promotion is open to customers holding a verified Indian mobile number (+91). Each verified number is entitled to exactly one (1) spin attempt per calendar month based on Indian Standard Time (Asia/Kolkata).
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-1">2. Monthly Reset</h3>
          <p>
            Eligibility renews automatically at 00:00:00 IST on the first day of each calendar month. Unused chances do not carry forward or accumulate.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-1">3. Voucher Redemption</h3>
          <p>
            All discount codes and gift vouchers are valid for 30 calendar days from the date of issuance and can only be redeemed once in person at the BINGOOO Men's Wear retail store located at Main Road, Srikakulam, Andhra Pradesh. Coupons cannot be exchanged for cash.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-1">4. Fair Play & Security</h3>
          <p>
            Any automated script execution, brute-force attempts, or unauthorized access will result in immediate disqualification and voucher cancellation.
          </p>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        Customer Privacy Notice
      </h1>

      <div className="space-y-5 text-xs sm:text-sm text-[#86868B] leading-relaxed apple-glass-card p-6 sm:p-8 rounded-3xl">
        <div>
          <h3 className="text-base font-semibold text-white mb-1">1. Data We Collect</h3>
          <p>
            We collect your mobile number solely for identity verification and monthly promotion eligibility. We never sell or share your contact number with third-party advertisers.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-1">2. Masking & Protection</h3>
          <p>
            Your mobile number is securely masked in all public user interfaces (e.g. +91 98*** **210) to protect your privacy.
          </p>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white mb-1">3. Marketing Consent</h3>
          <p>
            Marketing notifications via SMS or WhatsApp are completely optional. You may opt out at any time by contacting contact@bingooo.co.in or requesting assistance at our store.
          </p>
        </div>
      </div>
    </div>
  );
};
