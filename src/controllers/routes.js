const { findShortestPath } = require("../services/routeService");

// @desc    Calculate shortest path between two nodes
// @route   GET /api/routes/:startNodeId/:endNodeId
// @access  Private
exports.calculateRoute = async (req, res, next) => {
  try {
    const { startNodeId, endNodeId } = req.params;

    if (!startNodeId || !endNodeId) {
      return res.status(400).json({
        success: false,
        error: "Please provide both start and end node IDs",
      });
    }

    const result = await findShortestPath(startNodeId, endNodeId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.message,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalDistance: result.distance,
        path: result.path,
        edges: result.edges,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all possible routes from a node
// @route   GET /api/routes/from/:nodeId
// @access  Private
exports.getRoutesFromNode = async (req, res, next) => {
  try {
    const { nodeId } = req.params;

    // This would calculate routes to all other nodes
    // For large graphs, this could be expensive
    // Consider limiting the number of destinations or adding pagination

    res.status(200).json({
      success: true,
      message: "This endpoint will calculate routes to all accessible nodes",
      // Implementation would go here
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
