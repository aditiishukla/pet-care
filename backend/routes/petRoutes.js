import { Router } from 'express';
import { getPets, getPetById, createPet, updatePet, deletePet } from '../controllers/petController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').get(getPets).post(upload.single('image'), createPet);
router.route('/:id').get(getPetById).put(upload.single('image'), updatePet).delete(deletePet);

export default router;