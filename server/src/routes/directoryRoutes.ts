import { Router } from 'express';
import { DirectoryController } from '../controllers/directoryController.js';

const router = Router();

router.get('/', DirectoryController.getListings);

export default router;
