const Edge = require("../models/Edge");

// @desc    Get all edges
// @route   GET /api/edges
// @access  Private
exports.getEdges = async (req, res, next) => {
  try {
    const edges = await Edge.find().populate("a_id b_id");

    res.status(200).json({
      success: true,
      count: edges.length,
      data: edges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single edge
// @route   GET /api/edges/:id
// @access  Private
exports.getEdge = async (req, res, next) => {
  try {
    const edge = await Edge.findById(req.params.id).populate("a_id b_id");

    if (!edge) {
      return res.status(404).json({
        success: false,
        error: "Edge not found",
      });
    }

    res.status(200).json({
      success: true,
      data: edge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create new edge
// @route   POST /api/edges
// @access  Private
exports.createEdge = async (req, res, next) => {
  try {
    const edge = await Edge.create(req.body);

    res.status(201).json({
      success: true,
      data: edge,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update edge
// @route   PUT /api/edges/:id
// @access  Private
exports.updateEdge = async (req, res, next) => {
  try {
    const edge = await Edge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!edge) {
      return res.status(404).json({
        success: false,
        error: "Edge not found",
      });
    }

    res.status(200).json({
      success: true,
      data: edge,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete edge
// @route   DELETE /api/edges/:id
// @access  Private
exports.deleteEdge = async (req, res, next) => {
  try {
    const edge = await Edge.findById(req.params.id);

    if (!edge) {
      return res.status(404).json({
        success: false,
        error: "Edge not found",
      });
    }

    await edge.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get edges for a specific node
// @route   GET /api/edges/node/:nodeId
// @access  Private
exports.getNodeEdges = async (req, res, next) => {
  try {
    const edges = await Edge.find({
      $or: [{ a_id: req.params.nodeId }, { b_id: req.params.nodeId }],
    }).populate("a_id b_id");

    res.status(200).json({
      success: true,
      count: edges.length,
      data: edges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
