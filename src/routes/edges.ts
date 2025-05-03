import express from 'express';
import {
  getEdges,
  getEdge,
  createEdge,
  updateEdge,
  deleteEdge,
  getNodeEdges,
} from '../controllers/edges';

const router = express.Router();

import { protect } from '../middleware/auth';

router.route('/node/:nodeId').get(protect, getNodeEdges);
router.route('/').get(protect, getEdges).post(protect, createEdge);
router.route('/:id').get(protect, getEdge).put(protect, updateEdge).delete(protect, deleteEdge);

export default router;
