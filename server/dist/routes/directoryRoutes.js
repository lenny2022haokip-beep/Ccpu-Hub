"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const directoryController_js_1 = require("../controllers/directoryController.js");
const router = (0, express_1.Router)();
router.get('/', directoryController_js_1.DirectoryController.getListings);
exports.default = router;
