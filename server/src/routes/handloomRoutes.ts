import { Router } from 'express';
import { HandloomController } from '../controllers/handloomController.js';

const router = Router();

router.get('/', HandloomController.getProducts);
router.post('/inquire', HandloomController.logInquiry);

export default router;
