import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

router.post('/whatsapp/send-otp', AuthController.sendWhatsappOtp);
router.post('/whatsapp/verify-otp', AuthController.verifyWhatsappOtp);

export default router;
