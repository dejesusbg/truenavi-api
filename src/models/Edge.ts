import mongoose from "mongoose";
import Node from "./Node";
import { calculateDistance, calculatePathDistance } from "../utils/distance";

const EdgeSchema = new mongoose.Schema({
  a_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
    required: true,
  },
  b_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
    required: true,
  },
  coordinates: {
    type: [[Number]],
    required: true,
    validate: {
      validator: (v: number[][]) => {
        return v.length > 0 && v.every((coord: number[]) => coord.length === 2);
      },
      message: () => "coordinates must be an array of [lat, lng] pairs!",
    },
  },
  distance: {
    type: Number,
    min: 0,
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

// compound index for faster lookups
EdgeSchema.index({ a_id: 1, b_id: 1 }, { unique: true });

// pre-save middleware to automatically calculate the distance
EdgeSchema.pre("save", async function (next) {
  try {
    // fetch the nodes to get their coordinates
    const nodeA = await Node.findById(this.a_id);
    const nodeB = await Node.findById(this.b_id);

    if (!nodeA || !nodeB) {
      throw new Error("cannot find both nodes to calculate distance");
    }

    if (this.coordinates.length === 0) {
      // if no coordinates were provided, use direct path between nodes
      this.coordinates = [nodeA.coordinates, nodeB.coordinates];
      this.distance = calculateDistance(nodeA.coordinates, nodeB.coordinates);
    } else {
      // calculate total path distance: nodeA -> coordinates -> nodeB
      let totalDistance = 0;

      // distance from nodeA to first coordinate point
      totalDistance += calculateDistance(
        nodeA.coordinates,
        this.coordinates[0]
      );

      // distance along the path of coordinates
      if (this.coordinates.length > 1) {
        totalDistance += calculatePathDistance(this.coordinates);
      }

      // distance from last coordinate point to nodeB
      const lastCoord = this.coordinates[this.coordinates.length - 1];
      totalDistance += calculateDistance(lastCoord, nodeB.coordinates);

      this.distance = totalDistance;
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

const Edge = mongoose.model("Edge", EdgeSchema);
export default Edge;
