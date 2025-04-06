const mongoose = require('mongoose');
const Node = require('./Node');
const { calculateDistance, calculatePathDistance } = require('../utils/distance');

const EdgeSchema = new mongoose.Schema({
  a_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    required: true
  },
  b_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    required: true
  },
  coordinates: {
    type: [[Number]],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(coord => coord.length === 2);
      },
      message: props => 'Coordinates must be an array of [lat, lng] pairs!'
    }
  },
  distance: {
    type: Number,
    min: 0
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString()
  }
});

// Compound index for faster lookups
EdgeSchema.index({ a_id: 1, b_id: 1 }, { unique: true });

// Pre-save middleware to automatically calculate the distance
EdgeSchema.pre('save', async function(next) {
  try {
    // Fetch the nodes to get their coordinates
    const nodeA = await Node.findById(this.a_id);
    const nodeB = await Node.findById(this.b_id);
    
    if (!nodeA || !nodeB) {
      throw new Error('Cannot find both nodes to calculate distance');
    }
    
    if (this.coordinates.length === 0) {
      // If no coordinates were provided, use direct path between nodes
      this.coordinates = [nodeA.coordinates, nodeB.coordinates];
      this.distance = calculateDistance(nodeA.coordinates, nodeB.coordinates);
    } else {
      // Calculate total path distance: nodeA -> coordinates -> nodeB
      let totalDistance = 0;
      
      // Distance from nodeA to first coordinate point
      totalDistance += calculateDistance(nodeA.coordinates, this.coordinates[0]);
      
      // Distance along the path of coordinates
      if (this.coordinates.length > 1) {
        totalDistance += calculatePathDistance(this.coordinates);
      }
      
      // Distance from last coordinate point to nodeB
      const lastCoord = this.coordinates[this.coordinates.length - 1];
      totalDistance += calculateDistance(lastCoord, nodeB.coordinates);
      
      this.distance = totalDistance;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Edge', EdgeSchema);