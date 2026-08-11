"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handloomController_js_1 = require("../controllers/handloomController.js");
const router = (0, express_1.Router)();
router.get('/', handloomController_js_1.HandloomController.getProducts);
router.post('/inquire', handloomController_js_1.HandloomController.logInquiry);
exports.default = router;
