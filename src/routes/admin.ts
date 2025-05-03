import express from 'express';
import { updateAdmin, getAllAdmins, deleteAdmin } from '../controllers/admin';

const router = express.Router();

import { protect } from '../middleware/auth';

router.route('/:id').put(protect, updateAdmin).delete(protect, deleteAdmin);
router.route('/').get(protect, getAllAdmins);

export default router;
