"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsController = void 0;
const jobsService_js_1 = require("../services/jobsService.js");
class JobsController {
    static async getJobs(req, res) {
        try {
            const jobs = await jobsService_js_1.JobsService.getJobs();
            res.status(200).json({
                success: true,
                count: jobs.length,
                data: jobs,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error fetching jobs' });
        }
    }
    static async submitApplication(req, res) {
        try {
            const { jobId, applicantName, phone, experienceBio } = req.body;
            if (!jobId || !applicantName || !phone) {
                res.status(400).json({ success: false, message: 'Job ID, applicant name, and phone are required.' });
                return;
            }
            const result = await jobsService_js_1.JobsService.submitApplication({ jobId, applicantName, phone, experienceBio });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message || 'Error submitting application' });
        }
    }
}
exports.JobsController = JobsController;
