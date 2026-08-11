import { Request, Response } from 'express';
import { TickerService } from '../services/tickerService.js';

export class TickerController {
  static async getHeadlines(req: Request, res: Response): Promise<void> {
    try {
      const headlines = await TickerService.getHeadlines();
      res.status(200).json({
        success: true,
        data: headlines,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error fetching ticker headlines' });
    }
  }
}
