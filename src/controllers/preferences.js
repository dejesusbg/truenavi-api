const Preferences = require("../models/Preferences");

// @desc    Get user preferences
// @route   GET /api/preferences
// @access  Private
exports.getPreferences = async (req, res, next) => {
  try {
    const preferences = await Preferences.findOne({ user: req.user.id });

    if (!preferences) {
      // Create default preferences if none exists
      const defaultPreferences = await Preferences.create({
        user: req.user.id,
      });

      return res.status(200).json({
        success: true,
        data: defaultPreferences,
      });
    }

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update preferences
// @route   PUT /api/preferences
// @access  Private
exports.updatePreferences = async (req, res, next) => {
  try {
    let preferences = await Preferences.findOne({ user: req.user.id });

    if (!preferences) {
      // Create with updated values if none exists
      preferences = await Preferences.create({
        user: req.user.id,
        ...req.body,
      });
    } else {
      // Update existing preferences
      preferences = await Preferences.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
