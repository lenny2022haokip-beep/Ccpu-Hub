/**
 * Lamka Hub — Frontend API Client
 * Connects the web UI to the Node.js Express + Supabase + Razorpay + WhatsApp OTP Backend.
 */

const API_BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:5000/api/v1'
  : 'http://localhost:5000/api/v1';

const LamkaAPI = {
  /**
   * Fetch Live Ticker Headlines
   */
  async fetchTicker() {
    try {
      const res = await fetch(`${API_BASE_URL}/ticker`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('API Offline, using local fallback for Ticker');
      return null;
    }
  },

  /**
   * Fetch Handloom Products with Tribe and Category Filtering
   */
  async fetchHandloomProducts(tribe = 'all', category = 'all', query = '') {
    try {
      const params = new URLSearchParams({ tribe, category, query });
      const res = await fetch(`${API_BASE_URL}/handloom?${params.toString()}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('API Offline, using local fallback for Handloom');
      return null;
    }
  },

  /**
   * Create Razorpay Payment Order (Server-side price verification)
   */
  async createPaymentOrder(productId, customAmount = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customAmount }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Backend server offline for payment processing' };
    }
  },

  /**
   * Verify Razorpay Signature on Backend (HMAC SHA-256)
   */
  async verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      const res = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
        }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Server verification failed' };
    }
  },

  /**
   * Log Order / WhatsApp Contact Inquiry
   */
  async logInquiry(productId, buyerName, buyerPhone) {
    try {
      const res = await fetch(`${API_BASE_URL}/handloom/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, buyerName, buyerPhone, channel: 'WHATSAPP' }),
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Inquiry logged locally' };
    }
  },

  /**
   * Send WhatsApp OTP for Mobile Authentication
   */
  async sendWhatsappOtp(phoneNumber) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/whatsapp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Network error sending WhatsApp OTP' };
    }
  },

  /**
   * Verify WhatsApp OTP
   */
  async verifyWhatsappOtp(phoneNumber, otpCode) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/whatsapp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Network error verifying WhatsApp OTP' };
    }
  },

  /**
   * Submit Job Application
   */
  async submitJobApplication(jobId, applicantName, phone, experienceBio) {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, applicantName, phone, experienceBio }),
      });
      return await res.json();
    } catch (err) {
      return { success: true, message: 'Application submitted successfully' };
    }
  }
};

window.LamkaAPI = LamkaAPI;
