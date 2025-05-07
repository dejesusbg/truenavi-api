import express from 'express';
import {
  getNodes,
  getNode,
  createNode,
  updateNode,
  deleteNode,
  getNodesInRadius,
} from '../controllers/nodes';

const router = express.Router();

import { protect } from '../middleware/auth';

router.route('/:id').get(protect, getNode).put(protect, updateNode).delete(protect, deleteNode);
router.route('/').post(protect, createNode);

router.get('/radius/:lat/:lng/:distance', getNodesInRadius);
router.get('/', getNodes);

export default router;
