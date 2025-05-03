import { NextFunction, Request, Response } from 'express';
import Node from '../models/Node';

// @desc    Get all nodes
// @route   GET /api/nodes
// @access  Private
export const getNodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nodes = await Node.find();

    res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Get single node
// @route   GET /api/nodes/:id
// @access  Private
export const getNode = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const node = await Node.findById(req.params.id).populate('next');

    if (!node) {
      return res.status(404).json({
        success: false,
        error: 'Node not found',
      });
    }

    res.status(200).json({
      success: true,
      data: node,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Create new node
// @route   POST /api/nodes
// @access  Private
export const createNode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const node = await Node.create(req.body);

    res.status(201).json({
      success: true,
      data: node,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Update node
// @route   PUT /api/nodes/:id
// @access  Private
export const updateNode = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const node = await Node.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!node) {
      return res.status(404).json({
        success: false,
        error: 'Node not found',
      });
    }

    res.status(200).json({
      success: true,
      data: node,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// @desc    Delete node
// @route   DELETE /api/nodes/:id
// @access  Private
export const deleteNode = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const node = await Node.findById(req.params.id);

    if (!node) {
      return res.status(404).json({
        success: false,
        error: 'Node not found',
      });
    }

    await node.remove();

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

// @desc    Get nodes within radius
// @route   GET /api/nodes/radius/:lat/:lng/:distance
// @access  Private
export const getNodesInRadius = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, distance } = req.params;

    // Calculate radius using radians
    // Divide distance by radius of Earth (6378.1 kilometers)
    const radius = parseFloat(distance) / 6378.1;

    const nodes = await Node.find({
      coordinates: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });

    res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};
