const express = require("express");
const { calculateRoute, getRoutesFromNode } = require("../controllers/routes");

const router = express.Router();

const { protect } = require("../middleware/auth");

// Calculate route between two nodes
router.get("/:startNodeId/:endNodeId", protect, calculateRoute);

// Get all possible routes from a node
router.get("/from/:nodeId", protect, getRoutesFromNode);

module.exports = router;
