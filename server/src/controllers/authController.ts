import { Request, Response } from 'express';
import { WhatsappOtpService } from '../services/whatsappOtpService.js';

export class AuthController {
  static async sendWhatsappOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        res.status(400).json({ success: false, message: 'Phone number is required for WhatsApp OTP.' });
        return;
      }

      const result = await WhatsappOtpService.sendOtp(phoneNumber);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error sending WhatsApp OTP' });
    }
  }

  static async verifyWhatsappOtp(req: Request, res: Response): Promise<void> {
    try {
      const { phoneNumber, otpCode } = req.body;
      if (!phoneNumber || !otpCode) {
        res.status(400).json({ success: false, message: 'Phone number and OTP code are required.' });
        return;
      }

      const result = await WhatsappOtpService.verifyOtp(phoneNumber, otpCode);
      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error verifying OTP' });
    }
  }
}
