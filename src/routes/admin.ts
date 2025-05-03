import express from 'express';
import { updateAdmin, getAllAdmins, deleteAdmin } from '../controllers/admin';

const router = express.Router();

import { protect } from '../middleware/auth';

router.route('/:id').put(protect, updateAdmin);
router.route('/').get(protect, getAllAdmins);
router.route('/:id').delete(protect, deleteAdmin);

export default router;
