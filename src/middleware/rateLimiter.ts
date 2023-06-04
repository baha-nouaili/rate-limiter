import { NextFunction, Request, Response } from "express";
import { RateLimiterPayload } from "../interface/RateLimiterPayload";
import { now } from "moment";

/**
 *
 * @param windowSize the time window which will be used by the rate limiter (this is not a fixed window size it will dynamically reset for each new request)
 * @param windowSize the windowSize take seconds as its unit.
 * @param  maxRequestCountInWindow the number of requests allowed withtin the window size range for each user (a user is defined by IP or by setting the me prop in the headers).
 */

export const rateLimiterMiddleware =
  ({ windowSize, maxRequestCountInWindow }: RateLimiterPayload) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const currentTime = now();

    next();
  };
