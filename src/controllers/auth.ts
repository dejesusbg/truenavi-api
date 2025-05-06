import { NextFunction, Request, Response } from 'express';
import Admin from '../models/Admin';

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // create user
    const admin = await Admin.create({ name, email, password });
    sendTokenResponse(admin, 201, res);
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    // validate email & password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Please provide an email and password' });
    }

    // check for admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(admin, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

// @desc    Log admin out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, data: {} });
};

// get token from model, create cookie and send response
const sendTokenResponse = (admin: any, statusCode: number, res: Response) => {
  const token = admin.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '1', 10) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).json({ success: true, token });
};
