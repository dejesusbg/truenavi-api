import express from 'express';
import { updateAdmin, getAdmins, deleteAdmin } from '../controllers/admin';

const router = express.Router();

import { protect } from '../middleware/auth';

router.route('/:id').put(protect, updateAdmin).delete(protect, deleteAdmin);
router.route('/').get(protect, getAdmins);

export default router;
