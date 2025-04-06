const express = require("express");
const {
  getNodes,
  getNode,
  createNode,
  updateNode,
  deleteNode,
  getNodesInRadius,
} = require("../controllers/nodes");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/radius/:lat/:lng/:distance").get(protect, getNodesInRadius);

router.route("/").get(protect, getNodes).post(protect, createNode);

router
  .route("/:id")
  .get(protect, getNode)
  .put(protect, updateNode)
  .delete(protect, deleteNode);

module.exports = router;
