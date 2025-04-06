const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 2;
      },
      message: (props) => `${props.value} is not a valid coordinate pair!`,
    },
    index: "2dsphere", // Create geospatial index for location queries
  },
  next: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
  ],
  timestamp: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

module.exports = mongoose.model("Node", NodeSchema);
