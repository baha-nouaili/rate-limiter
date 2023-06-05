import { NextFunction, Request, Response } from "express";
import { address } from "ip";
import { getClientIp } from "request-ip";

export const userIdentificationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers.me || getClientIp(req) || address();
  req.body.userId = userId;
  next();
};
