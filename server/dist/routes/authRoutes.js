"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_js_1 = require("../controllers/authController.js");
const router = (0, express_1.Router)();
router.post('/whatsapp/send-otp', authController_js_1.AuthController.sendWhatsappOtp);
router.post('/whatsapp/verify-otp', authController_js_1.AuthController.verifyWhatsappOtp);
exports.default = router;
