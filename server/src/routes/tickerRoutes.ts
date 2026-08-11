import { Router } from 'express';
import { TickerController } from '../controllers/tickerController.js';

const router = Router();

router.get('/', TickerController.getHeadlines);

export default router;
