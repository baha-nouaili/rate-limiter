import { NextFunction, Request, Response } from "express";
import { RateLimiterPayload } from "../interface/RateLimiterPayload";
import { now } from "moment";
import { RequestTracker as requestTrackerModel } from "../db/models/RequestTracker.model";
import { buildUserInfo } from "../utils/buildUserInfo";

/**
 *
 * @param windowSize the time window which will be used by the rate limiter (this is not a fixed window size it will dynamically reset for each new request)
 * @param windowSize the windowSize take seconds as its unit.
 * @param maxRequestCountInWindow the number of requests allowed withtin the window size range for each user (a user is defined by IP or by setting the me prop in the headers).
 */

export const rateLimiterMiddleware =
  ({ windowSize, maxRequestCountInWindow }: RateLimiterPayload) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const windowSizeInMs = windowSize * 1000;
    const userId = req.body.userId;
    const currentRequest = await requestTrackerModel.findByUserId(userId);

    if (!currentRequest) {
      const request = await requestTrackerModel.insertOne({
        userId,
        lastActivity: now(),
        requestCount: 1,
      });

      if (!request) {
        return next({});
      }

      const userInfo = buildUserInfo({
        request,
        totalRequests: maxRequestCountInWindow,
        windowSizeInSeconds: windowSize,
      });

      req.body.userInfo = userInfo;

      return next();
    }

    const diff = now() - currentRequest.lastActivity;

    if (
      diff < windowSizeInMs &&
      currentRequest.requestCount < maxRequestCountInWindow
    ) {
      const updatedRequest = await requestTrackerModel.findOneAndUpdate(
        { userId },
        { lastActivity: now(), requestCount: currentRequest.requestCount + 1 },
        { new: true }
      );
      if (!updatedRequest) {
        return next({});
      }

      const userInfo = buildUserInfo({
        request: updatedRequest,
        totalRequests: maxRequestCountInWindow,
        windowSizeInSeconds: windowSize,
      });

      req.body.userInfo = userInfo;

      return next();
    } else if (diff >= windowSizeInMs) {
      const updatedRequest = await requestTrackerModel.findOneAndUpdate(
        { userId },
        { lastActivity: now(), requestCount: 1 },
        { new: true }
      );

      if (!updatedRequest) {
        return next({});
      }

      const userInfo = buildUserInfo({
        request: updatedRequest,
        totalRequests: maxRequestCountInWindow,
        windowSizeInSeconds: windowSize,
      });

      req.body.userInfo = userInfo;

      return next();
    } else {
      return res.status(429).json({ message: "Too Many Requests" });
    }
  };
