import { Model, Document } from "mongoose";

export interface RequestTrackerPayload {
  userId: string;
  requestCount: number;
  lastActivity: number;
  locked: boolean;
}

export interface RequestTrackerDocument extends Document {
  userId: string;
  requestCount: number;
  lastActivity: number;
  locked: boolean;
}

export interface RequestTrackerModel extends Model<RequestTrackerDocument> {
  insertOne(
    payload: Partial<RequestTrackerPayload>
  ): Promise<RequestTrackerDocument>;
  findByUserId(userId: string): Promise<RequestTrackerDocument>;
}
