const express = require("express");
const {
  getPreferences,
  updatePreferences,
} = require("../controllers/preferences");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/").get(protect, getPreferences).put(protect, updatePreferences);

module.exports = router;
