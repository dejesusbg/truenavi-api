import { NextFunction, Request, Response } from "express";
import Preferences from "../models/Preferences";

// @desc    Get device preferences
// @route   GET /api/preferences
// @access  Public or device-authenticated
export const getPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const device_id = req.headers["device-id"] as string;

  if (!device_id) {
    return res.status(400).json({
      success: false,
      error: "Missing device-id in headers",
    });
  }

  try {
    let preferences = await Preferences.findOne({ device_id });

    if (!preferences) {
      preferences = await Preferences.create({ device_id });
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

// @desc    Update device preferences
// @route   PUT /api/preferences
// @access  Public or device-authenticated
export const updatePreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const device_id = req.headers["device-id"] as string;

  if (!device_id) {
    return res.status(400).json({
      success: false,
      error: "Missing device-id in headers",
    });
  }

  try {
    let preferences = await Preferences.findOne({ device_id });

    if (!preferences) {
      preferences = await Preferences.create({
        device_id,
        ...req.body,
      });
    } else {
      preferences = await Preferences.findOneAndUpdate(
        { device_id },
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
