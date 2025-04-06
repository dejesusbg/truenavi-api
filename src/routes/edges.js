const express = require("express");
const {
  getEdges,
  getEdge,
  createEdge,
  updateEdge,
  deleteEdge,
  getNodeEdges,
} = require("../controllers/edges");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.route("/node/:nodeId").get(protect, getNodeEdges);

router.route("/").get(protect, getEdges).post(protect, createEdge);

router
  .route("/:id")
  .get(protect, getEdge)
  .put(protect, updateEdge)
  .delete(protect, deleteEdge);

module.exports = router;
