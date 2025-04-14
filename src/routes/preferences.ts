import express from "express";
import { getPreferences, updatePreferences } from "../controllers/preferences";

const router = express.Router();

import { protect } from "../middleware/auth";

router.route("/").get(protect, getPreferences).put(protect, updatePreferences);

export default router;
