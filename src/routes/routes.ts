import express from 'express';
import { calculateRoute } from '../controllers/routes';

const router = express.Router();

router.get('/:startNodeId/:endNodeId', calculateRoute);

export default router;
