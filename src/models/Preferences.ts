import mongoose from 'mongoose';

const PreferencesSchema = new mongoose.Schema({
  device_id: { type: String, required: true, unique: true, index: true },
  spanish: { type: Boolean, default: true },
  weather: { type: Boolean, default: true },
  vibration: { type: Boolean, default: true },
});

const Preferences = mongoose.model('Preferences', PreferencesSchema);
export default Preferences;
