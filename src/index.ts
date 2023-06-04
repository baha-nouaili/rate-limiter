import { config } from "dotenv";
config();
import * as express from "express";
import { Request, Response } from "express";
import {
  userIdentificationMiddleware,
  rateLimiterMiddleware,
} from "./middleware";

const app = express();

app.use(express.json());
app.use(userIdentificationMiddleware);

const rateLimiter = rateLimiterMiddleware({
  maxRequestCountInWindow: 10,
  windowSize: 1,
});
app.use(rateLimiter);

app.get("/ping", (req: Request, res: Response) => {
  const userId = req.body.userId;
  res.status(200).json({ message: `You made it ${userId}!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Process running on port ${PORT}...`);
});
