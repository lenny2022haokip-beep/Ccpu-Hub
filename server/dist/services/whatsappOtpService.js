"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappOtpService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabase_js_1 = require("../config/supabase.js");
// In-memory fallback cache for development / offline local testing
const activeOtps = new Map();
class WhatsappOtpService {
    /**
     * Generate 6-digit OTP code
     */
    static generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    /**
     * Send WhatsApp OTP to user phone number
     */
    static async sendOtp(phoneNumber) {
        const formattedPhone = phoneNumber.replace(/[^0-9+]/g, '');
        const otpCode = this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        // Save OTP to activeOtps map
        activeOtps.set(formattedPhone, {
            phone_number: formattedPhone,
            otp_code: otpCode,
            expires_at: expiresAt,
        });
        // Try persisting to Supabase if available
        try {
            await supabase_js_1.supabaseAdmin.from('whatsapp_otps').insert({
                phone_number: formattedPhone,
                otp_code: otpCode,
                expires_at: expiresAt.toISOString(),
            });
        }
        catch (e) {
            console.warn('Supabase DB offline or not configured yet; using in-memory OTP handler.');
        }
        const mode = process.env.WHATSAPP_MODE || 'development';
        if (mode === 'production' && process.env.WHATSAPP_API_TOKEN) {
            // Production Meta WhatsApp Cloud API request payload
            try {
                const payload = {
                    messaging_product: 'whatsapp',
                    to: formattedPhone,
                    type: 'template',
                    template: {
                        name: 'verification_code',
                        language: { code: 'en_US' },
                        components: [
                            {
                                type: 'body',
                                parameters: [{ type: 'text', text: otpCode }],
                            },
                            {
                                type: 'button',
                                sub_type: 'url',
                                index: '0',
                                parameters: [{ type: 'text', text: otpCode }],
                            },
                        ],
                    },
                };
                const res = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    const errData = await res.json();
                    console.error('WhatsApp Meta API error:', errData);
                }
            }
            catch (err) {
                console.error('Error invoking WhatsApp Cloud API:', err);
            }
        }
        console.log(`\n==================================================`);
        console.log(`💬 WHATSAPP OTP SENT TO ${formattedPhone}`);
        console.log(`🔑 VERIFICATION CODE: ${otpCode}`);
        console.log(`==================================================\n`);
        return {
            success: true,
            message: `WhatsApp OTP sent successfully to ${formattedPhone}`,
            devOtp: mode === 'development' ? otpCode : undefined,
        };
    }
    /**
     * Verify WhatsApp OTP code and issue JWT Token
     */
    static async verifyOtp(phoneNumber, inputOtp) {
        const formattedPhone = phoneNumber.replace(/[^0-9+]/g, '');
        const record = activeOtps.get(formattedPhone);
        if (!record) {
            return { success: false, message: 'No OTP request found for this phone number. Please request a new code.' };
        }
        if (new Date() > record.expires_at) {
            activeOtps.delete(formattedPhone);
            return { success: false, message: 'OTP has expired. Please request a new verification code.' };
        }
        if (record.otp_code !== inputOtp.trim()) {
            return { success: false, message: 'Invalid OTP code. Please check your WhatsApp and try again.' };
        }
        // OTP Verified successfully
        activeOtps.delete(formattedPhone);
        // Sign JWT Token
        const jwtSecret = process.env.JWT_SECRET || 'lamka_hub_super_secret_jwt_key_2026';
        const token = jsonwebtoken_1.default.sign({ phone: formattedPhone, role: 'BUYER' }, jwtSecret, { expiresIn: '7d' });
        return {
            success: true,
            token,
            message: 'WhatsApp authentication successful!',
        };
    }
}
exports.WhatsappOtpService = WhatsappOtpService;
