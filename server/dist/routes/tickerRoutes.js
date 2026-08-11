"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tickerController_js_1 = require("../controllers/tickerController.js");
const router = (0, express_1.Router)();
router.get('/', tickerController_js_1.TickerController.getHeadlines);
exports.default = router;
