/**
 * Network retry utility with exponential backoff
 * Handles transient failures and improves reliability
 */

interface RetryConfig {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 300,
    maxDelayMs = 5000,
    backoffMultiplier = 2,
    onRetry,
  } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      const delay = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt),
        maxDelayMs
      );

      onRetry?.(attempt + 1, lastError);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Smart API call with retry and timeout
 */
export async function callApi<T>(
  endpoint: string,
  baseUrl: string = 'http://localhost:5000',
  options: RequestInit & { timeout?: number } = {}
): Promise<T | null> {
  try {
    const result = await withRetry(
      () => {
        const url = `${baseUrl}${endpoint}`;
        return fetchWithTimeout(url, options);
      },
      {
        maxRetries: 2,
        initialDelayMs: 200,
        onRetry: (attempt, error) => {
          console.warn(`Retry attempt ${attempt}: ${error.message}`);
        },
      }
    );

    if (!result.ok) {
      console.error(`API error: ${result.status} ${result.statusText}`);
      return null;
    }

    return await result.json();
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
}
