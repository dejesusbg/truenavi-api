import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
  name: { type: String, unique: true, sparse: true, trim: true },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: (v: number[]) => v.length === 2,
      message: () => `Coordinates must be an array of [lat, lng] pairs`,
    },
    index: '2dsphere', // geospatial index for location queries
  },
  timestamp: { type: String, default: () => new Date().toISOString() },
});

const Node = mongoose.model('Node', NodeSchema);
export default Node;
