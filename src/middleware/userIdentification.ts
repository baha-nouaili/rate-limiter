import { NextFunction, Request, Response } from "express";
import { address } from "ip";

export const userIdentificationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = address();
  req.body.userId = userId;
  next();
};
