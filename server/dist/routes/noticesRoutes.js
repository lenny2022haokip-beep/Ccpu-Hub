"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noticesController_js_1 = require("../controllers/noticesController.js");
const router = (0, express_1.Router)();
router.get('/', noticesController_js_1.NoticesController.getNotices);
exports.default = router;
