import express from "express";
import {
  getNodes,
  getNode,
  createNode,
  updateNode,
  deleteNode,
  getNodesInRadius,
} from "../controllers/nodes";

const router = express.Router();

import { protect } from "../middleware/auth";

router.route("/radius/:lat/:lng/:distance").get(protect, getNodesInRadius);

router.route("/").get(protect, getNodes).post(protect, createNode);

router
  .route("/:id")
  .get(protect, getNode)
  .put(protect, updateNode)
  .delete(protect, deleteNode);

export default router;
