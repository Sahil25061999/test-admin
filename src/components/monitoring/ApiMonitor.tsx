"use client";

import { useState, useEffect } from 'react';
import { ErrorHandler, ApiCache, RateLimiter } from '../../lib/error-handler';

interface MonitoringData {
  errorCount: number;
  recentErrors: any[];
  cacheStats: {
    size: number;
    hitRate: number;
  };
  rateLimitStats: {
    remainingRequests: number;
    totalRequests: number;
  };
}

export function ApiMonitor() {
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    errorCount: 0,
    recentErrors: [],
    cacheStats: { size: 0, hitRate: 0 },
    rateLimitStats: { remainingRequests: 0, totalRequests: 0 },
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMonitoringData = () => {
      const errorHandler = ErrorHandler.getInstance();
      const errorLog = errorHandler.getErrorLog();
      
      setMonitoringData({
        errorCount: errorLog.length,
        recentErrors: errorLog.slice(-5), // Last 5 errors
        cacheStats: {
          size: 0, // TODO: Implement cache size tracking
          hitRate: 0, // TODO: Implement cache hit rate
        },
        rateLimitStats: {
          remainingRequests: 100, // TODO: Implement rate limit tracking
          totalRequests: 0,
        },
      });
    };

    // Update every 5 seconds
    const interval = setInterval(updateMonitoringData, 5000);
    updateMonitoringData();

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg z-50"
        title="Show API Monitor"
      >
        🔧
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">API Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Error Summary */}
        <div className="bg-red-50 p-3 rounded">
          <h4 className="font-medium text-red-800">Errors</h4>
          <p className="text-2xl font-bold text-red-600">{monitoringData.errorCount}</p>
          {monitoringData.recentErrors.length > 0 && (
            <details className="mt-2">
              <summary className="text-sm text-red-600 cursor-pointer">Recent Errors</summary>
              <div className="mt-2 space-y-1">
                {monitoringData.recentErrors.map((error, index) => (
                  <div key={index} className="text-xs text-red-700 bg-red-100 p-2 rounded">
                    <div className="font-medium">{error.message}</div>
                    <div className="text-red-600">{error.context || error.operation}</div>
                    <div className="text-red-500">{error.timestamp}</div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Cache Stats */}
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="font-medium text-blue-800">Cache</h4>
          <div className="flex justify-between">
            <span className="text-sm text-blue-600">Size: {monitoringData.cacheStats.size}</span>
            <span className="text-sm text-blue-600">Hit Rate: {monitoringData.cacheStats.hitRate}%</span>
          </div>
        </div>

        {/* Rate Limit Stats */}
        <div className="bg-green-50 p-3 rounded">
          <h4 className="font-medium text-green-800">Rate Limit</h4>
          <div className="flex justify-between">
            <span className="text-sm text-green-600">Remaining: {monitoringData.rateLimitStats.remainingRequests}</span>
            <span className="text-sm text-green-600">Total: {monitoringData.rateLimitStats.totalRequests}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              ErrorHandler.getInstance().clearErrorLog();
              setMonitoringData(prev => ({ ...prev, errorCount: 0, recentErrors: [] }));
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Clear Errors
          </button>
          <button
            onClick={() => {
              // TODO: Implement cache clear
              // console.log('Cache cleared');
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
} 