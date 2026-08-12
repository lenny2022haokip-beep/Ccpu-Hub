import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPaymentSignature,
  handlePaymentWebhook,
} from '../controllers/paymentController.js';

const router = Router();

// Create Razorpay payment order
router.post('/create-order', createPaymentOrder);

// Verify Razorpay payment signature
router.post('/verify-payment', verifyPaymentSignature);

// Razorpay webhook callback
router.post('/webhook', handlePaymentWebhook);

export default router;
