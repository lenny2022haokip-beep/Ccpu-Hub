import { Request, Response } from 'express';
import { DirectoryService } from '../services/directoryService.js';

export class DirectoryController {
  static async getListings(req: Request, res: Response): Promise<void> {
    try {
      const { query, category } = req.query;
      const listings = await DirectoryService.getListings(query as string, category as string);
      res.status(200).json({
        success: true,
        count: listings.length,
        data: listings,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error fetching directory listings' });
    }
  }
}
