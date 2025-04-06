const mongoose = require("mongoose");

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
      validator: function (v) {
        return v.length > 0 && v.every((coord) => coord.length === 2);
      },
      message: (props) => "Coordinates must be an array of [lat, lng] pairs!",
    },
  },
  distance: {
    type: Number,
    required: true,
    min: 0,
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

// Compound index for faster lookups
EdgeSchema.index({ a_id: 1, b_id: 1 }, { unique: true });

module.exports = mongoose.model("Edge", EdgeSchema);
