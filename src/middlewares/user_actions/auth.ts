import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/userModel';
import ErrorHandler from '../../utils/errorHandler';
import asyncErrorHandler from '../helpers/asyncErrorHandler';

interface RouteConfig {
  publicRoutes: string[];
  protectedRoutes: string[];
}

const routeConfig: RouteConfig = {
  publicRoutes: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/404'
  ],
  protectedRoutes: [
    '/arcana',
    '/bridge',
    '/collab',
    '/dashboard',
    '/developer',
    '/gamer',
    '/ranking'
  ]
};


interface RequestWithUser extends Express.Request {
  user?: IUser;
}

export const checkRouteAccess = asyncErrorHandler(
  async (req: RequestWithUser, res: Express.Response, next: Express.NextFunction) => {
    const path = req.path;
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (routeConfig.publicRoutes.some(publicRoute =>
      path === publicRoute || path.startsWith(publicRoute + '/')
    )) {
      return next();
    }

    if (routeConfig.protectedRoutes.some(protectedRoute =>
      path === protectedRoute || path.startsWith(protectedRoute + '/')
    )) {
      if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
      }

      try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        req.user = await User.findById(decodedData.id);
        
        if (!req.user) {
          return next(new ErrorHandler("User not found", 404));
        }

        return next();
      } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
      }
    }

    // Default allow (or return 404 if you prefer)
    next();
  }
);

export const isAuthenticatedUser = asyncErrorHandler(
  async (req: RequestWithUser, res: Express.Response, next: Express.NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new ErrorHandler("Please Login to Access", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = await User.findById(decodedData.id);
    
    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
    
    next();
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: RequestWithUser, res: Express.Response, next: Express.NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403)
      );
    }
    
    next();
  };
};

export const hasPermission = (permission: string) => {
  return (req: RequestWithUser, res: Express.Response, next: Express.NextFunction) => {
    if (!req.user?.permissions?.includes(permission)) {
      return next(new ErrorHandler("Insufficient permissions", 403));
    }
    next();
  };
};
