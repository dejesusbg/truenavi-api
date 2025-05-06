import { NextFunction, Request, Response } from 'express';
import Edge from '../models/Edge';

// @desc    Get all edges
// @route   GET /api/edges
// @access  Private
export const getEdges = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const edges = await Edge.find().populate('startNodeId endNodeId');
    res.status(200).json({ success: true, count: edges.length, data: edges });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Get single edge
// @route   GET /api/edges/:id
// @access  Private
export const getEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const edge = await Edge.findById(req.params.id).populate('startNodeId endNodeId');

    if (!edge) {
      return res.status(404).json({ success: false, error: 'Edge not found' });
    }

    res.status(200).json({ success: true, data: edge });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Create new edge
// @route   POST /api/edges
// @access  Private
export const createEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // extract necessary fields
    const { startNodeId, endNodeId, coordinates } = req.body;

    // validate required fields
    if (!startNodeId || !endNodeId || coordinates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Both node IDs (startNodeId and endNodeId) and coordinates are required',
      });
    }

    // create edge - distance will be calculated automatically by pre-save hook
    const edge = await Edge.create({ startNodeId, endNodeId, coordinates: coordinates || [] });

    // populate the nodes for the response
    const populatedEdge = await Edge.findById(edge._id).populate('startNodeId endNodeId');
    res.status(201).json({ success: true, data: populatedEdge });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Update edge
// @route   PUT /api/edges/:id
// @access  Private
export const updateEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const edge = await Edge.findById(req.params.id);

    if (!edge) {
      return res.status(404).json({ success: false, error: 'Edge not found' });
    }

    // update fields
    if (req.body.startNodeId) edge.startNodeId = req.body.startNodeId;
    if (req.body.endNodeId) edge.endNodeId = req.body.endNodeId;
    if (req.body.coordinates) edge.coordinates = req.body.coordinates;

    // save will trigger the pre-save hook to recalculate distance
    await edge.save();

    // populate the response
    const updatedEdge = await Edge.findById(edge._id).populate('startNodeId endNodeId');
    res.status(200).json({ success: true, data: updatedEdge });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Delete edge
// @route   DELETE /api/edges/:id
// @access  Private
export const deleteEdge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const edge = await Edge.findById(req.params.id);

    if (!edge) {
      return res.status(404).json({ success: false, error: 'Edge not found' });
    }

    await edge.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
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
      $or: [{ startNodeId: req.params.nodeId }, { endNodeId: req.params.nodeId }],
    }).populate('startNodeId endNodeId');

    res.status(200).json({ success: true, count: edges.length, data: edges });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
