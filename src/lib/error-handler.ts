// Comprehensive error handling and monitoring system

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  timestamp?: string;
  context?: string;
  operation?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ApiError[] = [];
  private maxLogSize = 100;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Log error for monitoring
  logError(error: ApiError): void {
    this.errorLog.push({
      ...error,
      timestamp: new Date().toISOString(),
    });

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error?.details?.detail);
    }

    // TODO: Send to monitoring service in production
    this.sendToMonitoring(error);
  }

  // Send error to monitoring service
  private sendToMonitoring(error: ApiError): void {
    // TODO: Implement monitoring service integration
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      // Send to monitoring service
      // console.log('Sending error to monitoring service:', error);
    }
  }

  // Get error log for debugging
  getErrorLog(): ApiError[] {
    return [...this.errorLog];
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Parse API error response
  static parseApiError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || "API request failed",
        status: error.response.status,
        code: error.response.data?.code,
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message: "Network error - no response received",
        status: 0,
        code: "NETWORK_ERROR",
        details: error.request,
      };
    } else {
      return {
        message: error.message || "Unknown error occurred",
        code: "UNKNOWN_ERROR",
        details: error,
      };
    }
  }

  // Handle fetch errors
  static async handleFetchError(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();
      return {
        message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: data.code,
        details: data,
      };
    } catch {
      return {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: "PARSE_ERROR",
      };
    }
  }

  // Retry logic for failed requests
  static async retryRequest<T>(requestFn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError;
  }
}

// Utility function for client-side error handling
export const handleClientError = (error: any, context: string = "Unknown"): ApiError => {
  const parsedError = ErrorHandler.parseApiError(error);
  const errorWithContext = {
    ...parsedError,
    context,
    timestamp: new Date().toISOString(),
  };

  ErrorHandler.getInstance().logError(errorWithContext);
  return parsedError;
};

// Utility function for server-side error handling
export const handleServerError = (error: any, operation: string = "Unknown"): ApiError => {
  const parsedError = ErrorHandler.parseApiError(error);
  const errorWithContext = {
    ...parsedError,
    operation,
    timestamp: new Date().toISOString(),
  };

  ErrorHandler.getInstance().logError(errorWithContext);
  return parsedError;
};

// Rate limiting utility
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      this.requests.set(key, [now]);
      return true;
    }

    const requests = this.requests.get(key)!;
    const recentRequests = requests.filter((time) => time > windowStart);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(key)) {
      return this.maxRequests;
    }

    const requests = this.requests.get(key)!;
    const recentRequests = requests.filter((time) => time > windowStart);

    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}

// Cache utility for API responses
export class ApiCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}
