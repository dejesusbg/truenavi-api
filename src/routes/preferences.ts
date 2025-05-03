import express from 'express';
import { getPreferences, updatePreferences } from '../controllers/preferences';

const router = express.Router();

router.route('/').get(getPreferences).put(updatePreferences);

export default router;
