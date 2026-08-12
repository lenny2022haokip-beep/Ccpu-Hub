import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';

// Hardcoded catalog verification map to prevent client-side price tampering
const PRODUCT_CATALOG: Record<string, { name: string; price: number }> = {
  'saipikhup-shawl': { name: 'Kuki Saipikhup Shawl', price: 3800 },
  'thangsuo-shawl': { name: 'Kuki Thangsuo Honor Shawl', price: 4200 },
  'puandum-puan': { name: 'Paite Puandum Puan', price: 3400 },
  'hmar-am-shawl': { name: 'Hmar Am Traditional Shawl', price: 3650 },
  'khiangte-puan': { name: 'Vaiphei Khiangte Puan', price: 3200 },
  'zow-highland-blue': { name: 'Zou Highland Blue Puan', price: 2950 },
  'gangte-puanchei': { name: 'Gangte Puanchei Wrap', price: 3100 },
  'simte-puanchei': { name: 'Simte Puanchei Wrap', price: 3000 },
  'tedim-tangcip': { name: 'Tedim Tangcip Puan', price: 3300 },
  'kom-wrap': { name: 'Kom Traditional Wrap', price: 2850 },
  'khamtang-puan': { name: 'Khamtang Puan (Ponmong)', price: 2900 },
  'paite-khamtang': { name: 'Paite Khamtang Puan', price: 3150 },
  'hmar-thangsuo': { name: 'Hmar Thangsuo Honor Shawl', price: 3900 },
  'del-puan-wrap': { name: 'Kuki Del Puan Wrap', price: 2450 },
};

// Initialize Razorpay Instance lazily or dynamically
function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret_key';
  return new Razorpay({ key_id, key_secret });
}

/**
 * 1. Create Razorpay Payment Order (Server-Side Price Validation)
 * POST /api/v1/payment/create-order
 */
export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, customAmount } = req.body;

    let amountInPaise = 0;
    let productName = 'Custom Handloom Order';

    if (productId && PRODUCT_CATALOG[productId]) {
      // Server-side price lookup — NEVER trust price sent from client!
      const product = PRODUCT_CATALOG[productId];
      amountInPaise = product.price * 100; // Convert ₹ to paise
      productName = product.name;
    } else if (customAmount && typeof customAmount === 'number' && customAmount >= 100) {
      amountInPaise = Math.round(customAmount * 100);
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid product or amount specified. Minimum payment is ₹100.',
      });
      return;
    }

    const razorpay = getRazorpayInstance();
    const receiptId = `receipt_lh_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        platform: 'Lamka Hub Churachandpur',
        productName: productName,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id',
        productName: productName,
      },
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};

/**
 * 2. Verify Razorpay Payment Signature (HMAC SHA-256)
 * POST /api/v1/payment/verify-payment
 */
export const verifyPaymentSignature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters.',
      });
      return;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret_key';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature;

    if (isValid) {
      // Payment verified cleanly on server side!
      res.status(200).json({
        success: true,
        message: 'Payment signature verified successfully! Order confirmed.',
        data: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          status: 'verified',
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed (tampering suspected).',
      });
    }
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
      error: error.message,
    });
  }
};

/**
 * 3. Razorpay Webhook Handler
 * POST /api/v1/payment/webhook
 */
export const handlePaymentWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_webhook_secret';
    const signature = req.headers['x-razorpay-signature'] as string;

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature === expectedSignature) {
      const event = req.body.event;
      console.log(`[RAZORPAY WEBHOOK] Event Received: ${event}`);

      // Handle event (e.g. payment.captured, payment.failed)
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ status: 'invalid_signature' });
    }
  } catch (error: any) {
    console.error('Webhook Handling Error:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
};
