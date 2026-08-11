import { Request, Response } from 'express';
import { HandloomService } from '../services/handloomService.js';

export class HandloomController {
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { tribe, category, query } = req.query;
      const products = await HandloomService.getProducts({
        tribe: tribe as string,
        category: category as string,
        query: query as string,
      });

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error fetching handloom products' });
    }
  }

  static async logInquiry(req: Request, res: Response): Promise<void> {
    try {
      const { productId, buyerName, buyerPhone, channel } = req.body;
      const result = await HandloomService.logInquiry({ productId, buyerName, buyerPhone, channel });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error logging inquiry' });
    }
  }
}
