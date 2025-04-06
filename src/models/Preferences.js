const mongoose = require("mongoose");

const PreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true,
  },
  language: {
    type: String,
    enum: ["es", "en"],
    default: "es",
  },
  showWeather: {
    type: Boolean,
    default: true,
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  vibration: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Preferences", PreferencesSchema);
