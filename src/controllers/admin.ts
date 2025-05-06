import { NextFunction, Request, Response } from 'express';
import Admin from '../models/Admin';

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private
export const getAdmins = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, count: admins.length, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Update an admin
// @route   PUT /api/admins/:id
// @access  Private
export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const admin = await Admin.findById(req.params.id).select('+password');

    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    if (req.body.password) {
      admin.password = req.body.password;
    }

    ['name', 'email'].forEach((field) => {
      if (req.body[field] != null) {
        (admin as any)[field] = req.body[field];
      }
    });

    await admin.save();
    const { password, ...adminWithoutPassword } = admin.toObject();
    res.status(200).json({ success: true, data: adminWithoutPassword });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Delete an admin
// @route   DELETE /api/admins/:id
// @access  Private
export const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    await admin.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
