// Sheet Cache Service: Handles in-memory/file/redis caching
import NodeCache from 'node-cache';

const cache = new NodeCache();

export function getCache(key: string) {
  return cache.get(key);
}

export function setCache(key: string, value: any, ttlSeconds: number) {
  cache.set(key, value, ttlSeconds);
}

export function delCache(key: string) {
  cache.del(key);
}

export function flushCache() {
  cache.flushAll();
}
