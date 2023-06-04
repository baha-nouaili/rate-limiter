import { RequestTrackerPayload } from "../interface/RequestTracker.interfaces";

export const buildUserInfo = ({
  request,
  totalRequests,
  windowSizeInSeconds,
}: {
  request: RequestTrackerPayload;
  totalRequests: number;
  windowSizeInSeconds: number;
}) => ({
  totalRequestsAllowedPerWindowSize: totalRequests,
  windowSizeInSeconds,
  availableRequests: totalRequests - request.requestCount,
});
