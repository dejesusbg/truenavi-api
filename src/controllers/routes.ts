import { NextFunction, Request, Response } from "express";
import { findShortestPath } from "../services/routeService";

// @desc    Calculate shortest path between two nodes
// @route   GET /api/routes/:startNodeId/:endNodeId
// @access  Private
export const calculateRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
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
      error: (error as Error).message,
    });
  }
};
