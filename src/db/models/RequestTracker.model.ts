import mongoose from "mongoose";
import {
  RequestTrackerDocument,
  RequestTrackerModel,
  RequestTrackerPayload,
} from "../../interface/RequestTracker.interfaces";

export const requestTrackerSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        (ret.id = ret._id), delete ret._id, delete ret.__v;
      },
    },
  }
);

// could be placed in a repo layer later
requestTrackerSchema.statics.insertOne = (payload: RequestTrackerPayload) => {
  return RequestTracker.create(payload);
};

const RequestTracker = mongoose.model<
  RequestTrackerDocument,
  RequestTrackerModel
>("RequestTracker", requestTrackerSchema);

export { RequestTracker };
