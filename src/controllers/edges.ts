import { NextFunction, Request, Response } from 'express';
import Edge from '../models/Edge';

// @desc    Get all edges
// @route   GET /api/edges
// @access  Private
export const getEdges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const edges = await Edge.find().populate('a_id b_id');

    res.status(200).json({
      success: true,
      count: edges.length,
      data: edges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Get single edge
// @route   GET /api/edges/:id
// @access  Private
export const getEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const edge = await Edge.findById(req.params.id).populate('a_id b_id');

    if (!edge) {
      return res.status(404).json({
        success: false,
        error: 'Edge not found',
      });
    }

    res.status(200).json({
      success: true,
      data: edge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Create new edge
// @route   POST /api/edges
// @access  Private
export const createEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // extract necessary fields
    const { a_id, b_id, coordinates } = req.body;

    // validate required fields
    if (!a_id || !b_id || coordinates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Both node IDs (a_id and b_id) and coordinates are required',
      });
    }

    // create edge - distance will be calculated automatically by pre-save hook
    const edge = await Edge.create({
      a_id,
      b_id,
      coordinates: coordinates || [],
    });

    // populate the nodes for the response
    const populatedEdge = await Edge.findById(edge._id).populate('a_id b_id');

    res.status(201).json({
      success: true,
      data: populatedEdge,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Update edge
// @route   PUT /api/edges/:id
// @access  Private
export const updateEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const edge = await Edge.findById(req.params.id);

    if (!edge) {
      return res.status(404).json({
        success: false,
        error: 'Edge not found',
      });
    }

    // update fields
    if (req.body.a_id) edge.a_id = req.body.a_id;
    if (req.body.b_id) edge.b_id = req.body.b_id;
    if (req.body.coordinates) edge.coordinates = req.body.coordinates;

    // save will trigger the pre-save hook to recalculate distance
    await edge.save();

    // populate the response
    const updatedEdge = await Edge.findById(edge._id).populate('a_id b_id');

    res.status(200).json({
      success: true,
      data: updatedEdge,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Delete edge
// @route   DELETE /api/edges/:id
// @access  Private
export const deleteEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const edge = await Edge.findById(req.params.id);

    if (!edge) {
      return res.status(404).json({
        success: false,
        error: 'Edge not found',
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
      error: (error as Error).message,
    });
  }
};

// @desc    Get edges for a specific node
// @route   GET /api/edges/node/:nodeId
// @access  Private
export const getNodeEdges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const edges = await Edge.find({
      $or: [{ a_id: req.params.nodeId }, { b_id: req.params.nodeId }],
    }).populate('a_id b_id');

    res.status(200).json({
      success: true,
      count: edges.length,
      data: edges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};
