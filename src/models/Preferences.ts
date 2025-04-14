import mongoose from "mongoose";

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
  vibration: {
    type: Boolean,
    default: true,
  },
});

const Preferences = mongoose.model("Preferences", PreferencesSchema);
export default Preferences;
