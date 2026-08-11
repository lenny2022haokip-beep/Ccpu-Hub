"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobsController_js_1 = require("../controllers/jobsController.js");
const router = (0, express_1.Router)();
router.get('/', jobsController_js_1.JobsController.getJobs);
router.post('/apply', jobsController_js_1.JobsController.submitApplication);
exports.default = router;
