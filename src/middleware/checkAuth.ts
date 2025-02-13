import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import AuthConfig from "../config/authConfig.js";
import { CustomRequest, JwtPayload } from "../interfaces/auth/index.js";
import ResponseUtil from "../utils/Response/responseUtils.js";

export const checkAuth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader) {
    res.status(410).json({ message: "UnAuthorized Request" });
  }

  const token = tokenHeader && tokenHeader.split(" ")[1];

  jwt.verify(String(token), String(AuthConfig.JWT_SECRET), (err, decoded) => {
    if (err) {
      res.status(410).json({ message: "Invalid Token" });
    }

    const decodedPayload = decoded as JwtPayload;
    req.userId = decodedPayload.id;
    req.email = decodedPayload.email;

    next();
  });
};
