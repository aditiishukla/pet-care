import { Router } from 'express';
import { createAppointment, getMyAppointments, cancelAppointment } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').get(getMyAppointments).post(createAppointment);
router.put('/:id/cancel', cancelAppointment);

export default router;