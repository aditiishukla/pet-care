import { Router } from 'express';
import { getVets, getVetFilters, getVetById, getVetSlots } from '../controllers/vetController.js';

const router = Router();

router.get('/', getVets);
router.get('/filters', getVetFilters); // must stay above '/:id'
router.get('/:id', getVetById);
router.get('/:id/slots', getVetSlots);

export default router;