import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as any);
    if (typeof decoded === 'object' && 'id' in decoded) {
      req.user = await Admin.findById(decoded.id);
    } else {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
};
