import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";
import { IUser } from "../models/User.ts";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      ) as { id: string };

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

// Admin middleware
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as IUser).role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};
