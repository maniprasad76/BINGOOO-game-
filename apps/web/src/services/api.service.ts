const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL ? String((import.meta as any).env.VITE_API_BASE_URL).replace(/\/$/, '') : '') + '/api/v1';

export class ApiClient {
  private static getVisitorId(): string {
    let visitorId = localStorage.getItem('bingooo_visitor_id');
    if (!visitorId) {
      visitorId = 'bgo_vis_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('bingooo_visitor_id', visitorId);
    }
    return visitorId;
  }

  private static getCustomerToken(): string | null {
    return localStorage.getItem('bingooo_customer_token');
  }

  private static getAdminToken(): string | null {
    return localStorage.getItem('bingooo_admin_token');
  }

  public static async request(endpoint: string, options: RequestInit = {}, isAdmin = false) {
    const token = isAdmin ? this.getAdminToken() : this.getCustomerToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-visitor-id': this.getVisitorId(),
      ...(options.headers as Record<string, string>)
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  }

  // Customer Email Login
  static async emailLogin(email: string, displayName?: string) {
    const res = await this.request('/auth/email-login', {
      method: 'POST',
      body: JSON.stringify({ email, displayName })
    });
    if (res.token) {
      localStorage.setItem('bingooo_customer_token', res.token);
      localStorage.setItem('bingooo_customer_email', res.customer.email);
      localStorage.setItem('bingooo_customer_name', res.customer.displayName || '');
    }
    return res;
  }

  // Customer Google Login
  static async loginWithGoogle(email: string, displayName?: string, googleId?: string, avatarUrl?: string) {
    const res = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email, displayName, googleId, avatarUrl })
    });
    if (res.token) {
      localStorage.setItem('bingooo_customer_token', res.token);
      localStorage.setItem('bingooo_customer_email', res.customer.email);
      localStorage.setItem('bingooo_customer_name', res.customer.displayName || '');
    }
    return res;
  }

  // Customer Auth
  static async requestOtp(phoneNumber: string, marketingConsent = false) {
    return this.request('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, marketingConsent })
    });
  }

  static async verifyOtp(challengeId: string, otp: string) {
    const res = await this.request('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ challengeId, otp })
    });
    if (res.token) {
      localStorage.setItem('bingooo_customer_token', res.token);
      localStorage.setItem('bingooo_customer_phone', res.customer.maskedPhone);
    }
    return res;
  }

  static async getCustomerMe() {
    return this.request('/auth/me');
  }

  static async logoutCustomer() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('bingooo_customer_token');
      localStorage.removeItem('bingooo_customer_phone');
    }
  }

  // Wheel
  static async getWheelConfig() {
    return this.request('/wheel/config');
  }

  static async checkEligibility() {
    return this.request('/wheel/eligibility');
  }

  static async executeSpin(idempotencyKey?: string) {
    return this.request('/wheel/spin', {
      method: 'POST',
      headers: idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : {}
    });
  }

  static async getCustomerSpinHistory() {
    return this.request('/wheel/history');
  }

  // Module 1 & Shared Rewards
  static async getMyRewards() {
    return this.request('/rewards');
  }

  static async getRewardByCode(code: string) {
    return this.request(`/rewards/${code}`);
  }

  // Module 2: BINGOOO Coins
  static async getLoyaltyWallet() {
    return this.request('/loyalty/wallet');
  }

  static async getRedemptionOptions() {
    return this.request('/loyalty/redemption-options');
  }

  static async redeemCoins(tierId: string) {
    return this.request('/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ tierId })
    });
  }

  // Google Maps Review Rewards
  static async getGoogleReviewStatus() {
    return this.request('/loyalty/google-review/status');
  }

  static async claimGoogleReview(reviewerName?: string) {
    return this.request('/loyalty/google-review/claim', {
      method: 'POST',
      body: JSON.stringify({ reviewerName })
    });
  }

  // Module 3: Refer & Earn
  static async getReferralCode() {
    return this.request('/referrals/my-code');
  }

  static async getReferralSummary() {
    return this.request('/referrals/summary');
  }

  static async attributeReferral(code: string) {
    return this.request('/referrals/attribute', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  // Module 4: Store QR
  static async getStores() {
    return this.request('/store/stores');
  }

  static async requestCheckIn(storeId: string, qrNonce?: string) {
    return this.request('/store/check-ins/request', {
      method: 'POST',
      body: JSON.stringify({ storeId, qrNonce })
    });
  }

  static async getCheckInHistory() {
    return this.request('/store/check-ins/history');
  }

  // Module 5: Birthday Rewards
  static async getBirthdayProfile() {
    return this.request('/birthdays/profile');
  }

  static async updateBirthdayPreferences(birthMonth: number, birthDay: number, preferredCategory?: string) {
    return this.request('/birthdays/preferences', {
      method: 'PATCH',
      body: JSON.stringify({ birthMonth, birthDay, preferredCategory })
    });
  }

  static async getBirthdayEligibility() {
    return this.request('/birthdays/eligibility');
  }

  static async claimBirthdayReward() {
    return this.request('/birthdays/claim', { method: 'POST' });
  }

  // Admin extensions
  static async getAdminCheckIns() {
    return this.request('/admin/check-ins', {}, true);
  }

  static async approveCheckIn(id: string) {
    return this.request(`/admin/store-check-ins/${id}/approve`, { method: 'POST' }, true);
  }

  static async recordPurchase(data: { customerId: string; storeId: string; externalReceiptId: string; grossAmount: number; discountAmount?: number }) {
    return this.request('/admin/purchases', {
      method: 'POST',
      body: JSON.stringify(data)
    }, true);
  }

  static async getAdminPurchases() {
    return this.request('/admin/purchases', {}, true);
  }

  static async getAdminReferrals() {
    return this.request('/admin/referrals', {}, true);
  }

  static async adminLogin(username: string, password: string) {
    const res = await this.request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.token) {
      localStorage.setItem('bingooo_admin_token', res.token);
      localStorage.setItem('bingooo_admin_user', JSON.stringify(res.admin));
    }
    return res;
  }

  static async adminGoogleLogin(email: string, displayName?: string, googleId?: string) {
    const res = await this.request('/admin/auth/google', {
      method: 'POST',
      body: JSON.stringify({ email, displayName, googleId })
    });
    if (res.token) {
      localStorage.setItem('bingooo_admin_token', res.token);
      localStorage.setItem('bingooo_admin_user', JSON.stringify(res.admin));
    }
    return res;
  }

  static async getAdminDashboard() {
    return this.request('/admin/dashboard', {}, true);
  }

  static async getAdminCustomers(page = 1, search?: string) {
    const query = search ? `?page=${page}&search=${encodeURIComponent(search)}` : `?page=${page}`;
    return this.request(`/admin/customers${query}`, {}, true);
  }

  static async getAdminSpins(page = 1, periodKey?: string) {
    const query = periodKey ? `?page=${page}&periodKey=${periodKey}` : `?page=${page}`;
    return this.request(`/admin/spins${query}`, {}, true);
  }

  static async getAdminRewards(page = 1, status?: string, prizeType?: string) {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '50');
    if (status && status !== 'ALL') params.set('status', status);
    if (prizeType && prizeType !== 'ALL') params.set('prizeType', prizeType);
    return this.request(`/admin/rewards?${params.toString()}`, {}, true);
  }

  static async redeemVoucher(code: string, notes?: string) {
    return this.request('/admin/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ code, notes })
    }, true);
  }

  static async revokeReward(rewardId: string, reason: string) {
    return this.request(`/admin/rewards/${rewardId}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    }, true);
  }

  static async getAdminPrizes() {
    return this.request('/admin/prizes', {}, true);
  }

  static async updateAdminPrizes(prizes: any[]) {
    return this.request('/admin/prizes', {
      method: 'PATCH',
      body: JSON.stringify({ prizes })
    }, true);
  }

  static async getAdminCampaigns() {
    return this.request('/admin/campaigns', {}, true);
  }

  static async getAdminAuditLogs(page = 1) {
    return this.request(`/admin/audit-logs?page=${page}`, {}, true);
  }

  static async getAdminSettings() {
    return this.request('/admin/settings', {}, true);
  }

  static async updateAdminSettings(settings: any[]) {
    return this.request('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ settings })
    }, true);
  }

  static logoutAdmin() {
    localStorage.removeItem('bingooo_admin_token');
    localStorage.removeItem('bingooo_admin_user');
  }

  // Instagram Dynamic Reels Feed
  static async getInstagramReels() {
    return this.request('/instagram/reels');
  }

  static async syncInstagramReels() {
    return this.request('/instagram/sync', { method: 'POST' });
  }

  static async addInstagramReel(data: { url: string; title?: string; caption?: string; badge?: string }) {
    return this.request('/instagram/reels', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
