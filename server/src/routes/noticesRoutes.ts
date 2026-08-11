import { Router } from 'express';
import { NoticesController } from '../controllers/noticesController.js';

const router = Router();

router.get('/', NoticesController.getNotices);

export default router;
