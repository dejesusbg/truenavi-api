import express from "express";
import { calculateRoute } from "../controllers/routes";

const router = express.Router();

import { protect } from "../middleware/auth";

router.get("/:startNodeId/:endNodeId", protect, calculateRoute);

export default router;
