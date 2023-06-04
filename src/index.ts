import { config } from "dotenv";
config();
import * as express from "express";
import { Request, Response } from "express";

const app = express();

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "pong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Process running on port ${PORT}...`);
});
