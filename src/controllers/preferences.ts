import { NextFunction, Request, Response } from 'express';
import Preferences from '../models/Preferences';

// @desc    Get device preferences
// @route   GET /api/preferences
// @access  Public or device-authenticated
export const getPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const deviceId = req.headers['Device-ID'] as string;

    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'Missing Device-ID in headers' });
    }

    let preferences = await Preferences.findOne({ deviceId });

    if (!preferences) {
      preferences = await Preferences.create({ deviceId });
    }

    res.status(200).json({ success: true, data: preferences });
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
  try {
    const deviceId = req.headers['Device-ID'] as string;

    if (!deviceId) {
      return res.status(400).json({ success: false, error: 'Missing Device-ID in headers' });
    }

    let preferences = await Preferences.findOne({ deviceId });

    if (!preferences) {
      preferences = await Preferences.create({ deviceId, ...req.body });
    } else {
      preferences = await Preferences.findOneAndUpdate({ deviceId }, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};
