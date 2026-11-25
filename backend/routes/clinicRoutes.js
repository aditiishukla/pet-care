import { Router } from 'express';
import { getNearbyClinics, geocode } from '../controllers/clinicController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/nearby', getNearbyClinics);
router.get('/geocode', geocode);

export default router;