import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserInstance } from "../services/registration/models/userModel";
import db from "../database/db_connection";
// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: UserInstance;
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as {
      id?: number;
      role?: string;
      email?: string;
    };
    const user = await db.User.findOne({ where: { id: decoded.id } });

    if ((user && user.role === "admin") || (user && user.role === "user")) {
      req.user = user;
      next();
    } else {
      return res
        .status(403)
        .json({
          message: "Access denied. Admins or User only, not for guest.",
        });
    }
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).json({ message: "Invalid token." });
  }
};
