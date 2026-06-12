import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.ts";
import { User } from "../models/User.ts";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      session?: Record<string, any>;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | null = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token found" });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized, token expired or invalid" });
    }

    const dbUser = await User.findById(decoded.userId);
    if (!dbUser) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    const userObj = dbUser.toObject();
    // Attach user and session to request object with mapped fields for compatibility
    req.user = {
      ...userObj,
      id: userObj._id.toString(),
      emailVerified: userObj.isVerified,
    };
    req.session = { userId: userObj._id.toString() };

    next();
  } catch (error: any) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Admin middleware
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as any).role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as an admin" });
  }
};

// Host middleware
export const isHost = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as any).role === "host") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as a host" });
  }
};

// Verified Host middleware
export const isVerifiedHost = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as any).role === "host" && (req.user as any).emailVerified === true) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized or host is not verified" });
  }
};
