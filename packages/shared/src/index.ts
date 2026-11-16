export enum PrizeType {
  FREE_CUSTOM_TSHIRT = 'FREE_CUSTOM_TSHIRT',
  DISCOUNT_20 = 'DISCOUNT_20',
  DISCOUNT_10 = 'DISCOUNT_10',
  DISCOUNT_5 = 'DISCOUNT_5',
  FREE_GIFT = 'FREE_GIFT',
  NO_PRIZE = 'NO_PRIZE'
}

export enum RewardType {
  FREE_CUSTOM_TSHIRT = 'FREE_CUSTOM_TSHIRT',
  DISCOUNT_20 = 'DISCOUNT_20',
  DISCOUNT_10 = 'DISCOUNT_10',
  DISCOUNT_5 = 'DISCOUNT_5',
  FREE_GIFT = 'FREE_GIFT',
  COINS_VOUCHER = 'COINS_VOUCHER'
}

export enum RewardSourceType {
  SPIN = 'SPIN',
  COINS_REDEMPTION = 'COINS_REDEMPTION',
  REFERRAL_WELCOME = 'REFERRAL_WELCOME',
  BIRTHDAY = 'BIRTHDAY',
  STORE_QR = 'STORE_QR'
}

export enum LoyaltyTransactionType {
  EARN = 'EARN',
  REDEEM = 'REDEEM',
  BONUS = 'BONUS',
  EXPIRE = 'EXPIRE',
  REVERSAL = 'REVERSAL'
}

export enum ReferralStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  QUALIFIED = 'QUALIFIED',
  REWARDED = 'REWARDED',
  REJECTED = 'REJECTED',
  REVERSED = 'REVERSED'
}

export enum StoreCheckInStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum RewardStatus {
  ISSUED = 'ISSUED',
  REDEEMED = 'REDEEMED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum SpinStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export interface WheelSegmentConfig {
  id: string;
  prizeType: PrizeType;
  label: string;
  color: string;
  textColor: string;
}

export interface EligibilityResponse {
  isEligible: boolean;
  periodKey: string;
  nextEligibleAt: string; // ISO string in IST boundary
  reason?: string;
  currentResult?: {
    spinId: string;
    prizeType: PrizeType;
    prizeName: string;
    rewardCode?: string;
    completedAt: string;
  };
}

export interface WheelSpinResponse {
  spinId: string;
  prizeType: PrizeType;
  prizeName: string;
  description: string;
  rewardCode?: string;
  expiresAt?: string;
  segmentIndex: number; // Frontend wheel stops at this segment
  isWin: boolean;
  periodKey: string;
}

export interface CustomerSessionDto {
  customerId: string;
  phoneNumber: string; // Masked e.g. +91 98*** **210
  token: string;
}
