import { config } from "dotenv";
config();

import * as express from "express";
import { Request, Response, NextFunction } from "express";

import {
  userIdentificationMiddleware,
  rateLimiterMiddleware,
  simpleErrorHandling,
} from "./middleware";

import { connectToMongo } from "./db/connect";

const app = express();

app.use(express.json());
app.use(userIdentificationMiddleware);

const rateLimiter = rateLimiterMiddleware({
  maxRequestCountInWindow: 5,
  windowSize: 60,
});

app.use(rateLimiter);

app.get("/ping", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const userInfo = req.body.userInfo;
    res.status(200).json({ message: `You made it ${userId}!`, ...userInfo });
  } catch (error) {
    next();
  }
});

app.use(simpleErrorHandling);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`Process running on port ${PORT}...`);
});
