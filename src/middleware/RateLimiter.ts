import { NextFunction, Request, Response } from "express";
import { now } from "moment";

import { RequestTracker as requestTrackerModel } from "../db/models/RequestTracker.model";
import { buildUserInfo } from "../utils/buildUserInfo";

export class RateLimiterMiddleware {
  private windowSizeInMs: number;
  private maxRequestCountInWindow: number;

  /**
   *
   * @param windowSize The time window which will be used by the rate limiter (this is not a fixed window size it will dynamically reset for each new request)
   * @param windowSize The windowSize take seconds as its unit.
   * @param maxRequestCountInWindow The number of requests allowed withtin the window size range for each user (a user is defined by IP or by setting the me prop in the headers).
   */

  constructor({
    maxRequestCountInWindow,
    windowSize,
  }: {
    windowSize: number;
    maxRequestCountInWindow: number;
  }) {
    this.windowSizeInMs = windowSize * 1000;
    this.maxRequestCountInWindow = maxRequestCountInWindow;
  }

  public async validateReq(req: Request, res: Response, next: NextFunction) {
    const userId = req.body.userId;
    const currentRequest = await requestTrackerModel.findByUserId(userId);

    if (!currentRequest) {
      const request = await this.registerANewClient(userId);

      if (!request) {
        return next({});
      }

      const userInfo = this.getUserInfo(request.requestCount);
      req.body.userInfo = userInfo;

      return next();
    }

    const diff = now() - currentRequest.lastActivity;

    if (
      diff < this.windowSizeInMs &&
      currentRequest.requestCount < this.maxRequestCountInWindow
    ) {
      const updatedRequest = await this.updateClientRequest({
        requestCount: currentRequest.requestCount + 1,
        userId,
      });

      if (!updatedRequest) {
        return next({});
      }

      const userInfo = this.getUserInfo(updatedRequest.requestCount);
      req.body.userInfo = userInfo;

      return next();
    } else if (diff >= this.windowSizeInMs) {
      const updatedRequest = await this.updateClientRequest({
        userId,
        requestCount: 1,
      });

      if (!updatedRequest) {
        return next({});
      }

      const userInfo = this.getUserInfo(updatedRequest.requestCount);
      req.body.userInfo = userInfo;

      return next();
    } else {
      return res.status(429).json({ message: "Too Many Requests" });
    }
  }

  private async registerANewClient(userId: string) {
    return await requestTrackerModel.insertOne({
      userId,
      lastActivity: now(),
      requestCount: 1,
    });
  }

  private async updateClientRequest({
    requestCount,
    userId,
  }: {
    userId: string;
    requestCount: number;
  }) {
    return await requestTrackerModel.findOneAndUpdate(
      { userId },
      { lastActivity: now(), requestCount },
      { new: true }
    );
  }

  private getUserInfo(requestCount: number) {
    return buildUserInfo({
      requestCount: requestCount,
      totalRequests: this.maxRequestCountInWindow,
      windowSizeInSeconds: this.windowSizeInMs / 1000,
    });
  }
}
