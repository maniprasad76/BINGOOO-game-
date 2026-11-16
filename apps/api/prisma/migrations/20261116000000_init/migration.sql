-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'MANAGER', 'STAFF');
CREATE TYPE "PrizeType" AS ENUM ('DISCOUNT_10', 'DISCOUNT_5', 'FREE_GIFT', 'NO_PRIZE');
CREATE TYPE "RewardStatus" AS ENUM ('ISSUED', 'REDEEMED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "SpinStatus" AS ENUM ('COMPLETED', 'CANCELLED');

-- CreateTable Customer
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable OtpChallenge
CREATE TABLE "OtpChallenge" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "isConsumed" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OtpChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable CustomerSession
CREATE TABLE "CustomerSession" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomerSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable AdminUser
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable Campaign
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable Prize
CREATE TABLE "Prize" (
    "id" TEXT NOT NULL,
    "type" "PrizeType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "basisPoints" INTEGER NOT NULL DEFAULT 1000,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#C91F32',
    "textColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Prize_pkey" PRIMARY KEY ("id")
);

-- CreateTable PrizeConfigurationVersion
CREATE TABLE "PrizeConfigurationVersion" (
    "id" TEXT NOT NULL,
    "version" SERIAL NOT NULL,
    "snapshot" JSONB NOT NULL,
    "appliedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrizeConfigurationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable GiftInventory
CREATE TABLE "GiftInventory" (
    "id" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "giftName" TEXT NOT NULL,
    "totalStock" INTEGER NOT NULL DEFAULT 0,
    "reservedStock" INTEGER NOT NULL DEFAULT 0,
    "redeemedStock" INTEGER NOT NULL DEFAULT 0,
    "monthlyLimit" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GiftInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable Spin
CREATE TABLE "Spin" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "status" "SpinStatus" NOT NULL DEFAULT 'COMPLETED',
    "idempotencyKey" TEXT,
    "clientIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Spin_pkey" PRIMARY KEY ("id")
);

-- CreateTable Reward
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "spinId" TEXT NOT NULL,
    "prizeId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "status" "RewardStatus" NOT NULL DEFAULT 'ISSUED',
    "discountPct" INTEGER,
    "isGift" BOOLEAN NOT NULL DEFAULT false,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable Redemption
CREATE TABLE "Redemption" (
    "id" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "storeLocation" TEXT NOT NULL DEFAULT 'Srikakulam Store',
    "notes" TEXT,
    CONSTRAINT "Redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable AuditLog
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable AppSetting
CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phoneNumber_key" ON "Customer"("phoneNumber");
CREATE INDEX "Customer_phoneNumber_idx" ON "Customer"("phoneNumber");

CREATE INDEX "OtpChallenge_phoneNumber_createdAt_idx" ON "OtpChallenge"("phoneNumber", "createdAt");
CREATE UNIQUE INDEX "CustomerSession_tokenHash_key" ON "CustomerSession"("tokenHash");
CREATE INDEX "CustomerSession_customerId_idx" ON "CustomerSession"("customerId");

CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

CREATE UNIQUE INDEX "Campaign_periodKey_key" ON "Campaign"("periodKey");

CREATE UNIQUE INDEX "GiftInventory_prizeId_key" ON "GiftInventory"("prizeId");

CREATE INDEX "Spin_periodKey_idx" ON "Spin"("periodKey");
CREATE INDEX "Spin_customerId_idx" ON "Spin"("customerId");
CREATE UNIQUE INDEX "Spin_customerId_periodKey_key" ON "Spin"("customerId", "periodKey");

CREATE UNIQUE INDEX "Reward_code_key" ON "Reward"("code");
CREATE UNIQUE INDEX "Reward_spinId_key" ON "Reward"("spinId");
CREATE INDEX "Reward_customerId_idx" ON "Reward"("customerId");
CREATE INDEX "Reward_code_idx" ON "Reward"("code");
CREATE INDEX "Reward_status_idx" ON "Reward"("status");

CREATE UNIQUE INDEX "Redemption_rewardId_key" ON "Redemption"("rewardId");

CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");
CREATE UNIQUE INDEX "AppSetting_key_key" ON "AppSetting"("key");

-- AddForeignKey
ALTER TABLE "OtpChallenge" ADD CONSTRAINT "OtpChallenge_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerSession" ADD CONSTRAINT "CustomerSession_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GiftInventory" ADD CONSTRAINT "GiftInventory_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "Prize"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "Prize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_spinId_fkey" FOREIGN KEY ("spinId") REFERENCES "Spin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_prizeId_fkey" FOREIGN KEY ("prizeId") REFERENCES "Prize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
