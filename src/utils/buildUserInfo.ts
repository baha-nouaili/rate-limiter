import { RequestTrackerPayload } from "../interface/RequestTracker.interfaces";

export const buildUserInfo = ({
  requestCount,
  totalRequests,
  windowSizeInSeconds,
}: {
  requestCount: number;
  totalRequests: number;
  windowSizeInSeconds: number;
}) => ({
  totalRequestsAllowedPerWindowSize: totalRequests,
  windowSizeInSeconds,
  availableRequests: totalRequests - requestCount,
});
