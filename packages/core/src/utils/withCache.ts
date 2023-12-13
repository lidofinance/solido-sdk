const cache: Map<string, unknown> = new Map();

/**
 * @param fn function to execute
 * @param key cache key
 * @param timeout in miliseconds
 * @returns fn result
 */
export function withCache<T>(fn: () => Promise<T>, key: string, timeout: number = 7 * 1000) {
  return async (): Promise<T> => {
    const cached = await cache.get(key);

    if (cached) {
      return cached as T;
    }

    const result = await fn();
    cache.set(key, result);

    setTimeout(() => {
      cache.set(key, undefined);
    }, timeout);

    return result;
  };
}
