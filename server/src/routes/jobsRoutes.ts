import { Router } from 'express';
import { JobsController } from '../controllers/jobsController.js';

const router = Router();

router.get('/', JobsController.getJobs);
router.post('/apply', JobsController.submitApplication);

export default router;
