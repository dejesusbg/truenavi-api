import mongoose from 'mongoose';
import { calculateDistance } from '../utils/distance';
import Node from './Node';

const EdgeSchema = new mongoose.Schema({
  startNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', required: true },
  endNodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', required: true },
  distance: { type: Number, min: 0 },
  timestamp: { type: String, default: () => new Date().toISOString() },
});

// compound index for faster lookups
EdgeSchema.index({ startNodeId: 1, endNodeId: 1 }, { unique: true });

// pre-save middleware to automatically calculate the distance
EdgeSchema.pre('save', async function (next) {
  try {
    // fetch the nodes to get their distance
    const startNode = await Node.findById(this.startNodeId);
    const endNode = await Node.findById(this.endNodeId);

    if (!startNode || !endNode) {
      throw new Error('Cannot find both nodes to calculate distance');
    }

    this.distance = calculateDistance(startNode.coordinates, endNode.coordinates);

    next();
  } catch (error) {
    next(error as Error);
  }
});

const Edge = mongoose.model('Edge', EdgeSchema);
export default Edge;
