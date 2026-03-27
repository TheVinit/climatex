/**
 * Performance monitoring and analytics utility
 * Tracks page load times, API calls, and user interactions
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  type: 'load' | 'api' | 'render' | 'interaction';
  timestamp: number;
  status?: 'success' | 'error';
  details?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100;

  trackMetric(name: string, duration: number, type: PerformanceMetric['type'], status?: 'success' | 'error', details?: Record<string, unknown>) {
    const metric: PerformanceMetric = {
      name,
      duration,
      type,
      timestamp: Date.now(),
      status,
      details,
    };

    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow operations
    if (duration > 1000) {
      console.warn(`⚠️ Slow ${type}: ${name} took ${duration}ms`, details);
    }
  }

  trackAPICall(endpoint: string, duration: number, status: 'success' | 'error') {
    this.trackMetric(`API: ${endpoint}`, duration, 'api', status);
  }

  trackPageLoad(pageName: string, duration: number) {
    this.trackMetric(`Page: ${pageName}`, duration, 'load', 'success');
  }

  trackInteraction(action: string, duration?: number) {
    this.trackMetric(`Action: ${action}`, duration || 0, 'interaction', 'success');
  }

  getMetrics() {
    return this.metrics;
  }

  getSummary() {
    const avgDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length || 0;
    const errorCount = this.metrics.filter(m => m.status === 'error').length;
    const slowCount = this.metrics.filter(m => m.duration > 1000).length;

    return {
      totalMetrics: this.metrics.length,
      averageDuration: Math.round(avgDuration),
      errorCount,
      slowCount,
      metrics: this.metrics,
    };
  }

  clear() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook to track component render and data fetch performance
 */
export function usePerformanceTracking(pageName: string) {
  const startTimeRef = React.useRef(Date.now());

  React.useEffect(() => {
    const duration = Date.now() - startTimeRef.current;
    performanceMonitor.trackPageLoad(pageName, duration);
  }, [pageName]);

  return {
    trackAction: (action: string) => performanceMonitor.trackInteraction(`${pageName}: ${action}`),
    recordAPICall: (endpoint: string, duration: number, status: 'success' | 'error') =>
      performanceMonitor.trackAPICall(endpoint, duration, status),
  };
}
