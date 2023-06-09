import mongoose from "mongoose";
import {
  RequestTrackerDocument,
  RequestTrackerModel,
  RequestTrackerPayload,
} from "../../interface/RequestTracker.interfaces";

export const requestTrackerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  requestCount: {
    type: Number,
    required: true,
    default: 0,
  },
  lastActivity: {
    type: Number,
    required: true,
  },
  locked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// could be placed in a repo layer later
requestTrackerSchema.statics.insertOne = function (
  payload: RequestTrackerPayload
) {
  return this.create(payload);
};

requestTrackerSchema.statics.findByUserId = function (userId: string) {
  return this.findOne({ userId });
};

const RequestTracker = mongoose.model<
  RequestTrackerDocument,
  RequestTrackerModel
>("RequestTracker", requestTrackerSchema);

export { RequestTracker };
