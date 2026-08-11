import { Request, Response } from 'express';
import { NoticesService } from '../services/noticesService.js';

export class NoticesController {
  static async getNotices(req: Request, res: Response): Promise<void> {
    try {
      const notices = await NoticesService.getNotices();
      res.status(200).json({
        success: true,
        count: notices.length,
        data: notices,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error fetching town notices' });
    }
  }
}
