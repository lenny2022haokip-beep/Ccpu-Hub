"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const whatsappOtpService_js_1 = require("../services/whatsappOtpService.js");
class AuthController {
    static async sendWhatsappOtp(req, res) {
        try {
            const { phoneNumber } = req.body;
            if (!phoneNumber) {
                res.status(400).json({ success: false, message: 'Phone number is required for WhatsApp OTP.' });
                return;
            }
            const result = await whatsappOtpService_js_1.WhatsappOtpService.sendOtp(phoneNumber);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error sending WhatsApp OTP' });
        }
    }
    static async verifyWhatsappOtp(req, res) {
        try {
            const { phoneNumber, otpCode } = req.body;
            if (!phoneNumber || !otpCode) {
                res.status(400).json({ success: false, message: 'Phone number and OTP code are required.' });
                return;
            }
            const result = await whatsappOtpService_js_1.WhatsappOtpService.verifyOtp(phoneNumber, otpCode);
            if (!result.success) {
                res.status(400).json(result);
                return;
            }
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error verifying OTP' });
        }
    }
}
exports.AuthController = AuthController;
