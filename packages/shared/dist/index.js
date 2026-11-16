"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRole = exports.Role = exports.SpinStatus = exports.RewardStatus = exports.StoreCheckInStatus = exports.ReferralStatus = exports.LoyaltyTransactionType = exports.RewardSourceType = exports.RewardType = exports.PrizeType = void 0;
var PrizeType;
(function (PrizeType) {
    PrizeType["FREE_CUSTOM_TSHIRT"] = "FREE_CUSTOM_TSHIRT";
    PrizeType["DISCOUNT_20"] = "DISCOUNT_20";
    PrizeType["DISCOUNT_10"] = "DISCOUNT_10";
    PrizeType["DISCOUNT_5"] = "DISCOUNT_5";
    PrizeType["FREE_GIFT"] = "FREE_GIFT";
    PrizeType["NO_PRIZE"] = "NO_PRIZE";
})(PrizeType || (exports.PrizeType = PrizeType = {}));
var RewardType;
(function (RewardType) {
    RewardType["FREE_CUSTOM_TSHIRT"] = "FREE_CUSTOM_TSHIRT";
    RewardType["DISCOUNT_20"] = "DISCOUNT_20";
    RewardType["DISCOUNT_10"] = "DISCOUNT_10";
    RewardType["DISCOUNT_5"] = "DISCOUNT_5";
    RewardType["FREE_GIFT"] = "FREE_GIFT";
    RewardType["COINS_VOUCHER"] = "COINS_VOUCHER";
})(RewardType || (exports.RewardType = RewardType = {}));
var RewardSourceType;
(function (RewardSourceType) {
    RewardSourceType["SPIN"] = "SPIN";
    RewardSourceType["COINS_REDEMPTION"] = "COINS_REDEMPTION";
    RewardSourceType["REFERRAL_WELCOME"] = "REFERRAL_WELCOME";
    RewardSourceType["BIRTHDAY"] = "BIRTHDAY";
    RewardSourceType["STORE_QR"] = "STORE_QR";
})(RewardSourceType || (exports.RewardSourceType = RewardSourceType = {}));
var LoyaltyTransactionType;
(function (LoyaltyTransactionType) {
    LoyaltyTransactionType["EARN"] = "EARN";
    LoyaltyTransactionType["REDEEM"] = "REDEEM";
    LoyaltyTransactionType["BONUS"] = "BONUS";
    LoyaltyTransactionType["EXPIRE"] = "EXPIRE";
    LoyaltyTransactionType["REVERSAL"] = "REVERSAL";
})(LoyaltyTransactionType || (exports.LoyaltyTransactionType = LoyaltyTransactionType = {}));
var ReferralStatus;
(function (ReferralStatus) {
    ReferralStatus["PENDING"] = "PENDING";
    ReferralStatus["VERIFIED"] = "VERIFIED";
    ReferralStatus["QUALIFIED"] = "QUALIFIED";
    ReferralStatus["REWARDED"] = "REWARDED";
    ReferralStatus["REJECTED"] = "REJECTED";
    ReferralStatus["REVERSED"] = "REVERSED";
})(ReferralStatus || (exports.ReferralStatus = ReferralStatus = {}));
var StoreCheckInStatus;
(function (StoreCheckInStatus) {
    StoreCheckInStatus["PENDING"] = "PENDING";
    StoreCheckInStatus["VERIFIED"] = "VERIFIED";
    StoreCheckInStatus["REJECTED"] = "REJECTED";
})(StoreCheckInStatus || (exports.StoreCheckInStatus = StoreCheckInStatus = {}));
var RewardStatus;
(function (RewardStatus) {
    RewardStatus["ISSUED"] = "ISSUED";
    RewardStatus["REDEEMED"] = "REDEEMED";
    RewardStatus["EXPIRED"] = "EXPIRED";
    RewardStatus["CANCELLED"] = "CANCELLED";
})(RewardStatus || (exports.RewardStatus = RewardStatus = {}));
var SpinStatus;
(function (SpinStatus) {
    SpinStatus["COMPLETED"] = "COMPLETED";
    SpinStatus["CANCELLED"] = "CANCELLED";
})(SpinStatus || (exports.SpinStatus = SpinStatus = {}));
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["MANAGER"] = "MANAGER";
    Role["STAFF"] = "STAFF";
})(Role || (exports.Role = Role = {}));
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    AdminRole["MANAGER"] = "MANAGER";
    AdminRole["STAFF"] = "STAFF";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
