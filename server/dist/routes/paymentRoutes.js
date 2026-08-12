"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_js_1 = require("../controllers/paymentController.js");
const router = (0, express_1.Router)();
// Create Razorpay payment order
router.post('/create-order', paymentController_js_1.createPaymentOrder);
// Verify Razorpay payment signature
router.post('/verify-payment', paymentController_js_1.verifyPaymentSignature);
// Razorpay webhook callback
router.post('/webhook', paymentController_js_1.handlePaymentWebhook);
exports.default = router;
