export declare enum PrizeType {
    DISCOUNT_20 = "DISCOUNT_20",
    DISCOUNT_10 = "DISCOUNT_10",
    DISCOUNT_5 = "DISCOUNT_5",
    FREE_GIFT = "FREE_GIFT",
    BETTER_LUCK = "BETTER_LUCK",
    TRY_AGAIN = "TRY_AGAIN",
    NO_PRIZE = "NO_PRIZE",
    FREE_CUSTOM_TSHIRT = "FREE_CUSTOM_TSHIRT"
}
export declare enum RewardType {
    DISCOUNT_20 = "DISCOUNT_20",
    DISCOUNT_10 = "DISCOUNT_10",
    DISCOUNT_5 = "DISCOUNT_5",
    FREE_GIFT = "FREE_GIFT",
    COINS_VOUCHER = "COINS_VOUCHER",
    FREE_CUSTOM_TSHIRT = "FREE_CUSTOM_TSHIRT"
}
export declare enum RewardSourceType {
    SPIN = "SPIN",
    COINS_REDEMPTION = "COINS_REDEMPTION",
    REFERRAL_WELCOME = "REFERRAL_WELCOME",
    BIRTHDAY = "BIRTHDAY",
    STORE_QR = "STORE_QR"
}
export declare enum LoyaltyTransactionType {
    EARN = "EARN",
    REDEEM = "REDEEM",
    BONUS = "BONUS",
    EXPIRE = "EXPIRE",
    REVERSAL = "REVERSAL"
}
export declare enum ReferralStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    QUALIFIED = "QUALIFIED",
    REWARDED = "REWARDED",
    REJECTED = "REJECTED",
    REVERSED = "REVERSED"
}
export declare enum StoreCheckInStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    REJECTED = "REJECTED"
}
export declare enum RewardStatus {
    ISSUED = "ISSUED",
    REDEEMED = "REDEEMED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare enum SpinStatus {
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    MANAGER = "MANAGER",
    STAFF = "STAFF"
}
export declare enum AdminRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    MANAGER = "MANAGER",
    STAFF = "STAFF"
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
    nextEligibleAt: string;
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
    segmentIndex: number;
    isWin: boolean;
    isTryAgain?: boolean;
    periodKey: string;
}
export interface CustomerSessionDto {
    customerId: string;
    phoneNumber: string;
    token: string;
}
