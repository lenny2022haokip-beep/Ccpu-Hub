import { Request, Response } from 'express';
import { JobsService } from '../services/jobsService.js';

export class JobsController {
  static async getJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await JobsService.getJobs();
      res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error fetching jobs' });
    }
  }

  static async submitApplication(req: Request, res: Response): Promise<void> {
    try {
      const { jobId, applicantName, phone, experienceBio } = req.body;
      if (!jobId || !applicantName || !phone) {
        res.status(400).json({ success: false, message: 'Job ID, applicant name, and phone are required.' });
        return;
      }

      const result = await JobsService.submitApplication({ jobId, applicantName, phone, experienceBio });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error submitting application' });
    }
  }
}
