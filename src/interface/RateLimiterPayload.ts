export interface RateLimiterPayload {
  windowSize: number;
  maxRequestCountInWindow: number;
}
