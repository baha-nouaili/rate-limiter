import { Model, Document } from "mongoose";

export interface RequestTrackerPayload {
  userId: string;
  requestCount: number;
  lastActivity: number;
}

export interface RequestTrackerDocument extends Document {
  userId: string;
  requestCount: number;
  lastActivity: number;
}

export interface RequestTrackerModel extends Model<RequestTrackerDocument> {
  insertOne(payload: RequestTrackerPayload): Promise<RequestTrackerDocument>;
}
