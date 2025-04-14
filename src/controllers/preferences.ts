import { NextFunction, Request, Response } from "express";
import Preferences from "../models/Preferences";

// @desc    Get user preferences
// @route   GET /api/preferences
// @access  Private
export const getPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const preferences = await Preferences.findOne({ user: req.user.id });

    if (!preferences) {
      // create default preferences if none exists
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
      error: (error as Error).message,
    });
  }
};

// @desc    Update preferences
// @route   PUT /api/preferences
// @access  Private
export const updatePreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let preferences = await Preferences.findOne({ user: req.user.id });

    if (!preferences) {
      // create with updated values if none exists
      preferences = await Preferences.create({
        user: req.user.id,
        ...req.body,
      });
    } else {
      // update existing preferences
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
      error: (error as Error).message,
    });
  }
};
