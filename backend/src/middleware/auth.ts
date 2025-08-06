import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token - user not found' 
      });
      return;
    }

    req.user = {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = {
          id: (user._id as any).toString(),
          email: user.email,
          name: user.name
        };
      }
    }

    next();
  } catch (error) {
    // Continue without user context if token is invalid
    next();
  }
};